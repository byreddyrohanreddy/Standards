"""
Tender Audit Service — Phase 3 (backend/services/tender_audit_service.py)

Runs the full pipeline (NLP extractor + version auditor + QCO engine + retrieval)
across every section of a tender/NIT document and produces a structured per-document
audit report:
  - Standards cited correctly
  - Standards missing (recommended but not cited)
  - Outdated/superseded standards referenced
  - Mandatory QCOs not addressed in tender spec

Report is generated via the existing reportlab PDF generation pattern.
"""

import re
import json
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

from backend.services.nlp_extractor import extract_requirements, segment_multi_requirements, extract_standards_mentions
from backend.services.version_auditor import VersionAuditor
from backend.services.qco_engine import QCOEngine
from backend.models.schemas import VersionAlert, QCOResult


# Heuristic: split tender document into logical sections
SECTION_SPLIT_PATTERNS = [
    r"(?m)^(CLAUSE|SECTION|ITEM|SCHEDULE|PART|APPENDIX|ANNEXURE|SCOPE OF WORK|TECHNICAL SPECIFICATION)\s*[\d\.\:]+",
    r"(?m)^\d+[\.\)]\s+[A-Z][A-Z\s]{5,}$",
    r"\n{2,}",
]


def split_into_sections(text: str, max_section_len: int = 800) -> List[Dict[str, str]]:
    """
    Heuristically splits tender document text into logical sections.
    Falls back to paragraph splitting if no structural headers are found.
    """
    sections = []

    # Try structural header split first
    for pattern in SECTION_SPLIT_PATTERNS[:2]:
        splits = re.split(pattern, text, flags=re.IGNORECASE)
        if len(splits) > 2:
            for i, chunk in enumerate(splits):
                chunk = chunk.strip()
                if len(chunk) > 30:
                    sections.append({"section_id": f"sec_{i+1}", "text": chunk[:max_section_len]})
            if sections:
                return sections

    # Paragraph split fallback
    paragraphs = re.split(r"\n{2,}", text.strip())
    for i, para in enumerate(paragraphs):
        para = para.strip()
        if len(para) > 30:
            sections.append({"section_id": f"para_{i+1}", "text": para[:max_section_len]})

    return sections or [{"section_id": "full", "text": text[:max_section_len]}]


