import { AnalysisResponse, ExampleScenario, StandardMetadata } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function analyzeRequirement(query: string, topK: number = 5): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Network request failed" }));
    throw new Error(err.detail || `Server error: ${res.status}`);
  }

  return res.json();
}

export async function uploadTenderPdf(file: File, topK: number = 5): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("top_k", topK.toString());

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to process PDF" }));
    throw new Error(err.detail || `Server error: ${res.status}`);
  }

  return res.json();
}

export async function fetchExamples(): Promise<ExampleScenario[]> {
  const res = await fetch(`${API_BASE}/examples`);
  if (!res.ok) {
    throw new Error("Failed to load preset examples");
  }
  return res.json();
}

export async function fetchStandards(): Promise<StandardMetadata[]> {
  const res = await fetch(`${API_BASE}/standards`);
  if (!res.ok) {
    throw new Error("Failed to load standards catalog");
  }
  return res.json();
}
