# 📋 BIS-SpecAI: Evaluator & Jury Quickstart Guide

> **Smart India Hackathon (SIH) 2026 — Problem Statement 26108**  
> **Title:** *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*  
> **Team:** BIS-SpecAI Solution Suite

---

## ⚡ 1. One-Click Setup & Launch

On Windows, you can set up and run the entire full-stack application with two batch scripts:

### Step 1: Install Dependencies
Double-click `setup.bat` or run:
```bat
setup.bat
```
*Creates Python virtual environment (`.venv`), installs `requirements.txt` dependencies, and runs `npm install` in `frontend/`.*

### Step 2: Start All Services
Double-click `start.bat` or run:
```bat
start.bat
```
*Spawns the FastAPI backend (`http://127.0.0.1:8000`), the Next.js frontend (`http://localhost:3000`), and automatically opens your default browser to `http://localhost:3000`.*

---

## 🌐 2. Service Access Endpoints

| Service | URL | Notes |
| :--- | :--- | :--- |
| **Web Application** | [http://localhost:3000](http://localhost:3000) | Full Next.js frontend with all 14 pages |
| **Backend REST API** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | FastAPI core engine |
| **Interactive API Documentation** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Swagger UI for testing endpoints directly |
| **API Health Check** | [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health) | Returns standards index count & status |

---

## 🧪 3. Running Automated Verification & Benchmarks

In your terminal (with Python environment active):

### 3.1 Run the Automated Test Suite (14 Tests)
```bash
pytest tests/test_pipeline.py -v
```
**Expected Outcome:** 14/14 tests passing, verifying:
- Parameter extraction & compound tender segmentation
- Dual-path retrieval precision (semantic + lexical BM25)
- Superseded standard detection (`IS 325`, `IS 8112`)
- Rejection of out-of-domain / fictional queries
- In-memory PDF parsing and compliance clause generation

### 3.2 Run the Evaluation Benchmark
```bash
python evaluation/evaluate.py
```
**Expected Outcome:** Generates live metrics on 22 authentic ground-truth benchmark queries:
- **Recall@1:** **90.91%**
- **Recall@5:** **100.00%**
- **MRR (Mean Reciprocal Rank):** **0.9470**
- **Average Pipeline Latency:** **< 50 ms / query**
- **Superseded Standard Audit Accuracy:** **100.00%**

---

## 🎯 4. Key Demonstration Scenarios to Test in UI

Once the application is running at `http://localhost:3000`, test these key workflows:

### Scenario A: Complex Electrical Specification
- **Navigate to:** `/recommend`
- **Query:** `15 kW three phase induction motor, 415 V, 50 Hz for continuous industrial duty with IP55 protection and efficiency requirements`
- **What to look for:**
  - Identifies **IS 12615:2018 (IE3 Class)** with high AI relevance score
  - Categorizes normative cross-references: **IS 15999** (testing), **IS/IEC 60034-5** (enclosure), **IS 3043** (earthing)
  - Interactive React Flow DAG button opens knowledge graph traversal
  - "Copy to Tender" compiles a ready-to-use NIT compliance clause

### Scenario B: Outdated Standard Audit (Supersession Alert)
- **Navigate to:** `/recommend`
- **Query:** `Supply of three phase induction motor as per IS 325:1996 for water works pumping station`
- **What to look for:**
  - Critical Alert Banner triggers: **IS 325:1996 is SUPERSEDED**
  - Actionable replacement provided: **IS 12615:2018**
  - Prevents procurement officers from publishing obsolete standards

### Scenario C: Tender NIT Compliance Audit
- **Navigate to:** `/audit/new`
- **Action:** Paste tender text or upload sample tender PDF (`sample_tender_document.pdf` in project root)
- **What to look for:**
  - Scans document section by section
  - Detects cited standards, identifies superseded references, and checks mandatory Quality Control Orders (QCOs)
  - Saves audit to `/history` for persistent recall and comparison

### Scenario D: Multi-Requirement Compound Tender
- **Navigate to:** `/recommend`
- **Query:** `Supply of 500 kVA distribution transformer with copper winding and 250 kVA silent diesel generator set with AMF panel`
- **What to look for:**
  - System automatically segments the compound specification into two distinct procurement groups:
    - Group 1: Distribution Transformer -> **IS 1180 (Part 1):2014**
    - Group 2: Diesel Generator Set -> **IS/ISO 8528** / **IS 13364**

---

## 📦 5. Technical Highlights for Evaluators

1. **Dual-Path Hybrid Retrieval:**
   - Combines normalized **BM25 Okapi** (for exact ratings, grades, and code numbers) with dense **SentenceTransformers (`all-MiniLM-L6-v2`)** embeddings.
   - Structured chunk max-pooling across scope, technical parameters, testing, and safety sections.
2. **Explainable Scoring:**
   - Multi-factor breakdown: $0.35 \times \text{Semantic} + 0.25 \times \text{Lexical} + 0.20 \times \text{Coverage} + 0.10 \times \text{Domain} + 0.10 \times \text{Version}$.
3. **Knowledge Graph Traversal:**
   - Traversing 759 directed edges across normative references, test methods, safety codes, and installation standards.
4. **Mandatory QCO Database:**
   - Integrated BIS Quality Control Orders tracking mandatory compliance dates and issuing ministries.
