from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class RequirementAnalysisRequest(BaseModel):
    query: str = Field(..., description="Natural language specification or tender text")
    top_k: int = Field(5, description="Number of candidate standards to return")

class ExtractedRequirements(BaseModel):
    product: Optional[str] = None
    category: Optional[str] = None
    domain: Optional[str] = None
    ratings: Dict[str, str] = Field(default_factory=dict)
    materials: List[str] = Field(default_factory=list)
    compliance_needs: List[str] = Field(default_factory=list)
    application: Optional[str] = None
    detected_standards: List[str] = Field(default_factory=list)

class AmendmentInfo(BaseModel):
    number: str
    year: int
    description: str

class StandardMetadata(BaseModel):
    id: str
    is_number: str
    title: str
    year: int
    domain: str
    scope: str
    status: str
    superseded_by: Optional[str] = None
    supersedes: List[str] = Field(default_factory=list)
    amendments: List[AmendmentInfo] = Field(default_factory=list)
    normative_references: List[str] = Field(default_factory=list)
    test_methods: List[str] = Field(default_factory=list)
    safety_standards: List[str] = Field(default_factory=list)
    installation_standards: List[str] = Field(default_factory=list)
    related_standards: List[str] = Field(default_factory=list)
    certification: List[str] = Field(default_factory=list)
    technical_parameters: Dict[str, Any] = Field(default_factory=dict)
    keywords: List[str] = Field(default_factory=list)
    ai_relevance_score: Optional[float] = None
    why_recommended: List[str] = Field(default_factory=list)
    relationship_to_primary: Optional[str] = None

class VersionAlert(BaseModel):
    referenced_standard: str
    status: str
    current_replacement: Optional[str] = None
    title: Optional[str] = None
    recommendation: str
    severity: str = "warning"

class RelatedStandardsCategorized(BaseModel):
    normative_references: List[StandardMetadata] = Field(default_factory=list)
    testing_standards: List[StandardMetadata] = Field(default_factory=list)
    safety_standards: List[StandardMetadata] = Field(default_factory=list)
    installation_standards: List[StandardMetadata] = Field(default_factory=list)
    related_products: List[StandardMetadata] = Field(default_factory=list)
    superseded_standards: List[StandardMetadata] = Field(default_factory=list)

class GraphNode(BaseModel):
    id: str
    data: Dict[str, Any]
    position: Dict[str, float]
    type: Optional[str] = "custom"

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: Optional[bool] = False
    style: Optional[Dict[str, Any]] = None

class GraphData(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    edges: List[GraphEdge] = Field(default_factory=list)

class AnalysisResponse(BaseModel):
    query: str
    extracted_requirements: ExtractedRequirements
    primary_standard: Optional[StandardMetadata] = None
    candidate_standards: List[StandardMetadata] = Field(default_factory=list)
    related_standards: RelatedStandardsCategorized
    version_alerts: List[VersionAlert] = Field(default_factory=list)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    graph_data: GraphData
    summary_explanation: str
    dataset_label: str = "Curated Prototype Dataset (SIH-2026 MVP Demonstration)"
