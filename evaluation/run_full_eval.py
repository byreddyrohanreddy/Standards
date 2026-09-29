import sys
import io
import os

# Force UTF-8 stdout to prevent Windows cp1252 encoding errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.abspath("."))

import json
from backend.main import run_pipeline, retrieval_engine
from backend.services.multilingual_engine import MultilingualRetrievalEngine
import numpy as np


def recall_at_k(hit):
    return 1 if hit else 0


def mrr_score(rank):
    return 1.0 / rank if rank > 0 else 0.0


def evaluate_slice(queries, label, top_k=5):
    print("\n" + "=" * 70)
    print("  Eval Slice: " + label + "  (" + str(len(queries)) + " queries)")
    print("=" * 70)

    r1_hits, r5_hits, mrr_scores = [], [], []
    failures = []

    for i, item in enumerate(queries):
        query = item["query"]
        expected = item["expected_standards"]

        try:
            res = run_pipeline(query, top_k=top_k)
            candidates = [c.is_number for c in res.candidate_standards]

            r1 = recall_at_k(bool(candidates) and candidates[0] in expected)
            r5 = recall_at_k(any(c in expected for c in candidates[:5]))
            r1_hits.append(r1)
            r5_hits.append(r5)

            rank = 0
            for rk, cand in enumerate(candidates[:5], 1):
                if cand in expected:
                    rank = rk
                    break
            mrr_scores.append(mrr_score(rank))

            status = "PASS" if r5 else "FAIL"
            t1 = "PASS" if r1 else "FAIL"
            q_preview = (query[:65] + "...") if len(query) > 65 else query
            print("  [%2d] Top-5:%s Top-1:%s | %s" % (i + 1, status, t1, q_preview))
            if not r5:
                failures.append({
                    "query": query[:80],
                    "expected": expected,
                    "got": candidates[:3]
                })

        except Exception as e:
            print("  [%2d] ERROR: %s" % (i + 1, str(e)))
            r1_hits.append(0)
            r5_hits.append(0)
            mrr_scores.append(0.0)

    n = len(queries)
    recall_1 = sum(r1_hits) / n
    recall_5 = sum(r5_hits) / n
    mean_mrr = sum(mrr_scores) / n

    print("\n  Recall@1 = %.4f  (%d/%d)" % (recall_1, sum(r1_hits), n))
    print("  Recall@5 = %.4f  (%d/%d)" % (recall_5, sum(r5_hits), n))
    print("  MRR@5    = %.4f" % mean_mrr)

    if failures:
        print("\n  [!] %d failures:" % len(failures))
        for f in failures:
            print("     Query:    " + f["query"])
            print("     Expected: " + str(f["expected"]))
            print("     Got:      " + str(f["got"]))
            print()

    return {"label": label, "n": n, "recall_1": recall_1, "recall_5": recall_5, "mrr": mean_mrr}


def evaluate_hindi_multilingual(queries, label, ml_engine, top_k=5):
    print("\n" + "=" * 70)
    print("  Eval Slice: " + label + "  (" + str(len(queries)) + " queries)")
    print("=" * 70)

    r1_hits, r5_hits, mrr_scores = [], [], []
    failures = []

    for i, item in enumerate(queries):
        query = item["query"]
        expected = item["expected_standards"]

        try:
            sims = ml_engine.compute_similarity(query)
            if sims is None:
                print("  [%2d] ERROR: ML engine not initialized" % (i + 1))
                r1_hits.append(0); r5_hits.append(0); mrr_scores.append(0.0)
                continue

            top_indices = np.argsort(sims)[::-1][:top_k]
            candidates = [retrieval_engine.standards[idx]["is_number"] for idx in top_indices]

            r1 = recall_at_k(bool(candidates) and candidates[0] in expected)
            r5 = recall_at_k(any(c in expected for c in candidates[:5]))
            r1_hits.append(r1)
            r5_hits.append(r5)

            rank = 0
            for rk, cand in enumerate(candidates[:5], 1):
                if cand in expected:
                    rank = rk
                    break
            mrr_scores.append(mrr_score(rank))

            status = "PASS" if r5 else "FAIL"
            t1 = "PASS" if r1 else "FAIL"
            q_preview = (query[:55] + "...") if len(query) > 55 else query
            print("  [%2d] Top-5:%s Top-1:%s | %s" % (i + 1, status, t1, q_preview))
            if not r5:
                failures.append({"query": query[:80], "expected": expected, "got": candidates[:3]})

        except Exception as e:
            print("  [%2d] ERROR: %s" % (i + 1, str(e)))
            r1_hits.append(0); r5_hits.append(0); mrr_scores.append(0.0)

    n = len(queries)
    recall_1 = sum(r1_hits) / n
    recall_5 = sum(r5_hits) / n
    mean_mrr = sum(mrr_scores) / n

    print("\n  Recall@1 = %.4f  (%d/%d)" % (recall_1, sum(r1_hits), n))
    print("  Recall@5 = %.4f  (%d/%d)" % (recall_5, sum(r5_hits), n))
    print("  MRR@5    = %.4f" % mean_mrr)

    if failures:
        print("\n  [!] %d failures:" % len(failures))
        for f in failures:
            print("     Query:    " + f["query"])
            print("     Expected: " + str(f["expected"]))
            print("     Got:      " + str(f["got"]))
            print()

    return {"label": label, "n": n, "recall_1": recall_1, "recall_5": recall_5, "mrr": mean_mrr}


