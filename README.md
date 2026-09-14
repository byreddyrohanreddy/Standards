# BIS-SpecAI: AI-Powered Recommendation Engine for Indian Standards (BIS)

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH_2026-Problem_Statement_26108-orange.svg)](https://www.sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org)
[![React Flow](https://img.shields.io/badge/React_Flow-xyflow-purple.svg)](https://reactflow.dev)
[![Embeddings](https://img.shields.io/badge/Embeddings-all--MiniLM--L6--v2-blue.svg)](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
[![Recall@5](https://img.shields.io/badge/Recall@5-100%25-brightgreen.svg)]()
[![MRR](https://img.shields.io/badge/MRR-0.9409-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-12%2F12_Passing-brightgreen.svg)]()

> **Smart India Hackathon 2026 — Problem Statement 26108**  
> *"AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications"*  
> **Prototype Scope:** Curated demonstration catalog of 62 Indian Standards (IS), 249 relationship edges, and 6 evaluation scenarios. Results are designated as *AI Relevance Scores* (algorithmic ranking) for prototype evaluation.

---

## 🏛️ 1. Problem & Executive Summary

Government procurement authorities (CPWD, Indian Railways, Defence, State PWDs, PSUs) publish thousands of tender notices annually. Inadvertently specifying outdated, superseded, or non-harmonized Indian Standards (IS) leads to tender challenges, vendor disqualification disputes, audit objections, and safety risks.

**BIS-SpecAI** is a technically credible, production-modeled MVP prototype that accepts natural-language technical requirements or tender NIT PDFs and executes an intelligent, explainable recommendation pipeline:

1. **Generic 16-Parameter NLP Extraction**: Automatically extracts product category, product type, application context, domain, voltage, current, power, frequency, phase, dimensions, materials, operating temperature, pressure, IP rating, safety needs, and testing requirements.
2. **Dual-Path Hybrid Retrieval**:
   - **Dense Semantic Embeddings**: Generates 384-dimensional dense vectors using `sentence-transformers/all-MiniLM-L6-v2` with offline disk caching (`data/standards_embeddings.npy`) for sub-21ms retrieval.
   - **Lexical Keyword Matching**: Uses normalized BM25 Okapi (`rank-bm25`) to reward exact terminology matches (e.g., "IE3", "Fe 500D", "PE 100").
3. **Multi-Factor Algorithmic Scoring**:
   $$\text{Final Score} = 0.35 \cdot \text{Semantic} + 0.25 \cdot \text{Lexical} + 0.20 \cdot \text{Coverage} + 0.10 \cdot \text{Domain} + 0.10 \cdot \text{Version}$$
4. **Confidence Thresholding & Rejection**: Gracefully rejects non-catalog or out-of-domain queries (e.g., "Quantum warp propulsion system") rather than hallucinating false recommendations with high scores.
5. **Tender Version & Obsolescence Auditor**: Detects outdated or superseded standard references in queries (e.g., `IS 325:1996` superseded by `IS 12615:2018`, `IS 8112:1989` superseded by `IS 269:2015`) and alerts procurement officers.
6. **Standards Relationship Graph**: Traverses normative references, testing standards, safety standards, installation codes, and related products rendered in an interactive React Flow DAG. Standards external to the prototype catalog are clearly designated as *"Referenced standard not included in prototype corpus"*.

---

## 📊 2. Benchmark Evaluation & Baseline Comparison

### Retrieval Architecture Ablation Analysis (22 Ground-Truth Test Queries)

To demonstrate that our hybrid architecture provides measurable value beyond single-method retrieval, we conducted a rigorous baseline comparison across all 22 ground-truth test specifications:

| Retrieval Mode | Recall@1 | Recall@5 | MRR | Avg Latency | Key Performance Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **BM25 Lexical Only** | 86.36% | 100.00% | 0.9318 | 22.2 ms | Accurate on exact code/parameter hits; fails on paraphrasing ("prime mover" vs "motor") |
| **Dense Semantic Only** | 81.82% | 100.00% | 0.8803 | 20.4 ms | Understands functional intent; occasional confusion between adjacent rating grades |
| **Hybrid Pipeline (Ours)** | **90.91%** | **100.00%** | **0.9409** | **20.4 ms** | **Superior precision: Fuses dense semantic generalization with lexical exactness** |

### Why Hybrid Retrieval was Chosen
- **Vocabulary Disconnect**: Procurement tenders frequently describe equipment using functional terminology ("industrial rotary driver with squirrel-cage rotor for pump house") rather than the verbatim standard title ("Line Operated Three-Phase AC Motors"). BM25 alone yields low lexical overlap on such queries.
- **Precision on Ratings & Codes**: Pure dense vector search can blur distinct standard parts or numerical grades (e.g., distinguishing IS 1180 Part 1 from Part 2). BM25 provides the exact lexical anchor for numerical ratings.
- **Combined Synergy**: The hybrid approach achieves **90.91% Recall@1** and **0.9409 MRR**, outperforming both single-mode baselines without increasing inference latency.

### Prototype Benchmark Summary (Curated Dataset)

| Metric | Prototype Benchmark Score | SIH Target | Significance |
| :--- | :---: | :---: | :--- |
| **Recall@1** | **90.91%** (20/22) | > 85% | Primary recommendation matches ground truth top-1 |
| **Recall@5** | **100.00%** (22/22) | > 90% | Ground-truth standard present in top-5 candidate pool |
| **Mean Reciprocal Rank (MRR)** | **0.9409** | > 0.8500 | Evaluates ranking position quality across multi-parameter queries |
| **Outdated Version Detection** | **100.00%** (2/2) | 100% | Correctly identifies superseded standards (`IS 325`, `IS 8112`) and links replacements |
| **Normative Ref. Discovery** | **100.00%** (22/22) | > 95% | Traverses mandatory testing, safety, and installation cross-references |
| **Average Pipeline Latency** | **20.4 ms / query** | < 100 ms | Real-time CPU inference (*excludes cold-start model load; embeddings cached*) |

*Run evaluation suite:* `python evaluation/evaluate.py` (saves to `evaluation/eval_results.json` and updates `documents/Evaluation_Benchmark_Report.pdf`).

---

## 🧪 3. Automated Test Suite (12/12 Passing)

A comprehensive test suite in `tests/test_pipeline.py` verifies all critical pipeline functions:

| # | Test Scenario | Verified Behavior | Status |
| :-: | :--- | :--- | :-: |
| 1 | `test_basic_query_returns_expected_standard` | Motor query returns `IS 12615:2018` with >60% relevance and semantic score >0.4 | **PASSED** |
| 2 | `test_query_with_technical_parameters` | Extracts 11 kW, 415V, Three-Phase, IP55 and matches `IS 12615:2018` | **PASSED** |
| 3 | `test_unknown_product_graceful_handling` | Fictional item (quantum warp drive) rejected gracefully below recommendation threshold | **PASSED** |
| 4 | `test_outdated_standard_superseded_detection` | `IS 325:1996` flagged as superseded by `IS 12615:2018` with warning severity | **PASSED** |
| 5 | `test_current_standard_confirmation` | `IS 12615:2018` confirmed active; zero false superseded alerts | **PASSED** |
| 6 | `test_relationship_graph_categories` | DAG generates Normative, Testing, and Safety nodes with valid React Flow coordinates | **PASSED** |
| 7 | `test_pdf_upload_endpoint` | In-memory PDF upload via `/api/upload` returns parsed text and recommendations | **PASSED** |
| 8 | `test_empty_input_validation` | Empty/whitespace query returns HTTP 400 Bad Request with descriptive message | **PASSED** |
| 9 | `test_invalid_pdf_handling` | Zero-byte or corrupted file returns HTTP 400 Bad Request | **PASSED** |
| 10 | `test_all_api_endpoints_valid` | Validates `/api/health`, `/api/standards`, `/api/standards/{id}/relationships`, `/api/examples` | **PASSED** |
| 11 | `test_semantic_paraphrasing_retrieval` | Paraphrased description ("prime mover with squirrel-cage rotor") matches IS 12615 with semantic insight | **PASSED** |
| 12 | `test_baseline_retrieval_modes` | Validates multi-mode baseline retrieval execution (BM25 only, Semantic only, Hybrid) | **PASSED** |

*Run the test suite:*
```bash
pytest tests/test_pipeline.py -v
```

---

## 🛠️ Architecture & Pipeline

```
                     Procurement Specification / Tender NIT PDF
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │    Generic 16-Parameter NLP Extractor    │
                   │    (Power, Voltage, Phase, IP, Materials)│
                   └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │    Tender Version & Obsolescence Audit   │
                   │   (Detects superseded IS 325, IS 8112;   │
                   │    promotes active modern editions)      │
                   └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │        Hybrid Retrieval Engine           │
                   │  ├── Dense Embeddings: all-MiniLM-L6-v2  │
                   │  │   (384-dim cosine similarity, 35%)    │
                   │  ├── Lexical Match: BM25 Okapi (30%)     │
                   │  ├── Parameter Scope Coverage (20%)      │
                   │  └── Domain Alignment & Version (15%)    │
                   └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │       Explainable Primary Standard       │
                   │       (AI Relevance Score: e.g. 89.4%)   │
                   │       (Verified Evidence Checkpoints)    │
                   └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │    Standards Relationship Graph Engine   │
                   │  ├── Normative References (IS/IEC 60034) │
                   │  ├── Testing Standards (IS 15999)        │
                   │  ├── Safety Standards (IS 3043 Earthing) │
                   │  └── Installation Codes (IS 900)         │
                   └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │ Interactive React Flow Visualization     │
                   │ Technical Scoring Matrix & Export Bar    │
                   └──────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
SIH108/
├── backend/
│   ├── main.py                     # FastAPI endpoints (with latency profiling & error handling)
│   ├── requirements.txt            # Python dependencies (sentence-transformers, torch, rank-bm25)
│   ├── models/
│   │   └── schemas.py              # Pydantic data schemas (ScoringBreakdown, LatencyBreakdown)
│   └── services/
│       ├── nlp_extractor.py        # Generic 16-parameter entity parser
│       ├── retrieval_engine.py     # SentenceTransformer dense embeddings + BM25 hybrid engine
│       ├── graph_service.py        # Normative relationship DAG builder & React Flow mapper
│       ├── version_auditor.py      # Multi-format version & obsolescence auditor
│       └── pdf_service.py          # PyMuPDF tender document text extractor
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with metadata
│   │   │   ├── page.tsx            # Main application UI with collapsible technical audit card
│   │   │   └── globals.css         # Tailwind CSS & React Flow styling
│   │   ├── components/
│   │   │   ├── Header.tsx          # Government procurement header
│   │   │   ├── RequirementInput.tsx# Query input, quick presets & PDF upload
│   │   │   ├── RequirementUnderstandingCard.tsx # 16-parameter dynamic display
│   │   │   ├── AnalysisDetailsCard.tsx          # Collapsible technical audit & score matrix
│   │   │   ├── VersionAlertBanner.tsx           # Superseded standard warnings
│   │   │   ├── PrimaryStandardCard.tsx          # Primary standard card & explainability
│   │   │   ├── RelatedStandardsSection.tsx      # Categorized normative/test/safety tabs
│   │   │   ├── CandidateStandardsList.tsx       # Alternative candidates ranking
│   │   │   ├── StandardsGraphModal.tsx          # Interactive React Flow graph modal
│   │   │   └── StandardDetailModal.tsx          # Standard detail inspection modal
│   │   ├── lib/
│   │   │   └── api.ts              # API client library
│   │   └── types/
│   │       └── index.ts            # TypeScript interfaces
│   └── package.json
│
├── data/
│   ├── standards.json              # 62 curated Indian Standards records
│   ├── standards_embeddings.npy    # Pre-computed dense vector cache (384-dim)
│   ├── relationships.json          # 249 directed relationship edges
│   ├── certifications.json         # BIS Scheme-I (ISI Mark) & CRS schemes
│   ├── examples.json               # 6 preset evaluation scenarios
│   └── eval_queries.json           # 22 ground-truth benchmark queries
│
├── tests/
│   └── test_pipeline.py            # 10 automated test cases (100% passing)
│
├── evaluation/
│   ├── evaluate.py                 # Evaluation benchmark script (Recall, MRR, Latency)
│   └── eval_results.json           # Dynamic benchmark results
│
├── documents/
│   ├── Evaluation_Benchmark_Report.pdf # Formal SIH evaluation benchmark report
│   ├── System_Architecture.pdf         # Complete system architecture
│   ├── TechStack_Architecture.pdf      # Detailed tech stack specification
│   └── Workflow_Architecture.pdf       # E-procurement workflow diagram
│
├── sample_tender_document.pdf      # Sample tender PDF for upload testing
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js v18+ and npm

### 1. Backend Setup

```bash
# Navigate to project root
cd SIH108

# Create & activate Python virtual environment
py -3.11 -m venv .venv
.venv\Scripts\activate      # On Windows
# source .venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r backend/requirements.txt

# Start FastAPI backend server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API documentation is available at: `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
# Open a second terminal and navigate to frontend
cd SIH108/frontend

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Run Automated Tests

```bash
# In the project root with .venv activated
pytest tests/test_pipeline.py -v
```

### 4. Run Evaluation Benchmark

```bash
# In the project root with .venv activated
python evaluation/evaluate.py
```

---

## 🎯 Guided Demo Scenarios

Test these curated scenarios via the UI dropdown or query input:

1. **Three-Phase Induction Motor (Electrical)**:
   - *Query:* `"15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements"`
   - *Result:* Retrieves **IS 12615:2018 (IE3 class)** with 89.4% AI Relevance Score. Maps testing to **IS 15999**, safety enclosure to **IS/IEC 60034-5**, and earthing to **IS 3043:2018**.
2. **Structural Pozzolana Cement (Civil)**:
   - *Query:* `"Fly ash based Portland Pozzolana Cement (PPC) for reinforced concrete foundation with compressive strength testing"`
   - *Result:* Recommends **IS 1489 (Part 1):2015**, links to **IS 456:2000** (RCC code) and **IS 4031** (strength testing).
3. **PPE Industrial Safety Helmet**:
   - *Query:* `"Industrial safety helmets for construction workers providing shock absorption, penetration resistance and electrical insulation up to 1000 V"`
   - *Result:* Recommends **IS 2925:2024** under mandatory Scheme-I ISI mark.
4. **Tender Version Audit (Superseded Standard Detection)**:
   - *Query:* `"Supply of three-phase induction motor as per IS 325:1996 and cement as per IS 8112:1989"`
   - *Result:* Triggers prominent amber warnings:
     - `⚠ IS 325:1996 has been superseded by IS 12615:2018`
     - `⚠ IS 8112:1989 has been superseded by IS 269:2015`
5. **Sample Tender PDF Upload**:
   - Click **"Upload Tender PDF"** and select `sample_tender_document.pdf`.
   - The system extracts text via PyMuPDF, extracts requirements, audits citations, and generates recommendations.
6. **Technical Audit View**:
   - Click **"View Technical Details & Algorithmic Scoring"** in the web UI to inspect the 5 scoring factors, itemized evidence checklist, pipeline latency profile, and candidate score comparison matrix.

---

## ⚖️ Limitations & Prototype Boundaries

To remain honest and technically credible for hackathon evaluation:
- **Curated Demonstration Catalog**: The prototype contains 62 representative standards covering 5 major procurement domains (Electrical, Civil, Mechanical/Pumps, Safety/PPE, Solar). It is not a complete 20,000+ BIS national catalog.
- **AI Relevance vs. Legal Compliance**: The system outputs an *AI Relevance Score* representing algorithmic alignment between tender specifications and standards scope. It does not replace statutory certification audits by licensed BIS certifying officers.
- **Scanned PDF Support**: Text extraction relies on PyMuPDF for digital-native PDF tenders; scanned image-only PDFs require a production OCR pipeline (e.g., Tesseract/PaddleOCR).

---

## 🌐 Production Scaling Roadmap

1. **Enterprise Vector DB**: Deploy Qdrant or Milvus cluster storing embeddings for all 20,000+ Indian Standards.
2. **Live Gazette Ingestion**: Crawler connected to BIS e-Sale portal and Quality Control Orders (QCO) gazettes.
3. **E-Procurement Integration**: REST webhook for Government e-Marketplace (GeM) and CPPP to audit tender specifications prior to publishing.
