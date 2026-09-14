export interface ExtractedRequirements {
  product?: string;
  category?: string;
  domain?: string;
  ratings: Record<string, string>;
  materials: string[];
  compliance_needs: string[];
  application?: string;
  detected_standards: string[];
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
  ai_relevance_score?: number;
  why_recommended?: string[];
  relationship_to_primary?: string;
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

export interface AnalysisResponse {
  query: string;
  extracted_requirements: ExtractedRequirements;
  primary_standard?: StandardMetadata | null;
  candidate_standards: StandardMetadata[];
  related_standards: RelatedStandardsCategorized;
  version_alerts: VersionAlert[];
  certifications: CertificationScheme[];
  graph_data: GraphData;
  summary_explanation: string;
  dataset_label: string;
}

export interface ExampleScenario {
  id: string;
  label: string;
  category: string;
  query: string;
  expected_standard: string;
  notes: string;
}
