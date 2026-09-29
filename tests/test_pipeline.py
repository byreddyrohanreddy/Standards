import io
import os
import sys
import pytest
from datetime import date

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
import fitz  # PyMuPDF

from backend.main import app, run_pipeline


client = TestClient(app)

# ═══════════════════════════════════════════════════════════════════════════════
# ORIGINAL 14 TESTS — PRESERVED UNCHANGED
# ═══════════════════════════════════════════════════════════════════════════════

def test_basic_query_returns_expected_standard():
    query = "Procurement of three phase squirrel cage induction motor for industrial water pumping"
    res = run_pipeline(query)
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number or "325" in res.primary_standard.is_number
    assert res.primary_standard.ai_relevance_score is not None
    assert res.primary_standard.ai_relevance_score >= 60.0
    assert res.primary_standard.scoring_breakdown is not None
    assert res.primary_standard.scoring_breakdown.semantic_score > 0.4

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

def test_unknown_product_graceful_handling():
    query = "Procurement of quantum levitation anti-gravity warp drive module"
    res = run_pipeline(query)
    assert res is not None
    assert res.latency_breakdown is not None
    assert res.latency_breakdown.total_ms > 0
    if res.primary_standard:
        assert res.primary_standard.ai_relevance_score < 70.0

def test_outdated_standard_superseded_detection():
    query = "Technical specifications complying with IS 325:1996 for 15 kW motor procurement"
    res = run_pipeline(query)
    assert len(res.version_alerts) >= 1
    alert = res.version_alerts[0]
    assert "325" in alert.referenced_standard
    assert alert.current_replacement is not None
    assert "12615" in alert.current_replacement
    assert alert.severity == "warning"

def test_current_standard_confirmation():
    query = "Supply of energy efficient induction motors compliant with IS 12615:2018"
    res = run_pipeline(query)
    assert res.primary_standard is not None
    assert res.primary_standard.is_number == "IS 12615:2018"
    assert res.primary_standard.status == "current"
    superseded_alerts = [a for a in res.version_alerts if "12615" in a.referenced_standard]
    assert len(superseded_alerts) == 0

def test_relationship_graph_categories():
    query = "3-phase industrial induction motor 415V"
    res = run_pipeline(query)
    assert res.related_standards is not None
    assert len(res.related_standards.normative_references) > 0
    assert len(res.related_standards.testing_standards) > 0
    assert len(res.related_standards.safety_standards) > 0
    assert len(res.graph_data.nodes) > 1
    assert len(res.graph_data.edges) > 0
    primary_node = [n for n in res.graph_data.nodes if n.data.get("is_primary")]
    assert len(primary_node) == 1

def test_pdf_upload_endpoint():
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

def test_empty_input_validation():
    response = client.post("/api/analyze", json={"query": "  "})
    assert response.status_code == 400
    assert "short" in response.json()["detail"].lower()

def test_invalid_pdf_handling():
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
    files_corrupt = {"file": ("corrupt.pdf", b"NOT_A_VALID_PDF_HEADER", "application/pdf")}
    response2 = client.post("/api/upload", files=files_corrupt)
    assert response2.status_code == 400

