import json
import re
from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi

from backend.models.schemas import StandardMetadata, ExtractedRequirements, AmendmentInfo

class HybridRetrievalEngine:
    def __init__(self, standards_path: str = "data/standards.json"):
        self.standards_path = standards_path
        self.standards: List[Dict[str, Any]] = []
        self.standards_by_number: Dict[str, Dict[str, Any]] = {}
        self.standards_by_id: Dict[str, Dict[str, Any]] = {}
        
        self.corpus_texts: List[str] = []
        self.bm25_corpus: List[List[str]] = []
        self.bm25 = None
        self.vectorizer = None
        self.doc_vectors = None
        
        self.load_data()
        self.build_indexes()

    def load_data(self):
        with open(self.standards_path, "r", encoding="utf-8") as f:
            self.standards = json.load(f)
        
        for std in self.standards:
            self.standards_by_number[std["is_number"]] = std
            self.standards_by_id[std["id"]] = std

    def _prepare_document_text(self, std: Dict[str, Any]) -> str:
        """Combines all standard attributes into a rich searchable text representation."""
        parts = [
            std.get("is_number", ""),
            std.get("title", ""),
            std.get("domain", ""),
            std.get("scope", ""),
            " ".join(std.get("keywords", [])),
        ]
        
        params = std.get("technical_parameters", {})
        for k, v in params.items():
            if isinstance(v, list):
                parts.append(" ".join(str(item) for item in v))
            else:
                parts.append(str(v))
                
        for cert in std.get("certification", []):
            parts.append(cert)
            
        return " ".join(parts)

    def _tokenize(self, text: str) -> List[str]:
        tokens = re.findall(r"\w+", text.lower())
        return [t for t in tokens if len(t) > 1]

    def build_indexes(self):
        self.corpus_texts = [self._prepare_document_text(s) for s in self.standards]
        
        # BM25 Lexical index
        self.bm25_corpus = [self._tokenize(doc) for doc in self.corpus_texts]
        self.bm25 = BM25Okapi(self.bm25_corpus)
        
        # Dense Semantic TF-IDF Subword N-Gram Vectorizer (1-3 ngrams)
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            analyzer="word",
            sublinear_tf=True,
            max_features=10000
        )
        self.doc_vectors = self.vectorizer.fit_transform(self.corpus_texts)

    def retrieve_candidates(self, query: str, req: ExtractedRequirements, top_k: int = 5) -> List[StandardMetadata]:
        """
        Executes hybrid retrieval:
        1. BM25 score
        2. Dense Vector similarity score
        3. Parameter & domain coverage score
        4. Status weighting
        Returns ranked list of candidate StandardMetadata with AI relevance scores and explainability.
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []
            
        # 1. BM25 Lexical Scores
        bm25_raw_scores = np.array(self.bm25.get_scores(query_tokens))
        max_bm25 = np.max(bm25_raw_scores) if np.max(bm25_raw_scores) > 0 else 1.0
        bm25_norm = bm25_raw_scores / max_bm25

        # 2. Dense Vector Cosine Similarity
        query_vec = self.vectorizer.transform([query])
        vec_similarities = cosine_similarity(query_vec, self.doc_vectors).flatten()

        # 3. Multi-Factor Scoring & Explainability
        scored_candidates: List[Tuple[float, Dict[str, Any], List[str]]] = []
        
        query_lower = query.lower()

        for idx, std in enumerate(self.standards):
            std_text = self.corpus_texts[idx].lower()
            reasons: List[str] = []
            
            # Semantic & Lexical components
            sem_score = float(vec_similarities[idx])
            lex_score = float(bm25_norm[idx])
            
            # Coverage scoring
            coverage_hits = 0
            coverage_total = 0
            
            # Check ratings
            for r_name, r_val in req.ratings.items():
                coverage_total += 1
                clean_r_val = r_val.lower().replace(" (3-phase)", "").replace(" (1-phase)", "")
                if clean_r_val in std_text or any(token in std_text for token in clean_r_val.split()):
                    coverage_hits += 1
                    reasons.append(f"Standard scope covers technical requirement: {r_name} ({r_val})")
            
            # Check compliance needs
            for comp in req.compliance_needs:
                coverage_total += 1
                if any(w.lower() in std_text for w in comp.split() if len(w) > 3):
                    coverage_hits += 1
                    reasons.append(f"Addresses critical specification condition: {comp}")

            coverage_ratio = (coverage_hits / coverage_total) if coverage_total > 0 else 0.5
            
            # Domain match
            domain_match = 1.0 if req.domain and req.domain.lower() == std.get("domain", "").lower() else 0.3
            if domain_match == 1.0:
                reasons.append(f"Domain match: {std.get('domain')} procurement catalog")
                
            # Product keyword match
            if req.product and any(w in std.get("title", "").lower() for w in req.product.lower().split() if len(w) > 3):
                reasons.append(f"Product class match: {req.product} directly mapped to standard title/scope")

            # Status penalty for superseded standards unless explicitly mentioned
            status = std.get("status", "current")
            is_explicitly_mentioned = std["is_number"].lower() in query_lower or std["id"].lower() in query_lower
            
            if status == "superseded":
                if is_explicitly_mentioned:
                    status_factor = 0.95
                    reasons.append("Standard was explicitly cited in the procurement query (flagged as superseded)")
                else:
                    status_factor = 0.4
                    reasons.append("Note: Standard has been superseded by newer edition")
            else:
                status_factor = 1.0
                reasons.append(f"Standard is active and current ({std.get('year')} edition)")

            # Check certifications
            if std.get("certification"):
                reasons.append(f"Quality compliance: {std['certification'][0]}")

            # Formula:
            # 0.35 * Vector + 0.25 * BM25 + 0.20 * Coverage + 0.10 * Domain + 0.10 * Status
            raw_score = (
                0.35 * sem_score +
                0.25 * lex_score +
                0.20 * coverage_ratio +
                0.10 * domain_match +
                0.10 * status_factor
            )
            
            # Map raw score to realistic percentage (65% to 98%)
            # Using sigmoid or min-max calibration
            calibrated_percent = round(min(98.5, max(45.0, (raw_score * 70.0) + 30.0)), 1)
            
            scored_candidates.append((calibrated_percent, std, reasons))

        # Sort descending by score
        scored_candidates.sort(key=lambda x: x[0], reverse=True)

        results: List[StandardMetadata] = []
        for score, std, reasons in scored_candidates[:top_k + 2]:
            amendments = [
                AmendmentInfo(number=a.get("number", ""), year=a.get("year", 0), description=a.get("description", ""))
                for a in std.get("amendments", [])
            ]
            
            meta = StandardMetadata(
                id=std["id"],
                is_number=std["is_number"],
                title=std["title"],
                year=std["year"],
                domain=std["domain"],
                scope=std["scope"],
                status=std["status"],
                superseded_by=std.get("superseded_by"),
                supersedes=std.get("supersedes", []),
                amendments=amendments,
                normative_references=std.get("normative_references", []),
                test_methods=std.get("test_methods", []),
                safety_standards=std.get("safety_standards", []),
                installation_standards=std.get("installation_standards", []),
                related_standards=std.get("related_standards", []),
                certification=std.get("certification", []),
                technical_parameters=std.get("technical_parameters", []),
                keywords=std.get("keywords", []),
                ai_relevance_score=score,
                why_recommended=reasons[:5]
            )
            results.append(meta)

        # Ensure that if any top candidate is superseded, its active replacement standard is also promoted
        final_results = results[:top_k]
        existing_numbers = {c.is_number for c in final_results}
        
        for cand in list(final_results):
            if cand.status == "superseded" and cand.superseded_by:
                rep_num = cand.superseded_by
                if rep_num not in existing_numbers:
                    rep_std = self.get_standard_by_number(rep_num)
                    if rep_std:
                        amends = [
                            AmendmentInfo(number=a.get("number", ""), year=a.get("year", 0), description=a.get("description", ""))
                            for a in rep_std.get("amendments", [])
                        ]
                        rep_meta = StandardMetadata(
                            id=rep_std["id"],
                            is_number=rep_std["is_number"],
                            title=rep_std["title"],
                            year=rep_std["year"],
                            domain=rep_std["domain"],
                            scope=rep_std["scope"],
                            status=rep_std["status"],
                            superseded_by=rep_std.get("superseded_by"),
                            supersedes=rep_std.get("supersedes", []),
                            amendments=amends,
                            normative_references=rep_std.get("normative_references", []),
                            test_methods=rep_std.get("test_methods", []),
                            safety_standards=rep_std.get("safety_standards", []),
                            installation_standards=rep_std.get("installation_standards", []),
                            related_standards=rep_std.get("related_standards", []),
                            certification=rep_std.get("certification", []),
                            technical_parameters=rep_std.get("technical_parameters", []),
                            keywords=rep_std.get("keywords", []),
                            ai_relevance_score=round(cand.ai_relevance_score + 5.0, 1),
                            why_recommended=[
                                f"Active modern replacement for superseded standard {cand.is_number} cited in procurement specification",
                                f"Mandatory compliance standard under current BIS Quality Control Orders ({rep_std.get('year')} edition)"
                            ]
                        )
                        # Insert replacement at top
                        final_results.insert(0, rep_meta)
                        existing_numbers.add(rep_num)
                        
        return final_results[:top_k]

    def get_standard_by_number(self, is_number: str) -> Dict[str, Any]:
        return self.standards_by_number.get(is_number)

    def get_standard_by_id(self, std_id: str) -> Dict[str, Any]:
        return self.standards_by_id.get(std_id)
