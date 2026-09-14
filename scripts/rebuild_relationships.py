import json

with open("data/standards.json", "r", encoding="utf-8") as f:
    standards = json.load(f)

relationships = []
for std in standards:
    src_id = std["id"]
    src_num = std["is_number"]
    
    for sup in std.get("supersedes", []):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": sup,
            "relationship_type": "supersedes",
            "description": f"{src_num} supersedes older standard {sup}"
        })
        
    if std.get("superseded_by"):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": std["superseded_by"],
            "relationship_type": "superseded_by",
            "description": f"{src_num} has been superseded by current standard {std['superseded_by']}"
        })
        
    for norm in std.get("normative_references", []):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": norm,
            "relationship_type": "normative_reference",
            "description": f"Normative reference required for specification compliance: {norm}"
        })
        
    for test in std.get("test_methods", []):
        if test != src_num:
            relationships.append({
                "source_id": src_id,
                "source_number": src_num,
                "target_number": test,
                "relationship_type": "test_method",
                "description": f"Mandatory compliance testing method standard: {test}"
            })
            
    for safe in std.get("safety_standards", []):
        if safe != src_num:
            relationships.append({
                "source_id": src_id,
                "source_number": src_num,
                "target_number": safe,
                "relationship_type": "safety",
                "description": f"Safety and electrical/mechanical hazard standard: {safe}"
            })
            
    for inst in std.get("installation_standards", []):
        if inst != src_num:
            relationships.append({
                "source_id": src_id,
                "source_number": src_num,
                "target_number": inst,
                "relationship_type": "installation",
                "description": f"Erection, installation and commissioning standard: {inst}"
            })

with open("data/relationships.json", "w", encoding="utf-8") as f:
    json.dump(relationships, f, indent=2)

print(f"Rebuilt relationships: {len(relationships)} edges across {len(standards)} standards.")