def test_all_api_endpoints_valid():
    r_health = client.get("/api/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"
    r_stds = client.get("/api/standards")
    assert r_stds.status_code == 200
    assert len(r_stds.json()) == 113
    r_detail = client.get("/api/standards/is_12615_2018")
    assert r_detail.status_code == 200
    assert r_detail.json()["standard"]["is_number"] == "IS 12615:2018"
    r_rel = client.get("/api/standards/is_12615_2018/relationships")
    assert r_rel.status_code == 200
    assert "relationships" in r_rel.json()
    assert "graph" in r_rel.json()
    r_ex = client.get("/api/examples")
    assert r_ex.status_code == 200
    assert len(r_ex.json()) >= 5
    r_analyze = client.post("/api/analyze", json={"query": "Distribution transformer 250 kVA 11kV/433V oil immersed"})
    assert r_analyze.status_code == 200
    assert r_analyze.json()["primary_standard"] is not None
    assert "1180" in r_analyze.json()["primary_standard"]["is_number"]

def test_semantic_paraphrasing_retrieval():
    query = "Industrial prime mover with squirrel-cage rotor driven by alternating current for municipal pump house continuous duty with low energy losses"
    res = run_pipeline(query)
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number
    assert res.primary_standard.scoring_breakdown.semantic_score > 0.40
    assert res.semantic_vs_keyword_note is not None or res.primary_standard.semantic_insight is not None

def test_baseline_retrieval_modes():
    query = "15 kW three phase induction motor 415V"
    res_bm25 = run_pipeline(query, mode="bm25_only")
    res_sem = run_pipeline(query, mode="semantic_only")
    res_hyb = run_pipeline(query, mode="hybrid")
    assert len(res_bm25.candidate_standards) > 0
    assert len(res_sem.candidate_standards) > 0
    assert len(res_hyb.candidate_standards) > 0
    assert "12615" in res_hyb.primary_standard.is_number

def test_multi_requirement_segmentation():
    query = "Procure three-phase induction motors, low-voltage control panels with 415V busbars, and industrial safety helmets for factory workers."
    res = run_pipeline(query)
    assert res.is_multi_requirement is True
    assert len(res.requirement_groups) >= 2
    group_standards = [g.primary_standard.is_number for g in res.requirement_groups if g.primary_standard is not None]
    assert len(group_standards) >= 2
    assert res.tender_clause is not None
    assert len(res.tender_clause) > 50

def test_tender_clause_generation():
    query = "15 kW three phase squirrel cage induction motor 415 V 50 Hz"
    res = run_pipeline(query)
    assert res.tender_clause is not None
    assert "STANDARDS & TECHNICAL COMPLIANCE CLAUSE" in res.tender_clause
    assert "12615" in res.tender_clause
    assert "MANDATORY TESTING" in res.tender_clause
    assert "SAFETY" in res.tender_clause


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1 — QCO ENGINE TESTS (10 new tests)
# ═══════════════════════════════════════════════════════════════════════════════

from backend.services.qco_engine import QCOEngine

@pytest.fixture(scope="module")
def qco_engine():
    return QCOEngine(qco_path="data/qco_database.json")


def test_qco_mandatory_motor_returned(qco_engine):
    """IS 12615 (motors) must have a mandatory QCO in the database."""
    results = qco_engine.lookup("IS 12615:2018")
    assert len(results) > 0, "Expected at least one QCO for IS 12615:2018"
    statuses = [r.status.enforcement_status for r in results]
    assert "mandatory" in statuses, f"Expected 'mandatory' QCO for motors, got: {statuses}"


def test_qco_date_boundary_one_day_before(qco_engine):
    """One day before enforcement date -> status must be 'upcoming'."""
    # Motors QCO enforcement_date is 2022-01-01; check 2021-12-31
    reference = date(2021, 12, 31)
    results = qco_engine.lookup("IS 12615:2018", reference_date=reference)
    assert results, "No QCO found for motors"
    assert results[0].status.enforcement_status == "upcoming", (
        f"Expected 'upcoming' one day before enforcement, got: {results[0].status.enforcement_status}"
    )


def test_qco_date_boundary_on_enforcement_day(qco_engine):
    """On the enforcement date itself -> status must be 'mandatory'."""
    reference = date(2022, 1, 1)
    results = qco_engine.lookup("IS 12615:2018", reference_date=reference)
    assert results, "No QCO found for motors"
    assert results[0].status.enforcement_status == "mandatory", (
        f"Expected 'mandatory' on enforcement day, got: {results[0].status.enforcement_status}"
    )


def test_qco_date_boundary_one_day_after(qco_engine):
    """One day after enforcement date -> status must be 'mandatory'."""
    reference = date(2022, 1, 2)
    results = qco_engine.lookup("IS 12615:2018", reference_date=reference)
    assert results, "No QCO found for motors"
    assert results[0].status.enforcement_status == "mandatory", (
        f"Expected 'mandatory' one day after enforcement, got: {results[0].status.enforcement_status}"
    )


def test_qco_cement_mandatory(qco_engine):
    """IS 269:2015 (OPC cement) must have a mandatory QCO."""
    results = qco_engine.lookup("IS 269:2015")
    assert len(results) > 0, "Expected QCO for IS 269:2015"
    assert any(r.status.enforcement_status == "mandatory" for r in results)


def test_qco_tmt_steel_mandatory(qco_engine):
    """IS 1786:2008 (TMT steel) must have a mandatory QCO."""
    results = qco_engine.lookup("IS 1786:2008")
    assert len(results) > 0, "Expected QCO for IS 1786:2008"
    assert any(r.status.enforcement_status == "mandatory" for r in results)


def test_qco_no_result_for_nonexistent_standard(qco_engine):
    """A fictitious IS number must return empty QCO list — no hallucination."""
    results = qco_engine.lookup("IS 99999:2099")
    assert results == [], f"Expected empty QCO list for non-existent standard, got: {results}"


def test_qco_wired_into_pipeline_response():
    """Full pipeline for ISI-mandatory product must surface qco_results."""
    query = "15 kW three phase induction motor 415V"
    res = run_pipeline(query)
    assert res.primary_standard is not None
    assert "12615" in res.primary_standard.is_number
    assert len(res.qco_results) > 0, "Expected qco_results in pipeline response for motor query"
    mandatory = [q for q in res.qco_results if q.status.enforcement_status == "mandatory"]
    assert len(mandatory) > 0


def test_qco_scheme_types_isi_vs_crs(qco_engine):
    """ISI Mark and CRS schemes are correctly distinguished."""
    motor_qco = qco_engine.lookup("IS 12615:2018")
    assert motor_qco, "No QCO found for motors"
    assert "ISI" in motor_qco[0].certification_scheme or "Scheme-I" in motor_qco[0].certification_scheme

    led_qco = qco_engine.lookup("IS 16102 (Part 1):2012")
    assert led_qco, "No QCO found for LED lamps"
    assert "CRS" in led_qco[0].certification_scheme or "Registration" in led_qco[0].certification_scheme


def test_qco_all_results_are_verified(qco_engine):
    """Every QCO record in the database must be marked as verified (gazette-traceable)."""
    for record in qco_engine.qco_records:
        assert record.get("verified") is True, (
            f"QCO '{record.get('qco_id')}' is not marked as verified. "
            f"Only gazette-traceable QCOs should be in the database."
        )


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4 — INDEPENDENT EVALUATION SLICE (smoke test)
# ═══════════════════════════════════════════════════════════════════════════════

import json

def test_independent_eval_recall_smoke():
    """
    Smoke test: first 5 queries from the independent eval set (procurement-language,
    not derived from corpus scope text). Recall@5 must be >= 80%.
    Confirms retrieval is not overfit to corpus vocabulary.
    """
    with open("data/eval_queries_independent.json", "r", encoding="utf-8") as f:
        queries = json.load(f)

    hits = 0
    sample = queries[:5]
    for item in sample:
        res = run_pipeline(item["query"], top_k=5)
        candidate_numbers = [c.is_number for c in res.candidate_standards]
        if any(exp in candidate_numbers for exp in item["expected_standards"]):
            hits += 1

    recall_at_5 = hits / len(sample)
    assert recall_at_5 >= 0.8, (
        f"Independent eval Recall@5 smoke test: {hits}/{len(sample)} = {recall_at_5:.0%}. "
        f"Expected >= 80%. May indicate overfit to corpus scope vocabulary."
    )


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 5 — CLOSED-SET GROUNDING / ADVERSARIAL HALLUCINATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_adversarial_plausible_nonexistent_standard():
    """
    Query cites a plausible-looking but nonexistent IS number (IS 9999:2023).
    System must NOT return this as a recommendation — ever.
    """
    query = "Supply of equipment conforming to IS 9999:2023 for industrial applications"
    res = run_pipeline(query)
    all_numbers = [c.is_number for c in res.candidate_standards]
    assert "IS 9999:2023" not in all_numbers, "HALLUCINATION: IS 9999:2023 appeared in recommendations!"
    assert "IS 9999" not in str(all_numbers), "HALLUCINATION: IS 9999 appeared in recommendations!"


def test_adversarial_wrong_year_on_real_standard():
    """
    Injects a real IS number with a clearly fabricated year (IS 12615:1885).
    System must NOT return this fabricated citation; must return the real IS 12615:2018.
    """
    query = "Induction motor procurement per IS 12615:1885 efficiency requirements"
    res = run_pipeline(query)
    all_numbers = [c.is_number for c in res.candidate_standards]
    assert "IS 12615:1885" not in all_numbers, "HALLUCINATION: IS 12615:1885 (fake year) in recommendations!"
    real_rec = any("12615" in n for n in all_numbers)
    assert real_rec, "Expected IS 12615:2018 to be recommended for motor query with bad year"


def test_adversarial_out_of_domain_low_confidence():
    """
    Completely out-of-domain query (aerospace composite). Must be rejected or
    returned with AI relevance score < 70%.
    """
    query = "Carbon fiber reinforced polymer composite panel for fighter jet airframe structural member"
    res = run_pipeline(query)
    if res.primary_standard is not None:
        assert res.primary_standard.ai_relevance_score < 70.0, (
            f"System made high-confidence recommendation ({res.primary_standard.ai_relevance_score}%) "
            f"for an out-of-domain aerospace query."
        )


def test_adversarial_corpus_boundary_all_results_in_corpus():
    """
    All candidates returned must have is_in_corpus=True.
    Verifies the pipeline never surfaces a hallucinated out-of-corpus IS number
    as a primary recommendation.
    """
    query = "Industrial centrifugal fan 5000 CFM for factory ventilation, axial blade, TEFC motor driven"
    res = run_pipeline(query)
    for cand in res.candidate_standards:
        assert cand.is_in_corpus, (
            f"Candidate {cand.is_number} has is_in_corpus=False — "
            f"pipeline is promoting an out-of-corpus standard."
        )
