import {
  AnalysisResponse,
  ExampleScenario,
  StandardMetadata,
  TenderAuditReport,
  QCOListItem,
  RecommendationHistoryItem,
  AuditHistoryItem
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// In-memory cache for static catalog and regulatory registries
let _standardsCache: StandardMetadata[] | null = null;
let _qcoCache: QCOListItem[] | null = null;
let _examplesCache: ExampleScenario[] | null = null;
let _healthCache: { data: { status: string; standards_indexed: number }; expiry: number } | null = null;

export async function checkHealth(): Promise<{ status: string; standards_indexed: number }> {
  const now = Date.now();
  if (_healthCache && now < _healthCache.expiry) {
    return _healthCache.data;
  }
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    const data = await res.json();
    _healthCache = { data, expiry: now + 30000 }; // 30s cache
    return data;
  } catch (e) {
    return { status: "offline", standards_indexed: 113 };
  }
}

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

  const data: AnalysisResponse = await res.json();
  // Automatically persist to local history
  saveRecommendationToHistory(query, data);
  return data;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

function validatePdfFile(file: File) {
  if (!file) {
    throw new Error("No file selected.");
  }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    throw new Error("Invalid file format. Only PDF documents (.pdf) are supported for technical tender analysis.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File size (${sizeMb} MB) exceeds the maximum allowed limit of 25 MB.`);
  }
}

export async function uploadTenderPdf(file: File, topK: number = 5): Promise<AnalysisResponse> {
  validatePdfFile(file);

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

  const data: AnalysisResponse = await res.json();
  saveRecommendationToHistory(file.name, data);
  return data;
}

export async function auditTenderPdf(file: File): Promise<TenderAuditReport> {
  validatePdfFile(file);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/tender-audit`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Tender audit failed" }));
    throw new Error(err.detail || `Server error: ${res.status}`);
  }

  const report: TenderAuditReport = await res.json();
  saveAuditToHistory(report);
  return report;
}

export async function fetchExamples(): Promise<ExampleScenario[]> {
  if (_examplesCache && _examplesCache.length > 0) {
    return _examplesCache;
  }
  const res = await fetch(`${API_BASE}/examples`);
  if (!res.ok) {
    throw new Error("Failed to load preset examples");
  }
  const data = await res.json();
  _examplesCache = data;
  return data;
}

export async function fetchStandards(): Promise<StandardMetadata[]> {
  if (_standardsCache && _standardsCache.length > 0) {
    return _standardsCache;
  }
  const res = await fetch(`${API_BASE}/standards`);
  if (!res.ok) {
    throw new Error("Failed to load standards catalog");
  }
  const data = await res.json();
  _standardsCache = data;
  return data;
}

export async function fetchStandardDetail(stdId: string): Promise<any> {
  const cleanId = encodeURIComponent(stdId.trim());
  const res = await fetch(`${API_BASE}/standards/${cleanId}`);
  if (!res.ok) {
    throw new Error(`Standard '${stdId}' not found.`);
  }
  return res.json();
}

export async function fetchQcoList(): Promise<QCOListItem[]> {
  if (_qcoCache && _qcoCache.length > 0) {
    return _qcoCache;
  }
  const res = await fetch(`${API_BASE}/qco`);
  if (!res.ok) {
    throw new Error("Failed to fetch QCO list");
  }
  const data = await res.json();
  _qcoCache = data;
  return data;
}

export async function fetchQcoForStandard(isNumber: string): Promise<any> {
  const cleanNum = encodeURIComponent(isNumber.trim());
  const res = await fetch(`${API_BASE}/qco/${cleanNum}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch QCO for ${isNumber}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// History Helpers (Browser LocalStorage)
// ─────────────────────────────────────────────────────────────────────────────

const RECOM_HISTORY_KEY = "bis_specai_recommend_history";
const AUDIT_HISTORY_KEY = "bis_specai_audit_history";

export function saveRecommendationToHistory(query: string, result: AnalysisResponse): RecommendationHistoryItem {
  if (typeof window === "undefined") return {} as any;
  try {
    const existing = getRecommendationHistory();
    const primary = result.primary_standard;
    const item: RecommendationHistoryItem = {
      id: "rec_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      query: query.slice(0, 300),
      primary_standard: primary?.is_number || (result.is_multi_requirement ? "Multi-Item Tender" : "No Match"),
      primary_title: primary?.title || (result.is_multi_requirement ? `${result.requirement_groups?.length || 0} Segmented Requirements` : "Low Confidence"),
      domain: primary?.domain || "General",
      confidence: result.confidence || "high",
      is_multi_requirement: result.is_multi_requirement,
      result
    };
    const updated = [item, ...existing.filter(i => i.query !== item.query)].slice(0, 50);
    localStorage.setItem(RECOM_HISTORY_KEY, JSON.stringify(updated));
    return item;
  } catch (e) {
    console.error("Failed to save to history", e);
    return {} as any;
  }
}

export function getRecommendationHistory(): RecommendationHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECOM_HISTORY_KEY);
    if (!raw) return getDefaultRecommendationHistory();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultRecommendationHistory();
  } catch (e) {
    return getDefaultRecommendationHistory();
  }
}

