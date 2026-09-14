import json
from typing import Dict, Any, List, Optional
from backend.models.schemas import (
    StandardMetadata,
    RelatedStandardsCategorized,
    GraphData,
    GraphNode,
    GraphEdge,
    AmendmentInfo
)

class StandardsGraphService:
    def __init__(self, standards_path: str = "data/standards.json", relationships_path: str = "data/relationships.json"):
        self.standards_path = standards_path
        self.relationships_path = relationships_path
        self.standards_by_number: Dict[str, Dict[str, Any]] = {}
        self.standards_by_id: Dict[str, Dict[str, Any]] = {}
        self.relationships: List[Dict[str, Any]] = []
        
        self.load_data()

    def load_data(self):
        with open(self.standards_path, "r", encoding="utf-8") as f:
            standards = json.load(f)
            for s in standards:
                self.standards_by_number[s["is_number"]] = s
                self.standards_by_id[s["id"]] = s
                
        with open(self.relationships_path, "r", encoding="utf-8") as f:
            self.relationships = json.load(f)

    def _convert_to_metadata(self, std_dict: Dict[str, Any], rel_label: str = "") -> StandardMetadata:
        amendments = [
            AmendmentInfo(number=a.get("number", ""), year=a.get("year", 0), description=a.get("description", ""))
            for a in std_dict.get("amendments", [])
        ]
        return StandardMetadata(
            id=std_dict["id"],
            is_number=std_dict["is_number"],
            title=std_dict["title"],
            year=std_dict["year"],
            domain=std_dict["domain"],
            scope=std_dict["scope"],
            status=std_dict["status"],
            superseded_by=std_dict.get("superseded_by"),
            supersedes=std_dict.get("supersedes", []),
            amendments=amendments,
            normative_references=std_dict.get("normative_references", []),
            test_methods=std_dict.get("test_methods", []),
            safety_standards=std_dict.get("safety_standards", []),
            installation_standards=std_dict.get("installation_standards", []),
            related_standards=std_dict.get("related_standards", []),
            certification=std_dict.get("certification", []),
            technical_parameters=std_dict.get("technical_parameters", []),
            keywords=std_dict.get("keywords", []),
            relationship_to_primary=rel_label
        )

    def _create_placeholder_metadata(self, is_num: str, rel_label: str) -> StandardMetadata:
        """Fallback for referenced standard not in primary catalog."""
        safe_id = is_num.replace(" ", "_").replace(":", "_").replace("/", "_").replace("(", "").replace(")", "")
        return StandardMetadata(
            id=safe_id,
            is_number=is_num,
            title=f"Indian Standard Reference: {is_num}",
            year=2020,
            domain="General",
            scope=f"Referenced complementary standard {is_num} cited under {rel_label} requirements.",
            status="current",
            relationship_to_primary=rel_label
        )

    def get_related_standards(self, primary_std: StandardMetadata) -> RelatedStandardsCategorized:
        """Traverses relationships for the given primary standard and returns categorized lists."""
        normative: List[StandardMetadata] = []
        testing: List[StandardMetadata] = []
        safety: List[StandardMetadata] = []
        installation: List[StandardMetadata] = []
        related: List[StandardMetadata] = []
        superseded: List[StandardMetadata] = []

        seen_numbers = {primary_std.is_number}

        # 1. Normative References
        for num in primary_std.normative_references:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Normative Reference") if item else self._create_placeholder_metadata(num, "Normative Reference")
                normative.append(meta)

        # 2. Testing Standards
        for num in primary_std.test_methods:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Testing Standard") if item else self._create_placeholder_metadata(num, "Testing Standard")
                testing.append(meta)

        # 3. Safety Standards
        for num in primary_std.safety_standards:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Safety Standard") if item else self._create_placeholder_metadata(num, "Safety Standard")
                safety.append(meta)

        # 4. Installation Standards
        for num in primary_std.installation_standards:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Installation Standard") if item else self._create_placeholder_metadata(num, "Installation Standard")
                installation.append(meta)

        # 5. Related Standards
        for num in primary_std.related_standards:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Related Standard") if item else self._create_placeholder_metadata(num, "Related Standard")
                related.append(meta)

        # 6. Superseded Standards
        for num in primary_std.supersedes:
            if num not in seen_numbers:
                seen_numbers.add(num)
                item = self.standards_by_number.get(num)
                meta = self._convert_to_metadata(item, "Superseded Standard") if item else self._create_placeholder_metadata(num, "Superseded Standard")
                superseded.append(meta)

        if primary_std.superseded_by and primary_std.superseded_by not in seen_numbers:
            num = primary_std.superseded_by
            seen_numbers.add(num)
            item = self.standards_by_number.get(num)
            meta = self._convert_to_metadata(item, "Superseding Modern Standard") if item else self._create_placeholder_metadata(num, "Superseding Modern Standard")
            superseded.append(meta)

        # Helper to sort categorized items: items in catalog first, current before superseded, then by year descending
        def sort_meta_list(meta_list: List[StandardMetadata]) -> List[StandardMetadata]:
            return sorted(
                meta_list,
                key=lambda m: (
                    0 if m.id in self.standards_by_id else 1,
                    0 if m.status == "current" else 1,
                    -m.year
                )
            )

        return RelatedStandardsCategorized(
            normative_references=sort_meta_list(normative),
            testing_standards=sort_meta_list(testing),
            safety_standards=sort_meta_list(safety),
            installation_standards=sort_meta_list(installation),
            related_products=sort_meta_list(related),
            superseded_standards=sort_meta_list(superseded)
        )

    def get_relationships_for_standard_id(self, standard_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves metadata and relationship graph for a specific standard ID or IS number."""
        std = self.standards_by_id.get(standard_id)
        if not std:
            # Check by number or slug
            norm_target = standard_id.lower().replace("_", " ").replace("-", " ")
            for k, s in self.standards_by_number.items():
                if s["id"].lower() == standard_id.lower() or k.lower() == standard_id.lower() or k.lower().replace(":", " ") == norm_target:
                    std = s
                    break
        if not std:
            return None
        
        meta = self._convert_to_metadata(std)
        categorized = self.get_related_standards(meta)
        graph = self.build_react_flow_graph(meta, categorized)
        return {
            "standard": meta,
            "relationships": categorized,
            "graph": graph
        }


    def build_react_flow_graph(self, primary_std: StandardMetadata, related: RelatedStandardsCategorized) -> GraphData:
        """
        Creates visually balanced hierarchical node coordinates and directed styled edges
        for React Flow rendering.
        """
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []

        center_x = 400.0
        center_y = 60.0

        # Root Primary Node
        nodes.append(GraphNode(
            id=primary_std.id,
            data={
                "is_number": primary_std.is_number,
                "title": primary_std.title,
                "year": primary_std.year,
                "domain": primary_std.domain,
                "status": primary_std.status,
                "scope": primary_std.scope,
                "category": "Primary Standard",
                "ai_relevance_score": primary_std.ai_relevance_score,
                "is_primary": True,
                "certification": primary_std.certification,
                "amendments_count": len(primary_std.amendments)
            },
            position={"x": center_x, "y": center_y}
        ))

        # Helper to layout branch nodes
        def place_nodes(items: List[StandardMetadata], start_x: float, y: float, category: str, edge_color: str, is_dashed: bool = False):
            spacing_x = 260.0
            total_width = (len(items) - 1) * spacing_x
            curr_x = start_x - (total_width / 2.0)
            
            for idx, item in enumerate(items):
                node_id = f"node_{item.id}_{idx}"
                nodes.append(GraphNode(
                    id=node_id,
                    data={
                        "is_number": item.is_number,
                        "title": item.title,
                        "year": item.year,
                        "domain": item.domain,
                        "status": item.status,
                        "scope": item.scope,
                        "category": category,
                        "is_primary": False,
                        "certification": item.certification,
                        "amendments_count": len(item.amendments)
                    },
                    position={"x": curr_x, "y": y}
                ))
                
                # Directed edge from primary to related
                edges.append(GraphEdge(
                    id=f"edge_{primary_std.id}_{node_id}",
                    source=primary_std.id,
                    target=node_id,
                    label=category,
                    animated=True if category in ["Testing Standard", "Safety Standard"] else False,
                    style={
                        "stroke": edge_color,
                        "strokeWidth": 2,
                        "strokeDasharray": "5,5" if is_dashed else "none"
                    }
                ))
                curr_x += spacing_x

        # Tier 1 (y = 240): Normative (Left) & Safety (Right)
        if related.normative_references:
            place_nodes(related.normative_references, start_x=160.0, y=240.0, category="Normative Reference", edge_color="#3b82f6")

        if related.safety_standards:
            place_nodes(related.safety_standards, start_x=680.0, y=240.0, category="Safety Standard", edge_color="#dc2626")

        # Tier 2 (y = 420): Testing (Left-Center) & Installation (Right-Center)
        if related.testing_standards:
            place_nodes(related.testing_standards, start_x=250.0, y=420.0, category="Testing Standard", edge_color="#10b981")

        if related.installation_standards:
            place_nodes(related.installation_standards, start_x=600.0, y=420.0, category="Installation Standard", edge_color="#f59e0b")

        # Tier 3 (y = 600): Related Products & Superseded Standards
        if related.related_products:
            place_nodes(related.related_products, start_x=300.0, y=600.0, category="Related Product", edge_color="#6366f1")

        if related.superseded_standards:
            place_nodes(related.superseded_standards, start_x=580.0, y=600.0, category="Superseded Standard", edge_color="#ef4444", is_dashed=True)

        return GraphData(nodes=nodes, edges=edges)
