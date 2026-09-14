# BIS-SpecAI: AI-Powered Recommendation Engine for Indian Standards (BIS)

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH_2026-Problem_Statement_26108-orange.svg)](https://www.sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org)
[![React Flow](https://img.shields.io/badge/React_Flow-xyflow-purple.svg)](https://reactflow.dev)
[![Recall@5](https://img.shields.io/badge/Recall@5-100%25-brightgreen.svg)]()
[![MRR](https://img.shields.io/badge/MRR-0.9773-brightgreen.svg)]()

> **Smart India Hackathon 2026 — Problem Statement 26108**  
> *"AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications"*

---

## 🏛️ Executive Summary

Government departments (CPWD, Railways, Defence, State PWDs, PSUs) publish thousands of procurement tenders annually. Specifying incorrect, obsolete, or non-harmonized Indian Standards (IS) leads to tender disputes, audit objections, safety non-compliance, and rejected bids.

**BIS-SpecAI** is an intelligent procurement assistant that accepts natural-language technical requirements or tender NIT PDFs and executes an end-to-end recommendation pipeline:
1. **Dynamic Requirement Understanding**: Extracts product class, ratings (kW, V, Hz, Phase, IP rating, Pressure), materials, and operating context.
2. **Hybrid Lexical + Dense Semantic Retrieval**: Combines BM25 token matching with subword dense semantic embeddings and multi-factor reranking.
3. **Standards Relationship Graph**: Traverses normative references, testing standards, safety standards, installation codes, and related products.
4. **Tender Version & Obsolescence Auditor**: Detects outdated or superseded standard references (e.g., `IS 325:1996` superseded by `IS 12615:2018`) and generates high-priority procurement alerts.
5. **Data-Driven Explainability**: Itemizes why each standard was recommended based on retrieved technical parameters.
6. **Interactive Relationship Graph**: Uses React Flow for visual exploration of the standards network.

---

## 📊 Benchmark Evaluation Results

The recommendation pipeline was evaluated against **22 ground-truth procurement queries** spanning Electrical, Civil, Mechanical, Safety/PPE, and Solar sectors:

| Metric | Score | Evaluation Notes |
| :--- | :---: | :--- |
| **Recall@1** | **95.45%** (21/22) | Top recommended standard is the exact ground-truth specification |
| **Recall@5** | **100.00%** (22/22) | Applicable standard is present in top-5 candidate pool |
| **Mean Reciprocal Rank (MRR)** | **0.9773** | High ranking confidence across multi-parameter queries |
| **Outdated Version Detection** | **100.00%** (2/2) | Flawlessly identifies superseded standards (`IS 325`, `IS 8112`) |
| **Normative Ref. Discovery** | **100.00%** (22/22) | Successfully maps mandatory testing & safety cross-references |
| **Average Pipeline Latency** | **1.9 ms / query** | Sub-5 millisecond response time for instant procurement search |

*Evaluation script:* `python evaluation/evaluate.py` (saved to `evaluation/eval_results.json`).

---

## 🛠️ Architecture & Pipeline

```
                     Procurement Specification / Tender NIT PDF
                                        │
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │   Dynamic Requirement Understanding      │
                  │   (Regex + NLP Entity & Parameter Parse) │
                  └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │    Tender Version & Obsolescence Audit   │
                  │   (Flags superseded standards e.g. IS 325│
                  │    recommends active IS 12615:2018)      │
                  └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │        Hybrid Retrieval Engine           │
                  │  ├── BM25 Okapi Lexical Match (30%)     │
                  │  ├── Dense Semantic Similarity (35%)    │
                  │  ├── Parameter Coverage Scoring (20%)   │
                  │  └── Domain & Status Calibration (15%)  │
                  └─────────────────────┬────────────────────┘
                                        │
                                        ▼
                  ┌──────────────────────────────────────────┐
                  │       Explainable Primary Standard       │
                  │       (AI Relevance Score: e.g. 94%)     │
                  │       (Itemized Evidence Checklist)      │
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
                  │ & Government Tender Export Bar           │
                  └──────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
SIH108/
├── backend/
│   ├── main.py                     # FastAPI application endpoints
│   ├── requirements.txt            # Backend dependencies
│   ├── models/
│   │   └── schemas.py              # Pydantic data schemas
│   └── services/
│       ├── nlp_extractor.py        # Dynamic requirement & parameter parser
│       ├── retrieval_engine.py     # BM25 + Dense vector hybrid retriever
│       ├── graph_service.py        # Relationship graph traverser & React Flow generator
│       ├── version_auditor.py      # Version check & obsolescence warning engine
│       └── pdf_service.py          # PyMuPDF tender document text extractor
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with metadata
│   │   │   ├── page.tsx            # Main application UI
│   │   │   └── globals.css         # Tailwind CSS & React Flow styling
│   │   ├── components/
│   │   │   ├── Header.tsx          # Government procurement header
│   │   │   ├── RequirementInput.tsx# Query input, quick presets & PDF upload
│   │   │   ├── RequirementUnderstandingCard.tsx # Dynamic extracted tags
│   │   │   ├── VersionAlertBanner.tsx           # Outdated standard warnings
│   │   │   ├── PrimaryStandardCard.tsx          # Primary standard card & explainability
│   │   │   ├── RelatedStandardsSection.tsx      # Categorized normative/test/safety tabs
│   │   │   ├── CandidateStandardsList.tsx       # Alternative candidates ranking
│   │   │   ├── StandardsGraphModal.tsx          # Interactive React Flow graph modal
│   │   │   └── StandardDetailModal.tsx          # Node inspection modal
│   │   ├── lib/
│   │   │   └── api.ts              # API client library
│   │   └── types/
│   │       └── index.ts            # TypeScript interfaces
│   └── package.json
│
├── data/
│   ├── standards.json              # 62 curated Indian Standards records
│   ├── relationships.json          # 249 directed relationship edges
│   ├── certifications.json         # BIS Scheme-I (ISI Mark) & CRS schemes
│   ├── examples.json               # 6 preset evaluation scenarios
│   └── eval_queries.json           # 22 ground-truth benchmark queries
│
├── evaluation/
│   ├── evaluate.py                 # Evaluation benchmark script (Recall, MRR)
│   └── eval_results.json           # Evaluation metrics output
│
├── scripts/
│   ├── generate_dataset.py         # Curated dataset builder
│   └── create_sample_tender_pdf.py # Generates sample CPWD tender PDF
│
├── sample_tender_document.pdf      # Sample tender PDF for upload testing
├── .env.example                    # Environment configuration template
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
The backend API documentation will be accessible at: `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd SIH108/frontend

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🎯 Guided Demo Scenarios

Click the **"Try Example"** dropdown in the web UI or test these scenarios:

1. **Three-Phase Induction Motor (Electrical)**:
   - *Query:* `"15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements"`
   - *Result:* Retrieves **IS 12615:2018 (IE3 class)** with 82.4% relevance, maps testing to **IS 15999**, safety enclosure to **IS/IEC 60034-5**, and earthing to **IS 3043:2018**.
2. **Structural Pozzolana Cement (Civil)**:
   - *Query:* `"Fly ash based Portland Pozzolana Cement (PPC) for reinforced concrete foundation with compressive strength testing"`
   - *Result:* Recommends **IS 1489 (Part 1):2015**, links to **IS 456:2000** (RCC code) and **IS 4031** (strength testing).
3. **PPE Industrial Safety Helmet**:
   - *Query:* `"Industrial safety helmets for construction workers providing shock absorption, penetration resistance and electrical insulation up to 1000 V"`
   - *Result:* Recommends **IS 2925:2024** under mandatory Scheme-I ISI mark.
4. **Tender Version Audit (Obsolete Standard Detection)**:
   - *Query:* `"Supply of three-phase induction motor as per IS 325:1996 and cement as per IS 8112:1989"`
   - *Result:* Triggers prominent amber warnings:
     - `⚠ IS 325:1996 has been superseded by IS 12615:2018`
     - `⚠ IS 8112:1989 has been superseded by IS 269:2015`
5. **Sample Tender PDF Upload**:
   - Click **"Upload Tender PDF"** and select `sample_tender_document.pdf`.
   - The system automatically extracts text via PyMuPDF, identifies the 15 kW motor requirement, audits legacy citations, and outputs the full report.

---

## 🌐 Scaling Roadmap for Complete BIS Ecosystem

This MVP prototype is designed with clean modularity to scale into a national production service:

1. **Enterprise Vector Database**:
   - Swap the in-memory vectorizer in `retrieval_engine.py` with **Qdrant** or **Milvus** cluster storing dense embeddings for all 20,000+ active Indian Standards.
2. **Live BIS Gazette Ingestion Pipeline**:
   - Automated crawler connected to the Bureau of Indian Standards standards portal and Quality Control Orders (QCO) gazette notifications to ingest newly published amendments daily.
3. **Scanned PDF OCR Pipeline**:
   - Integrate `PaddleOCR` or `Tesseract` behind `pdf_service.py` to parse legacy scanned government tender notices.
4. **E-Procurement (GeM / CPPP) Integration**:
   - REST webhook to validate specifications during tender creation on the Government e-Marketplace (GeM) and Central Public Procurement Portal (CPPP).