class TenderAuditService:
    """
    Audits a tender/NIT document against the BIS standards catalog.
    """

    def __init__(
        self,
        standards_path: str = "data/standards.json",
        qco_path: str = "data/qco_database.json",
    ):
        self.version_auditor = VersionAuditor(standards_path=standards_path)
        self.qco_engine = QCOEngine(qco_path=qco_path)

        with open(standards_path, "r", encoding="utf-8") as f:
            self.standards = json.load(f)
        self.standards_by_number = {s["is_number"]: s for s in self.standards}

    def audit_document(
        self,
        document_text: str,
        document_name: str = "Tender Document",
        retrieval_engine=None,
    ) -> Dict[str, Any]:
        """
        Full audit of a tender document text.

        Args:
            document_text: Raw extracted text from the tender/NIT PDF
            document_name: Display name for the document
            retrieval_engine: Optional HybridRetrievalEngine instance for recommendations

        Returns:
            Structured audit dict with findings, statistics, and recommendations
        """
        t_start = time.time()
        audit_time = datetime.now().isoformat()

        # 1. Extract all cited IS standards from the full document
        cited_standards = extract_standards_mentions(document_text)

        # 2. Run version/supersession audit on ALL citations
        version_alerts: List[VersionAlert] = self.version_auditor.audit_text_for_versions(
            document_text, cited_standards
        )

        # 3. Split into sections and analyse each
        sections = split_into_sections(document_text)
        section_findings: List[Dict[str, Any]] = []
        all_recommended_standards = set()
        sections_with_issues = 0

        for sec in sections:
            sec_text = sec["text"]
            sec_cited = extract_standards_mentions(sec_text)
            req = extract_requirements(sec_text)

            # Get recommendations for this section (if retrieval engine provided)
            sec_recommendations = []
            if retrieval_engine and req.product != "Procurement Item":
                try:
                    candidates = retrieval_engine.retrieve_candidates(sec_text, req, top_k=3)
                    sec_recommendations = [c.is_number for c in candidates if c.ai_relevance_score and c.ai_relevance_score >= 55.0]
                    all_recommended_standards.update(sec_recommendations)
                except Exception:
                    pass

            # Determine missing standards (recommended but not cited)
            missing = [r for r in sec_recommendations if r not in sec_cited and r not in cited_standards]

            # Section-level version alerts
            sec_alerts = self.version_auditor.audit_text_for_versions(sec_text, sec_cited)

            sec_has_issues = bool(missing or sec_alerts)
            if sec_has_issues:
                sections_with_issues += 1

            if sec_cited or sec_recommendations or sec_alerts:
                section_findings.append({
                    "section_id": sec["section_id"],
                    "text_preview": sec_text[:200] + "..." if len(sec_text) > 200 else sec_text,
                    "cited_standards": sec_cited,
                    "recommended_standards": sec_recommendations,
                    "missing_standards": missing,
                    "version_alerts": [
                        {
                            "referenced": a.referenced_standard,
                            "status": a.status,
                            "replacement": a.current_replacement,
                            "severity": a.severity
                        }
                        for a in sec_alerts
                    ],
                    "has_issues": sec_has_issues,
                })

        # 4. QCO check: for every recommended standard, check mandatory certification
        qco_gaps: List[Dict[str, Any]] = []
        qco_addressed: List[str] = []

        for std_num in all_recommended_standards:
            qco_results = self.qco_engine.lookup(std_num)
            for qr in qco_results:
                if qr.status.enforcement_status == "mandatory":
                    # Check if tender mentions certification requirement
                    cert_mentioned = any(
                        kw in document_text.lower()
                        for kw in ["isi mark", "bis certification", "crs", "isimarka", "bsi certified",
                                   "quality certification", "bis license", "compulsory registration"]
                    )
                    if cert_mentioned:
                        qco_addressed.append(std_num)
                    else:
                        qco_gaps.append({
                            "standard": std_num,
                            "qco_title": qr.qco_title,
                            "certification_scheme": qr.certification_scheme,
                            "issuing_ministry": qr.issuing_ministry,
                            "enforcement_date": qr.status.enforcement_date,
                            "gap": f"Mandatory {qr.certification_scheme} not explicitly required in tender for {std_num}"
                        })

        elapsed_ms = round((time.time() - t_start) * 1000, 1)

        # 5. Summary statistics
        total_cited = len(set(cited_standards))
        total_superseded = len([a for a in version_alerts if a.status == "Superseded Standard"])
        total_outdated = len([a for a in version_alerts if a.status == "Outdated Edition Reference"])
        total_missing = len(set(
            m for sec in section_findings for m in sec.get("missing_standards", [])
        ))
        has_any_issue = bool(version_alerts or total_missing > 0 or qco_gaps)

        return {
            "document_name": document_name,
            "audit_timestamp": audit_time,
            "audit_latency_ms": elapsed_ms,
            "summary": {
                "total_standards_cited": total_cited,
                "total_superseded_citations": total_superseded,
                "total_outdated_citations": total_outdated,
                "total_missing_recommendations": total_missing,
                "total_qco_gaps": len(qco_gaps),
                "sections_analysed": len(sections),
                "sections_with_issues": sections_with_issues,
                "has_compliance_issues": has_any_issue,
            },
            "cited_standards": sorted(set(cited_standards)),
            "version_alerts": [
                {
                    "referenced": a.referenced_standard,
                    "status": a.status,
                    "replacement": a.current_replacement,
                    "recommendation": a.recommendation,
                    "severity": a.severity,
                }
                for a in version_alerts
            ],
            "qco_gaps": qco_gaps,
            "section_findings": section_findings,
        }

    def audit_multiple_documents(
        self,
        documents: List[Dict[str, str]],
        retrieval_engine=None,
    ) -> Dict[str, Any]:
        """
        Audits multiple tender documents and aggregates findings.

        Args:
            documents: List of {"name": str, "text": str} dicts
            retrieval_engine: Optional HybridRetrievalEngine

        Returns:
            Aggregate report with per-document findings and cross-document stats
        """
        doc_reports = []
        for doc in documents:
            report = self.audit_document(
                document_text=doc["text"],
                document_name=doc["name"],
                retrieval_engine=retrieval_engine,
            )
            doc_reports.append(report)

        # Aggregate statistics
        total_docs = len(doc_reports)
        docs_with_issues = sum(1 for r in doc_reports if r["summary"]["has_compliance_issues"])
        total_superseded = sum(r["summary"]["total_superseded_citations"] for r in doc_reports)
        total_outdated = sum(r["summary"]["total_outdated_citations"] for r in doc_reports)
        total_missing = sum(r["summary"]["total_missing_recommendations"] for r in doc_reports)
        total_qco_gaps = sum(r["summary"]["total_qco_gaps"] for r in doc_reports)
        total_cited = sum(r["summary"]["total_standards_cited"] for r in doc_reports)

        return {
            "aggregate_summary": {
                "total_documents_audited": total_docs,
                "documents_with_compliance_issues": docs_with_issues,
                "pct_documents_with_issues": round(docs_with_issues / max(total_docs, 1) * 100, 1),
                "total_standards_cited_across_all": total_cited,
                "total_superseded_citations": total_superseded,
                "total_outdated_citations": total_outdated,
                "total_missing_normative_refs": total_missing,
                "total_qco_certification_gaps": total_qco_gaps,
                "avg_citation_issues_per_tender": round(
                    (total_superseded + total_outdated) / max(total_docs, 1), 2
                ),
            },
            "document_reports": doc_reports,
        }
