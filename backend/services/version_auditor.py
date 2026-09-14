import json
import re
from typing import List, Dict, Any, Optional
from backend.models.schemas import VersionAlert

class VersionAuditor:
    def __init__(self, standards_path: str = "data/standards.json"):
        self.standards_path = standards_path
        self.standards_by_number: Dict[str, Dict[str, Any]] = {}
        self.superseded_map: Dict[str, Dict[str, Any]] = {}
        self.load_data()

    def load_data(self):
        with open(self.standards_path, "r", encoding="utf-8") as f:
            standards = json.load(f)
            
        for s in standards:
            self.standards_by_number[s["is_number"]] = s
            # Build superseded index
            if s.get("status") == "superseded" and s.get("superseded_by"):
                self.superseded_map[s["is_number"]] = s
                
            # Also index by base number if superseded
            for sup in s.get("supersedes", []):
                if sup not in self.superseded_map:
                    self.superseded_map[sup] = {
                        "is_number": sup,
                        "status": "superseded",
                        "superseded_by": s["is_number"],
                        "title": f"Older standard superseded by {s['is_number']}"
                    }

    def audit_text_for_versions(self, text: str, detected_standards: List[str]) -> List[VersionAlert]:
        alerts: List[VersionAlert] = []
        seen_refs = set()

        # Check detected standard tokens
        for std_ref in detected_standards:
            std_ref_clean = std_ref.strip()
            if std_ref_clean in seen_refs:
                continue
            seen_refs.add(std_ref_clean)

            # 1. Exact match in superseded map
            if std_ref_clean in self.superseded_map:
                sup_info = self.superseded_map[std_ref_clean]
                rep = sup_info.get("superseded_by", "current edition")
                alerts.append(VersionAlert(
                    referenced_standard=std_ref_clean,
                    status="Superseded Standard",
                    current_replacement=rep,
                    title=sup_info.get("title", ""),
                    recommendation=f"The tender reference {std_ref_clean} has been superseded. Procurement specifications should be updated to {rep} to ensure compliance with current BIS Quality Control Orders.",
                    severity="warning"
                ))
                continue

            # If standard is exactly active and current in catalog, do not flag
            if std_ref_clean in self.standards_by_number:
                active_std = self.standards_by_number[std_ref_clean]
                if active_std.get("status") == "current":
                    continue

            # 2. Check by base number (e.g. user typed "IS 325" without year)
            base_match = re.search(r"IS\s*(\d+)", std_ref_clean, re.IGNORECASE)
            if base_match:
                base_num = base_match.group(1)
                
                # Check if there is an active current standard with this exact base number
                current_matching = None
                for c_num, c_data in self.standards_by_number.items():
                    if c_data.get("status") == "current" and re.search(rf"\bIS\s*{base_num}\b", c_num, re.IGNORECASE):
                        current_matching = c_num
                        break

                # Check if this base number was genuinely superseded
                for sup_key, sup_val in self.superseded_map.items():
                    if re.search(rf"\bIS\s*{base_num}\b", sup_key, re.IGNORECASE):
                        rep = sup_val.get("superseded_by", "current edition")
                        # Only flag if rep is different from current_matching or if current_matching has a different base
                        if current_matching and current_matching == rep and not re.search(r":\d{4}", std_ref_clean):
                            # User just wrote the un-versioned active standard name (e.g. "IS 12615")
                            continue
                            
                        alerts.append(VersionAlert(
                            referenced_standard=std_ref_clean,
                            status="Superseded Standard Reference",
                            current_replacement=rep,
                            title=sup_val.get("title", ""),
                            recommendation=f"The standard {std_ref_clean} is an older standard that has been superseded by {rep}. It is recommended to update the tender specification to avoid non-compliant bids.",
                            severity="warning"
                        ))
                        break

            # 3. Check for older revision year mentions (e.g., IS 456:1978 or IS 1180:1989)
            year_match = re.search(r":(\d{4})", std_ref_clean)
            if year_match:
                ref_year = int(year_match.group(1))
                # Match against base standard
                for curr_num, curr_data in self.standards_by_number.items():
                    if curr_data.get("status") == "current" and curr_data.get("year", 0) > ref_year:
                        curr_base = re.sub(r":\d{4}", "", curr_num)
                        ref_base = re.sub(r":\d{4}", "", std_ref_clean)
                        if curr_base.lower() == ref_base.lower():
                            alerts.append(VersionAlert(
                                referenced_standard=std_ref_clean,
                                status="Outdated Edition Reference",
                                current_replacement=curr_num,
                                title=curr_data.get("title", ""),
                                recommendation=f"Specification cites {std_ref_clean}, but current active edition is {curr_num}. Update requirement to reflect the latest testing tolerances and safety amendments.",
                                severity="warning"
                            ))
                            break

        return alerts
