import io
import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
import fitz  # PyMuPDF

from backend.main import app, run_pipeline


client = TestClient(app)

# 1. Basic query returns expected standard
def test_basic_query_returns_expected_standard():
    query = "Procurement of three phase squirrel cage induction motor for industrial water pumping"
    res = run_pipeline(query)
    
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number or "325" in res.primary_standard.is_number
    assert res.primary_standard.ai_relevance_score is not None
    assert res.primary_standard.ai_relevance_score >= 60.0
    assert res.primary_standard.scoring_breakdown is not None
    assert res.primary_standard.scoring_breakdown.semantic_score > 0.4

# 2. Query with technical parameters extracts parameters and matches
def test_query_with_technical_parameters():
    query = "Supply of 11 kW, 415V, 50 Hz, 3-phase squirrel cage induction motor with IP55 enclosure"
    res = run_pipeline(query)
    
    req = res.extracted_requirements
    assert req.power is not None and "11" in req.power
    assert req.voltage is not None and "415" in req.voltage
    assert req.phase is not None and ("three-phase" in req.phase.lower() or "3-phase" in req.phase.lower())
    assert req.ip_rating is not None and "ip55" in req.ip_rating.lower()

    
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number
    assert res.primary_standard.scoring_breakdown.requirement_coverage > 0.0

# 3. Query for an unknown/unsupported product returns graceful response
def test_unknown_product_graceful_handling():
    query = "Procurement of quantum levitation anti-gravity warp drive module"
    res = run_pipeline(query)
    
    # Should not crash, returns valid response structure
    assert res is not None
    # Latency should still be recorded
    assert res.latency_breakdown is not None
    assert res.latency_breakdown.total_ms > 0
    # Top score should be low or transparently documented
    if res.primary_standard:
        assert res.primary_standard.ai_relevance_score < 70.0

# 4. Outdated standard detection and replacement recommendation
def test_outdated_standard_superseded_detection():
    query = "Technical specifications complying with IS 325:1996 for 15 kW motor procurement"
    res = run_pipeline(query)
    
    assert len(res.version_alerts) >= 1
    alert = res.version_alerts[0]
    assert "325" in alert.referenced_standard
    assert alert.current_replacement is not None
    assert "12615" in alert.current_replacement
    assert alert.severity == "warning"

# 5. Current standard cited confirms active status
def test_current_standard_confirmation():
    query = "Supply of energy efficient induction motors compliant with IS 12615:2018"
    res = run_pipeline(query)
    
    assert res.primary_standard is not None
    assert res.primary_standard.is_number == "IS 12615:2018"
    assert res.primary_standard.status == "current"
    # No superseded alert should be triggered for IS 12615:2018
    superseded_alerts = [a for a in res.version_alerts if "12615" in a.referenced_standard]
    assert len(superseded_alerts) == 0

# 6. Relationship graph returns normative, testing, and safety standards
def test_relationship_graph_categories():
    query = "3-phase industrial induction motor 415V"
    res = run_pipeline(query)
    
    assert res.related_standards is not None
    assert len(res.related_standards.normative_references) > 0
    assert len(res.related_standards.testing_standards) > 0
    assert len(res.related_standards.safety_standards) > 0
    
    # Check graph nodes and edges
    assert len(res.graph_data.nodes) > 1
    assert len(res.graph_data.edges) > 0
    primary_node = [n for n in res.graph_data.nodes if n.data.get("is_primary")]
    assert len(primary_node) == 1

# 7. PDF upload endpoint accepts valid PDF and returns recommendations
def test_pdf_upload_endpoint():
    # Generate a lightweight PDF in memory using fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 72), "Tender Specification Document\nProcurement of 11 kW 415V Three Phase Induction Motor\nEfficiency Class: IE3\nEnclosure: IP55\nIndian Standards Compliance: IS 12615")
    pdf_bytes = doc.write()
    doc.close()
    
    files = {"file": ("tender_sample.pdf", pdf_bytes, "application/pdf")}
    response = client.post("/api/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["primary_standard"] is not None
    assert "12615" in data["primary_standard"]["is_number"]
    assert "latency_breakdown" in data
    assert data["latency_breakdown"]["total_ms"] > 0

# 8. Empty input validation returns appropriate 400 error
def test_empty_input_validation():
    response = client.post("/api/analyze", json={"query": "  "})
    assert response.status_code == 400
    assert "short" in response.json()["detail"].lower()

# 9. Invalid / empty PDF handling returns appropriate 400 error
def test_invalid_pdf_handling():
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
    
    files_corrupt = {"file": ("corrupt.pdf", b"NOT_A_VALID_PDF_HEADER", "application/pdf")}
    response2 = client.post("/api/upload", files=files_corrupt)
    assert response2.status_code == 400

# 10. All API endpoints respond with 200 on valid inputs
def test_all_api_endpoints_valid():
    # Health endpoint
    r_health = client.get("/api/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"
    
    # Standards catalog endpoint
    r_stds = client.get("/api/standards")
    assert r_stds.status_code == 200
    assert len(r_stds.json()) == 62
    
    # Standard detail endpoint
    r_detail = client.get("/api/standards/is_12615_2018")
    assert r_detail.status_code == 200
    assert r_detail.json()["standard"]["is_number"] == "IS 12615:2018"
    
    # Explicit relationships endpoint
    r_rel = client.get("/api/standards/is_12615_2018/relationships")
    assert r_rel.status_code == 200
    assert "relationships" in r_rel.json()
    assert "graph" in r_rel.json()
    
    # Examples endpoint
    r_ex = client.get("/api/examples")
    assert r_ex.status_code == 200
    assert len(r_ex.json()) >= 5
    
    # Analyze endpoint
    r_analyze = client.post("/api/analyze", json={"query": "Distribution transformer 250 kVA 11kV/433V oil immersed"})
    assert r_analyze.status_code == 200
    assert r_analyze.json()["primary_standard"] is not None
    assert "1180" in r_analyze.json()["primary_standard"]["is_number"]

# 11. Paraphrased query demonstrates semantic vector retrieval beyond keyword match
def test_semantic_paraphrasing_retrieval():
    query = "Industrial prime mover with squirrel-cage rotor driven by alternating current for municipal pump house continuous duty with low energy losses"
    res = run_pipeline(query)
    
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number
    assert res.primary_standard.scoring_breakdown.semantic_score > 0.40
    # Demonstrates semantic insight bridging vocabulary gap
    assert res.semantic_vs_keyword_note is not None or res.primary_standard.semantic_insight is not None

# 12. Multi-mode baseline execution (BM25 only, Semantic only, Hybrid)
def test_baseline_retrieval_modes():
    query = "15 kW three phase induction motor 415V"
    res_bm25 = run_pipeline(query, mode="bm25_only")
    res_sem = run_pipeline(query, mode="semantic_only")
    res_hyb = run_pipeline(query, mode="hybrid")
    
    assert len(res_bm25.candidate_standards) > 0
    assert len(res_sem.candidate_standards) > 0
    assert len(res_hyb.candidate_standards) > 0
    assert "12615" in res_hyb.primary_standard.is_number

