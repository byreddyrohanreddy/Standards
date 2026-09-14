import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
import time
from typing import List, Dict, Any
from backend.main import run_pipeline

def evaluate_retrieval_engine(eval_queries_path: str = "data/eval_queries.json"):
    with open(eval_queries_path, "r", encoding="utf-8") as f:
        queries = json.load(f)

    total_queries = len(queries)
    recall_at_1_hits = 0
    recall_at_5_hits = 0
    reciprocal_ranks = []
    
    version_queries = 0
    version_hits = 0
    
    normative_discovery_total = 0
    normative_discovery_hits = 0

    print("=" * 80)
    print("BIS-SpecAI EVALUATION BENCHMARK SUITE (SIH 2026 Problem Statement 26108)")
    print("=" * 80)
    print(f"Total Ground Truth Test Queries: {total_queries}\n")

    start_time = time.time()

    for i, item in enumerate(queries, 1):
        q_text = item["query"]
        expected = item["expected_standards"]
        top_exp = item.get("top_expected")

        response = run_pipeline(q_text, top_k=5)
        candidates = [c.is_number for c in response.candidate_standards]
        
        # Check Recall@1
        if candidates and (candidates[0] == top_exp or candidates[0] in expected):
            recall_at_1_hits += 1
            
        # Check Recall@5
        found_any = any(cand in expected for cand in candidates)
        if found_any:
            recall_at_5_hits += 1

        # Calculate Reciprocal Rank
        rank = None
        for r, cand in enumerate(candidates, 1):
            if cand == top_exp or cand in expected:
                rank = r
                break
        if rank is not None:
            reciprocal_ranks.append(1.0 / rank)
        else:
            reciprocal_ranks.append(0.0)

        # Version Alert check
        if item.get("check_version"):
            version_queries += 1
            outdated_flag = item.get("outdated_flag")
            superseded_by = item.get("superseded_by")
            alert_matched = any(
                a.referenced_standard == outdated_flag and (superseded_by is None or a.current_replacement == superseded_by)
                for a in response.version_alerts
            )
            if alert_matched:
                version_hits += 1

        # Normative reference discovery check
        normative_refs = [n.is_number for n in response.related_standards.normative_references]
        if response.primary_standard and response.primary_standard.normative_references:
            normative_discovery_total += 1
            if len(normative_refs) > 0:
                normative_discovery_hits += 1

        # Print query trace
        print(f"[{i:02d}/{total_queries:02d}] Query: {q_text[:65]}...")
        print(f"     Top Expected: {top_exp} | Retrieved Rank #1: {candidates[0] if candidates else 'None'}")
        print(f"     AI Relevance: {response.primary_standard.ai_relevance_score if response.primary_standard else 0}% | Hits in Top-5: {found_any}")
        if response.version_alerts:
            for va in response.version_alerts:
                print(f"     [ALERT] Detected: {va.referenced_standard} -> Replacement: {va.current_replacement}")
        print("-" * 80)

    elapsed = time.time() - start_time
    avg_latency = (elapsed / total_queries) * 1000

    r1 = (recall_at_1_hits / total_queries) * 100
    r5 = (recall_at_5_hits / total_queries) * 100
    mrr = sum(reciprocal_ranks) / len(reciprocal_ranks) if reciprocal_ranks else 0.0
    v_acc = (version_hits / version_queries) * 100 if version_queries > 0 else 100.0
    norm_rate = (normative_discovery_hits / normative_discovery_total) * 100 if normative_discovery_total > 0 else 100.0

    print("\n" + "=" * 80)
    print("FINAL EVALUATION RESULTS SUMMARY")
    print("=" * 80)
    print(f"  • Total Evaluated Queries          : {total_queries}")
    print(f"  • Recall@1                         : {r1:.2f}% ({recall_at_1_hits}/{total_queries})")
    print(f"  • Recall@5                         : {r5:.2f}% ({recall_at_5_hits}/{total_queries})")
    print(f"  • Mean Reciprocal Rank (MRR)       : {mrr:.4f}")
    print(f"  • Outdated Version Detection Acc.  : {v_acc:.2f}% ({version_hits}/{version_queries})")
    print(f"  • Normative Ref. Discovery Rate    : {norm_rate:.2f}% ({normative_discovery_hits}/{normative_discovery_total})")
    print(f"  • Average Pipeline Latency         : {avg_latency:.1f} ms / query")
    print("=" * 80 + "\n")

    summary_results = {
        "total_queries": total_queries,
        "recall_at_1": round(r1, 2),
        "recall_at_5": round(r5, 2),
        "mrr": round(mrr, 4),
        "version_detection_accuracy": round(v_acc, 2),
        "normative_discovery_rate": round(norm_rate, 2),
        "avg_latency_ms": round(avg_latency, 1)
    }

    with open("evaluation/eval_results.json", "w", encoding="utf-8") as f:
        json.dump(summary_results, f, indent=2)

    return summary_results

if __name__ == "__main__":
    evaluate_retrieval_engine()
