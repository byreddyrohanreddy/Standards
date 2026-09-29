"""
Multilingual Retrieval Service — Phase 2.

Uses intfloat/multilingual-e5-large for non-English query support.
The multilingual-e5 model family requires a "query: " prefix on queries
and a "passage: " prefix on documents for optimal performance.

Strategy:
  - English queries  → existing all-MiniLM-L6-v2 index (no regression risk)
  - Hindi / other    → multilingual-e5-large index with dedicated embeddings
  - Automatic language detection via Unicode script analysis (no external dependency)

Pre-computed embeddings are stored separately to avoid touching the existing
standards_embeddings.npy and standards_chunk_embeddings.npz files.
"""

import os
import re
import json
import unicodedata
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


MULTILINGUAL_MODEL_NAME = "intfloat/multilingual-e5-large"
MULTILINGUAL_EMBEDDINGS_PATH = "data/standards_embeddings_multilingual.npy"
MULTILINGUAL_CHUNK_EMBEDDINGS_PATH = "data/standards_chunk_embeddings_multilingual.npz"


def detect_language(text: str) -> str:
    """
    Lightweight language detection via Unicode script analysis.
    Returns 'hi' for Hindi (Devanagari), 'en' for English/Latin.
    No external dependencies — just Unicode category inspection.
    """
    devanagari_count = 0
    latin_count = 0
    for ch in text:
        name = unicodedata.name(ch, "")
        if "DEVANAGARI" in name:
            devanagari_count += 1
        elif ch.isalpha() and ch.isascii():
            latin_count += 1

    total = devanagari_count + latin_count
    if total == 0:
        return "en"
    if devanagari_count / total >= 0.2:
        return "hi"
    return "en"


class MultilingualRetrievalEngine:
    """
    Second embedding index using multilingual-e5-large.
    Activated automatically for non-English queries.
    Shares the same standards.json data as the primary engine.
    """

    def __init__(
        self,
        standards_path: str = "data/standards.json",
        ml_embeddings_path: str = MULTILINGUAL_EMBEDDINGS_PATH,
        ml_chunk_embeddings_path: str = MULTILINGUAL_CHUNK_EMBEDDINGS_PATH,
    ):
        self.standards_path = standards_path
        self.ml_embeddings_path = ml_embeddings_path
        self.ml_chunk_embeddings_path = ml_chunk_embeddings_path

        self.standards: List[Dict[str, Any]] = []
        self.corpus_texts: List[str] = []
        self.model = None
        self.doc_embeddings: Optional[np.ndarray] = None
        self.chunk_embeddings: Optional[np.ndarray] = None
        self.chunk_std_indices: Optional[np.ndarray] = None
        self.initialized = False

        self._load_standards()

    def _load_standards(self):
        with open(self.standards_path, "r", encoding="utf-8") as f:
            self.standards = json.load(f)
        self.corpus_texts = [self._prepare_passage(s) for s in self.standards]

    def _prepare_passage(self, std: Dict[str, Any]) -> str:
        """Prepares passage text with 'passage: ' prefix required by e5 models."""
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
                parts.append(" ".join(str(i) for i in v))
            else:
                parts.append(str(v))
        raw = " ".join(parts)
        return f"passage: {raw}"

    def _prepare_query(self, query: str) -> str:
        """Prepends 'query: ' prefix required by e5 models."""
        return f"query: {query}"

    def initialize(self) -> bool:
        """
        Loads the multilingual-e5-large model and pre-computed embeddings.
        Returns True if successful, False if model not available.
        """
        if self.initialized:
            return True
        try:
            from sentence_transformers import SentenceTransformer
            print(f"[BIS-SpecAI-ML] Loading {MULTILINGUAL_MODEL_NAME}...")
            self.model = SentenceTransformer(MULTILINGUAL_MODEL_NAME)

            # Load or compute document-level embeddings
            if os.path.exists(self.ml_embeddings_path):
                self.doc_embeddings = np.load(self.ml_embeddings_path)
                if len(self.doc_embeddings) != len(self.standards):
                    print("[BIS-SpecAI-ML] Embedding count mismatch — recomputing...")
                    self._compute_and_save_embeddings()
            else:
                print(f"[BIS-SpecAI-ML] No cached ML embeddings found. Computing for {len(self.standards)} standards...")
                self._compute_and_save_embeddings()

            # Load chunk embeddings if available
            if os.path.exists(self.ml_chunk_embeddings_path):
                chunk_npz = np.load(self.ml_chunk_embeddings_path)
                self.chunk_embeddings = chunk_npz["embeddings"]
                self.chunk_std_indices = chunk_npz["standard_indices"]
                print(f"[BIS-SpecAI-ML] Loaded {len(self.chunk_embeddings)} ML chunk embeddings.")

            self.initialized = True
            print(f"[BIS-SpecAI-ML] Multilingual index ready ({len(self.standards)} standards).")
            return True
        except Exception as e:
            print(f"[BIS-SpecAI-ML] Could not initialize multilingual model: {e}")
            return False

    def _compute_and_save_embeddings(self):
        """Computes and caches multilingual document-level embeddings."""
        print(f"[BIS-SpecAI-ML] Encoding {len(self.corpus_texts)} passages with {MULTILINGUAL_MODEL_NAME}...")
        self.doc_embeddings = self.model.encode(
            self.corpus_texts,
            convert_to_numpy=True,
            show_progress_bar=True,
            batch_size=32,
            normalize_embeddings=True
        )
        np.save(self.ml_embeddings_path, self.doc_embeddings)
        print(f"[BIS-SpecAI-ML] Saved ML embeddings to {self.ml_embeddings_path}")

    def compute_similarity(self, query: str) -> Optional[np.ndarray]:
        """
        Computes cosine similarity for a query using the multilingual index.
        Returns None if model not initialized.
        """
        if not self.initialized or self.model is None or self.doc_embeddings is None:
            return None

        q_prefixed = self._prepare_query(query)
        q_emb = self.model.encode(
            [q_prefixed],
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        full_sims = cosine_similarity(q_emb, self.doc_embeddings)[0]

        # Chunk max-pooling if available
        if self.chunk_embeddings is not None and self.chunk_std_indices is not None:
            chunk_sims = cosine_similarity(q_emb, self.chunk_embeddings)[0]
            chunk_max = np.zeros(len(self.standards))
            for i in range(len(self.standards)):
                mask = (self.chunk_std_indices == i)
                if np.any(mask):
                    chunk_max[i] = float(np.max(chunk_sims[mask]))
            full_sims = 0.5 * full_sims + 0.5 * chunk_max

        return np.clip(full_sims, 0.0, 1.0)

    @staticmethod
    def detect_language(text: str) -> str:
        return detect_language(text)

    def is_non_english(self, text: str) -> bool:
        return detect_language(text) != "en"