export function saveAuditToHistory(report: TenderAuditReport): AuditHistoryItem {
  if (typeof window === "undefined") return {} as any;
  try {
    const existing = getAuditHistory();
    const id = report.id || "audit_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const item: AuditHistoryItem = {
      id,
      timestamp: report.audit_timestamp || new Date().toISOString(),
      document_name: report.document_name || "Tender_Document.pdf",
      summary: report.summary,
      report: { ...report, id }
    };
    const updated = [item, ...existing.filter(a => a.id !== item.id)].slice(0, 30);
    localStorage.setItem(AUDIT_HISTORY_KEY, JSON.stringify(updated));
    return item;
  } catch (e) {
    console.error("Failed to save audit to history", e);
    return {} as any;
  }
}

export function getAuditHistory(): AuditHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_HISTORY_KEY);
    if (!raw) return getDefaultAuditHistory();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultAuditHistory();
  } catch (e) {
    return getDefaultAuditHistory();
  }
}

export function getAuditById(id: string): TenderAuditReport | null {
  const history = getAuditHistory();
  const match = history.find(item => item.id === id);
  return match ? match.report : null;
}

export function clearAllHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECOM_HISTORY_KEY);
  localStorage.removeItem(AUDIT_HISTORY_KEY);
}

// Default seed history so history / compare pages are immediately populated and interactive
function getDefaultRecommendationHistory(): RecommendationHistoryItem[] {
  return [
    {
      id: "seed_1",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      query: "15 kW three-phase squirrel-cage induction motor for industrial operation, 415 V, 50 Hz.",
      primary_standard: "IS 12615:2018",
      primary_title: "Line Operated Three Phase Induction Motors (IE Codes)",
      domain: "Electrical Engineering",
      confidence: "high",
      result: {} as any
    },
    {
      id: "seed_2",
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      query: "Concrete mix design for high-strength prestressed concrete girder bridge construction M45 grade.",
      primary_standard: "IS 10262:2019",
      primary_title: "Concrete Mix Proportioning - Guidelines (Second Revision)",
      domain: "Civil Engineering",
      confidence: "high",
      result: {} as any
    },
    {
      id: "seed_3",
      timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
      query: "Supply of 3-phase induction motors conforming to IS 325:1996 for municipal water pumps.",
      primary_standard: "IS 12615:2018",
      primary_title: "Line Operated Three Phase Induction Motors (Replaced IS 325)",
      domain: "Electrical Engineering",
      confidence: "high",
      result: {} as any
    }
  ];
}

function getDefaultAuditHistory(): AuditHistoryItem[] {
  return [
    {
      id: "audit_seed_1",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      document_name: "NIT_PWD_Electrical_Wiring_2026.pdf",
      summary: {
        total_standards_cited: 4,
        total_superseded_citations: 1,
        total_outdated_citations: 1,
        total_missing_recommendations: 2,
        total_qco_gaps: 1,
        sections_analysed: 6,
        sections_with_issues: 3,
        has_compliance_issues: true
      },
      report: {
        id: "audit_seed_1",
        document_name: "NIT_PWD_Electrical_Wiring_2026.pdf",
        audit_timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        audit_latency_ms: 64.2,
        summary: {
          total_standards_cited: 4,
          total_superseded_citations: 1,
          total_outdated_citations: 1,
          total_missing_recommendations: 2,
          total_qco_gaps: 1,
          sections_analysed: 6,
          sections_with_issues: 3,
          has_compliance_issues: true
        },
        cited_standards: ["IS 325:1996", "IS 732:1989", "IS 3043:1987", "IS 694:2010"],
        version_alerts: [
          {
            referenced: "IS 325:1996",
            status: "Superseded Standard",
            replacement: "IS 12615:2018",
            recommendation: "Replace IS 325:1996 with IS 12615:2018 (Line Operated Three Phase Induction Motors) as IS 325 has been withdrawn.",
            severity: "error"
          },
          {
            referenced: "IS 732:1989",
            status: "Outdated Edition Reference",
            replacement: "IS 732:2019",
            recommendation: "Update citation to IS 732:2019 (Code of Practice for Electrical Wiring Installations - 4th Revision).",
            severity: "warning"
          }
        ],
        qco_gaps: [
          {
            standard: "IS 12615:2018",
            qco_title: "Electric Motors (Quality Control) Order",
            certification_scheme: "BIS Scheme-I (ISI Mark)",
            issuing_ministry: "Ministry of Heavy Industries",
            enforcement_date: "2024-01-01",
            gap: "Mandatory BIS Scheme-I (ISI Mark) not explicitly required in tender for IS 12615:2018"
          }
        ],
        section_findings: [
          {
            section_id: "sec_1",
            text_preview: "CLAUSE 1.2: All electric motors shall conform to IS 325:1996 for continuous industrial duty 415V.",
            cited_standards: ["IS 325:1996"],
            recommended_standards: ["IS 12615:2018"],
            missing_standards: ["IS 12615:2018"],
            version_alerts: [
              {
                referenced: "IS 325:1996",
                status: "Superseded Standard",
                replacement: "IS 12615:2018",
                severity: "error"
              }
            ],
            has_issues: true
          },
          {
            section_id: "sec_2",
            text_preview: "CLAUSE 2.4: Earthing system shall comply with IS 3043:1987 and electrical wiring with IS 732:1989.",
            cited_standards: ["IS 3043:1987", "IS 732:1989"],
            recommended_standards: ["IS 3043:2018", "IS 732:2019"],
            missing_standards: [],
            version_alerts: [
              {
                referenced: "IS 732:1989",
                status: "Outdated Edition Reference",
                replacement: "IS 732:2019",
                severity: "warning"
              }
            ],
            has_issues: true
          }
        ]
      }
    }
  ];
}
