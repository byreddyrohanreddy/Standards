import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.models.schemas import (
    RequirementAnalysisRequest,
    AnalysisResponse,
    StandardMetadata,
    GraphData,
    VersionAlert,
    RelatedStandardsCategorized
)
from backend.services.nlp_extractor import extract_requirements
from backend.services.retrieval_engine import HybridRetrievalEngine
from backend.services.graph_service import StandardsGraphService
from backend.services.version_auditor import VersionAuditor
from backend.services.pdf_service import PDFParserService

app = FastAPI(
    title="BIS-SpecAI API",
    description="AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
retrieval_engine = HybridRetrievalEngine(standards_path="data/standards.json")
graph_service = StandardsGraphService(standards_path="data/standards.json", relationships_path="data/relationships.json")
version_auditor = VersionAuditor(standards_path="data/standards.json")
pdf_service = PDFParserService()

# Load Certifications & Examples
with open("data/certifications.json", "r", encoding="utf-8") as f:
    CERTIFICATIONS_DATA = json.load(f)

with open("data/examples.json", "r", encoding="utf-8") as f:
    EXAMPLES_DATA = json.load(f)

def run_pipeline(query: str, top_k: int = 5) -> AnalysisResponse:
    # 1. NLP Requirement Extraction
    req = extract_requirements(query)

    # 2. Version and Supersession Audit
    version_alerts = version_auditor.audit_text_for_versions(query, req.detected_standards)

    # 3. Hybrid Candidate Retrieval (BM25 + Semantic Cosine + Parameter Coverage + Reranking)
    candidates = retrieval_engine.retrieve_candidates(query, req, top_k=top_k)

    if not candidates:
        empty_graph = GraphData(nodes=[], edges=[])
        empty_rel = RelatedStandardsCategorized()
        return AnalysisResponse(
            query=query,
            extracted_requirements=req,
            primary_standard=None,
            candidate_standards=[],
            related_standards=empty_rel,
            version_alerts=version_alerts,
            certifications=[],
            graph_data=empty_graph,
            summary_explanation="No closely matching Indian Standards found for this specification."
        )

    # Primary recommended standard is candidate rank #1
    primary_std = candidates[0]

    # If the user specifically cited a superseded standard, make sure the replacement is surfaced or recommended
    if primary_std.status == "superseded" and primary_std.superseded_by:
        rep_std_data = retrieval_engine.get_standard_by_number(primary_std.superseded_by)
        if rep_std_data:
            # Check if rep is in candidates, or promote it
            pass

    # 4. Traversal of Related Standards (Normative, Testing, Safety, Installation, Superseded)
    related_standards = graph_service.get_related_standards(primary_std)

    # 5. Build Interactive React Flow Graph
    graph_data = graph_service.build_react_flow_graph(primary_std, related_standards)

    # 6. Check applicable certification schemes
    applicable_certs = []
    for cert_scheme in CERTIFICATIONS_DATA:
        for item in cert_scheme.get("mandatory_items", []):
            if primary_std.is_number in item or (req.product and req.product.lower() in item.lower()):
                applicable_certs.append(cert_scheme)
                break

    # 7. Synthesize Transparent Summary Explanation
    summary = (
        f"Selected {primary_std.is_number} as the primary applicable standard with an "
        f"AI relevance score of {primary_std.ai_relevance_score}%. "
        f"The specification requires a {req.product} in {req.application}. "
        f"Mapped {len(related_standards.normative_references)} normative references, "
        f"{len(related_standards.testing_standards)} testing standards, and "
        f"{len(related_standards.safety_standards)} safety standards."
    )
    if version_alerts:
        summary += f" Detected {len(version_alerts)} obsolete or superseded standard references in the requirement text."

    return AnalysisResponse(
        query=query,
        extracted_requirements=req,
        primary_standard=primary_std,
        candidate_standards=candidates,
        related_standards=related_standards,
        version_alerts=version_alerts,
        certifications=applicable_certs,
        graph_data=graph_data,
        summary_explanation=summary
    )

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BIS-SpecAI Engine",
        "standards_indexed": len(retrieval_engine.standards),
        "version": "1.0.0"
    }

@app.get("/api/examples")
def get_examples():
    """Returns curated demo scenarios for evaluation."""
    return EXAMPLES_DATA

@app.get("/api/standards")
def get_all_standards():
    """Returns catalog of Indian Standards in prototype dataset."""
    return retrieval_engine.standards

@app.get("/api/standards/{std_id}")
def get_standard_detail(std_id: str):
    std = retrieval_engine.get_standard_by_id(std_id)
    if not std:
        # Try matching by number or normalized id
        for s in retrieval_engine.standards:
            if s["is_number"].lower() == std_id.lower() or s["id"].lower() == std_id.lower():
                std = s
                break
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
        
    meta = graph_service._convert_to_metadata(std, "Catalog Standard")
    rel = graph_service.get_related_standards(meta)
    graph = graph_service.build_react_flow_graph(meta, rel)
    return {
        "standard": meta,
        "related": rel,
        "graph": graph
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_requirement(req_input: RequirementAnalysisRequest):
    """
    Main endpoint:
    Natural language procurement query -> Extraction -> Hybrid Retrieval -> Scoring -> Explainability -> Graph.
    """
    if not req_input.query or len(req_input.query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Query text is too short.")
    return run_pipeline(req_input.query, top_k=req_input.top_k)

@app.post("/api/upload", response_model=AnalysisResponse)
async def upload_tender_pdf(file: UploadFile = File(...), top_k: int = Form(5)):
    """
    Tender PDF upload endpoint:
    Extracts text using PyMuPDF -> Audits versions -> Runs recommendation pipeline.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        extracted_text = pdf_service.extract_text_from_pdf_bytes(content)
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract readable text from PDF.")
        return run_pipeline(extracted_text, top_k=top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
