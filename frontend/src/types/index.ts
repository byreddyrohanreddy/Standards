export interface ScoringBreakdown {
  semantic_score: number;
  lexical_score: number;
  requirement_coverage: number;
  domain_score: number;
  version_score: number;
  final_score: number;
}

export interface LatencyBreakdown {
  nlp_extraction_ms: number;
  retrieval_ms: number;
  reranking_ms: number;
  graph_expansion_ms: number;
  total_ms: number;
}

export interface EvidenceItem {
  criterion: string;
  detail: string;
  match_status: string;
}

export interface ExtractedRequirements {
  product?: string;
  product_type?: string;
  application?: string;
  industry_domain?: string;
  voltage?: string;
  current?: string;
  power?: string;
  frequency?: string;
  phase?: string;
  dimensions?: string;
  materials: string[];
  temperature?: string;
  pressure?: string;
  ip_rating?: string;
  performance_requirements: string[];
  safety_requirements: string[];
  testing_requirements: string[];
  detected_standards: string[];
  ratings: Record<string, string>;
  compliance_needs: string[];
  subtype?: string;
  duty?: string;
  efficiency?: string;
  capacity?: string;
  installation_required?: boolean;
  operating_conditions?: string[];
  category?: string;
  domain?: string;
}

export interface AmendmentInfo {
  number: string;
  year: number;
  description: string;
}

export interface StandardMetadata {
  id: string;
  is_number: string;
  title: string;
  year: number;
  domain: string;
  scope: string;
  status: "current" | "superseded" | "withdrawn" | string;
  superseded_by?: string | null;
  supersedes: string[];
  amendments: AmendmentInfo[];
  normative_references: string[];
  test_methods: string[];
  safety_standards: string[];
  installation_standards: string[];
  related_standards: string[];
  certification: string[];
  technical_parameters: Record<string, any>;
  keywords: string[];
  chunks?: Record<string, string>;
  ai_relevance_score?: number;
  scoring_breakdown?: ScoringBreakdown;
  evidence_items?: EvidenceItem[];
  why_recommended?: string[];
  relationship_to_primary?: string;
  is_in_corpus?: boolean;
  semantic_insight?: string;
}

export interface VersionAlert {
  referenced_standard: string;
  status: string;
  current_replacement?: string;
  title?: string;
  recommendation: string;
  severity: "warning" | "error" | "info";
}

export interface RelatedStandardsCategorized {
  normative_references: StandardMetadata[];
  testing_standards: StandardMetadata[];
  safety_standards: StandardMetadata[];
  installation_standards: StandardMetadata[];
  related_products: StandardMetadata[];
  superseded_standards: StandardMetadata[];
}

export interface GraphNode {
  id: string;
  data: {
    is_number: string;
    title: string;
    year: number;
    domain: string;
    status: string;
    scope: string;
    category: string;
    ai_relevance_score?: number;
    is_primary: boolean;
    certification?: string[];
    amendments_count?: number;
    is_in_corpus?: boolean;
    corpus_note?: string;
  };
  position: { x: number; y: number };
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CertificationScheme {
  scheme: string;
  authority: string;
  description: string;
  mandatory_items: string[];
}

export interface QCOStatus {
  enforcement_date: string;
  enforcement_status: "mandatory" | "upcoming" | "superseded" | string;
  status_label: string;
}

export interface QCOResult {
  qco_id: string;
  product_name: string;
  qco_title: string;
  applicable_is_numbers: string[];
  certification_scheme: string;
  issuing_ministry: string;
  status: QCOStatus;
  verified: boolean;
}

export interface RequirementGroupResult {
  group_id: string;
  requirement_label: string;
  extracted_requirements: ExtractedRequirements;
  primary_standard?: StandardMetadata | null;
  candidate_standards: StandardMetadata[];
  related_standards: RelatedStandardsCategorized;
  version_alerts: VersionAlert[];
  qco_results?: QCOResult[];
  meets_recommendation_threshold?: boolean;
  confidence?: "high" | "medium" | "low" | string;
  threshold_message?: string;
  semantic_vs_keyword_note?: string;
  tender_clause?: string;
}

export interface AnalysisResponse {
  query: string;
  extracted_requirements: ExtractedRequirements;
  primary_standard?: StandardMetadata | null;
  candidate_standards: StandardMetadata[];
  related_standards: RelatedStandardsCategorized;
  version_alerts: VersionAlert[];
  certifications: CertificationScheme[];
  qco_results?: QCOResult[];
  graph_data: GraphData;
  summary_explanation: string;
  latency_breakdown?: LatencyBreakdown;
  dataset_label: string;
  meets_recommendation_threshold?: boolean;
  confidence?: "high" | "medium" | "low" | string;
  threshold_message?: string;
  semantic_vs_keyword_note?: string;
  is_multi_requirement?: boolean;
  is_multilingual?: boolean;
  requirement_groups?: RequirementGroupResult[];
  tender_clause?: string;
  scoring_breakdown?: ScoringBreakdown;
  evidence_items?: EvidenceItem[];
}


export interface ExampleScenario {
  id: string;
  label: string;
  category: string;
  query: string;
  expected_standard: string;
  notes: string;
}

export interface TenderAuditSummary {
  total_standards_cited: number;
  total_superseded_citations: number;
  total_outdated_citations: number;
  total_missing_recommendations: number;
  total_qco_gaps: number;
  sections_analysed: number;
  sections_with_issues: number;
  has_compliance_issues: boolean;
}

export interface TenderAuditVersionAlert {
  referenced: string;
  status: string;
  replacement?: string;
  recommendation: string;
  severity: "warning" | "error" | "info" | string;
}

export interface TenderAuditQCOGap {
  standard: string;
  qco_title: string;
  certification_scheme: string;
  issuing_ministry: string;
  enforcement_date?: string;
  gap: string;
}

export interface TenderAuditSectionFinding {
  section_id: string;
  text_preview: string;
  cited_standards: string[];
  recommended_standards: string[];
  missing_standards: string[];
  version_alerts: {
    referenced: string;
    status: string;
    replacement?: string;
    severity: string;
  }[];
  has_issues: boolean;
}

export interface TenderAuditReport {
  id?: string;
  document_name: string;
  audit_timestamp: string;
  audit_latency_ms: number;
  summary: TenderAuditSummary;
  cited_standards: string[];
  version_alerts: TenderAuditVersionAlert[];
  qco_gaps: TenderAuditQCOGap[];
  section_findings: TenderAuditSectionFinding[];
}

export interface QCOListItem {
  qco_id: string;
  product_name: string;
  applicable_is_numbers: string[];
  certification_scheme: string;
  issuing_ministry: string;
  enforcement_date: string;
  enforcement_status: "mandatory" | "upcoming" | "superseded" | string;
  status_label: string;
}

export interface RecommendationHistoryItem {
  id: string;
  timestamp: string;
  query: string;
  primary_standard?: string;
  primary_title?: string;
  domain?: string;
  confidence?: string;
  is_multi_requirement?: boolean;
  result: AnalysisResponse;
}

export interface AuditHistoryItem {
  id: string;
  timestamp: string;
  document_name: string;
  summary: TenderAuditSummary;
  report: TenderAuditReport;
}

