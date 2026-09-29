"""
Build Multilingual Embeddings — scripts/build_multilingual_embeddings.py

Pre-computes and caches multilingual-e5-large embeddings for all 113 Indian Standards.
Run this script once after model download to populate:
  - data/standards_embeddings_multilingual.npy       (113, 1024) document embeddings
  - data/standards_chunk_embeddings_multilingual.npz  (791, 1024) chunk embeddings

Does NOT touch data/standards_embeddings.npy or data/standards_chunk_embeddings.npz
(the existing all-MiniLM-L6-v2 English embeddings).
"""

import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
import numpy as np
from sentence_transformers import SentenceTransformer

MULTILINGUAL_MODEL = "intfloat/multilingual-e5-large"
STANDARDS_PATH = "data/standards.json"
DOC_OUT_PATH = "data/standards_embeddings_multilingual.npy"
CHUNK_OUT_PATH = "data/standards_chunk_embeddings_multilingual.npz"

CHUNK_FIELDS = ["scope", "key_requirements", "technical_parameters", "applications", "testing_methods", "safety_criteria"]


def prepare_passage(text: str) -> str:
    return f"passage: {text}"


def main():
    print("=" * 70)
    print("BIS-SpecAI — Multilingual Embedding Builder (intfloat/multilingual-e5-large)")
    print("=" * 70)

    with open(STANDARDS_PATH, "r", encoding="utf-8") as f:
        standards = json.load(f)

    print(f"Loaded {len(standards)} standards from {STANDARDS_PATH}")
    print(f"Loading model: {MULTILINGUAL_MODEL} ...")
    model = SentenceTransformer(MULTILINGUAL_MODEL)
    print("Model loaded.\n")

    # 1. Document-level passages
    doc_texts = []
    for std in standards:
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
        doc_texts.append(prepare_passage(" ".join(parts)))

    print(f"Encoding {len(doc_texts)} document passages...")
    doc_embeddings = model.encode(
        doc_texts,
        convert_to_numpy=True,
        show_progress_bar=True,
        batch_size=32,
        normalize_embeddings=True
    )
    np.save(DOC_OUT_PATH, doc_embeddings)
    print(f"Saved doc embeddings: {doc_embeddings.shape} -> {DOC_OUT_PATH}\n")

    # 2. Structured chunk embeddings
    chunk_texts = []
    chunk_std_indices = []
    chunk_types = []

    for idx, std in enumerate(standards):
        chunks = std.get("chunks", {})
        if not chunks:
            continue
        for field in CHUNK_FIELDS:
            chunk_val = chunks.get(field, "")
            if chunk_val and len(chunk_val.strip()) > 10:
                chunk_texts.append(prepare_passage(chunk_val))
                chunk_std_indices.append(idx)
                chunk_types.append(field)

    if chunk_texts:
        print(f"Encoding {len(chunk_texts)} structured chunk passages...")
        chunk_embeddings = model.encode(
            chunk_texts,
            convert_to_numpy=True,
            show_progress_bar=True,
            batch_size=32,
            normalize_embeddings=True
        )
        np.savez(
            CHUNK_OUT_PATH,
            embeddings=chunk_embeddings,
            standard_indices=np.array(chunk_std_indices, dtype=np.int32),
            chunk_types=np.array(chunk_types)
        )
        print(f"Saved chunk embeddings: {chunk_embeddings.shape} -> {CHUNK_OUT_PATH}")
    else:
        print("No chunk data found — skipping chunk embeddings.")

    print("\n" + "=" * 70)
    print("Multilingual embedding build complete.")
    print(f"  Document embeddings: {doc_embeddings.shape}")
    if chunk_texts:
        print(f"  Chunk embeddings:    {chunk_embeddings.shape}")
    print("=" * 70)


if __name__ == "__main__":
    main()