def main():
    print("BIS-SpecAI -- Full Evaluation Suite")

    with open("data/eval_queries.json", "r", encoding="utf-8") as f:
        original_queries = json.load(f)
    with open("data/eval_queries_independent.json", "r", encoding="utf-8") as f:
        independent_queries = json.load(f)
    with open("data/eval_queries_hindi.json", "r", encoding="utf-8") as f:
        hindi_queries = json.load(f)

    results = []

    results.append(evaluate_slice(original_queries, "Original eval (corpus-informed, 22 queries)"))
    results.append(evaluate_slice(independent_queries, "Independent eval (procurement-language, 15 queries)"))
    results.append(evaluate_slice(hindi_queries, "Hindi via English model (all-MiniLM, 15 queries)"))

    print("\nInitializing multilingual-e5-large for Hindi eval...")
    ml_engine = MultilingualRetrievalEngine()
    ok = ml_engine.initialize()
    if ok:
        results.append(evaluate_hindi_multilingual(
            hindi_queries,
            "Hindi via multilingual-e5-large (15 queries)",
            ml_engine
        ))
    else:
        print("  [!] Multilingual engine not available -- skipping Hindi ML eval")

    # Summary table
    print("\n" + "=" * 70)
    print("  SUMMARY TABLE")
    print("=" * 70)
    header = "  %-48s %6s %6s %6s %4s" % ("Eval Slice", "R@1", "R@5", "MRR", "N")
    print(header)
    print("  " + "-" * 66)
    for r in results:
        lbl = r["label"][:48]
        print("  %-48s %6.3f %6.3f %6.4f %4d" % (lbl, r["recall_1"], r["recall_5"], r["mrr"], r["n"]))
    print("=" * 70)

    # Observations
    print("\n  KEY OBSERVATIONS:")
    orig = next((r for r in results if "Original" in r["label"]), None)
    indep = next((r for r in results if "Independent" in r["label"]), None)
    if orig and indep:
        gap = orig["recall_5"] - indep["recall_5"]
        if gap > 0.15:
            print("  [!] Recall@5 gap: %.1f%% drop (original -> independent)" % (gap * 100))
            print("      This quantifies vocabulary-fit advantage in original eval set.")
        else:
            print("  [OK] Recall@5 gap: only %.1f%% -- retrieval robust to vocab change." % (gap * 100))

    hindi_en = next((r for r in results if "English model" in r["label"]), None)
    hindi_ml = next((r for r in results if "multilingual-e5" in r["label"]), None)
    if hindi_en and hindi_ml:
        lift = hindi_ml["recall_5"] - hindi_en["recall_5"]
        print("\n  [ML] Multilingual lift on Hindi: +%.1f%% Recall@5 (%.1f%% -> %.1f%%)" % (
            lift * 100, hindi_en["recall_5"] * 100, hindi_ml["recall_5"] * 100))
        print("  [ML] MRR improvement: %.4f -> %.4f" % (hindi_en["mrr"], hindi_ml["mrr"]))


if __name__ == "__main__":
    main()
