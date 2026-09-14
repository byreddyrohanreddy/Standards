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
                        "title": f"Standard superseded by {s['is_number']}"
                    }

    def _extract_is_patterns(self, text: str) -> List[str]:
        """Extracts standard citations like 'IS 325:1996', 'IS:325', 'IS 12615', 'IS-456:2000' from text."""
        raw_matches = re.findall(r"\bIS\s*[:\-]?\s*(\d+)(?:\s*[:\-]\s*(\d{4}))?\b", text, re.IGNORECASE)
        results = []
        for base, year in raw_matches:
            if year:
                results.append(f"IS {base}:{year}")
            else:
                results.append(f"IS {base}")
        return results

    def audit_text_for_versions(self, text: str, detected_standards: List[str]) -> List[VersionAlert]:
        alerts: List[VersionAlert] = []
        seen_refs = set()

        # Combine detected standards with any regex-extracted citations in raw text
        candidates = list(detected_standards) + self._extract_is_patterns(text)

        for std_ref in candidates:
            # Normalize whitespace: "IS  325 : 1996" -> "IS 325:1996"
            norm_ref = re.sub(r"\s+", " ", std_ref).strip()
            norm_ref = re.sub(r"IS\s*[:\-]?\s*", "IS ", norm_ref, flags=re.IGNORECASE)
            norm_ref = re.sub(r"\s*:\s*", ":", norm_ref)
            
            if norm_ref in seen_refs:
                continue
            seen_refs.add(norm_ref)

            # 1. Exact match in superseded map (e.g. "IS 325:1996" or "IS 8112:1989")
            matched_sup = None
            for sup_key, sup_val in self.superseded_map.items():
                if sup_key.lower() == norm_ref.lower():
                    matched_sup = sup_val
                    break

            if matched_sup:
                rep = matched_sup.get("superseded_by", "current edition")
                alerts.append(VersionAlert(
                    referenced_standard=norm_ref,
                    status="Superseded Standard",
                    current_replacement=rep,
                    title=matched_sup.get("title", ""),
                    recommendation=f"The tender reference {norm_ref} has been officially superseded. Procurement specifications must be updated to {rep} to align with current BIS Quality Control Orders (QCO) and avoid rejected bids.",
                    severity="warning"
                ))
                continue

            # If standard is exactly active and current in catalog, check if user provided older year
            exact_active = None
            for c_num, c_data in self.standards_by_number.items():
                if c_num.lower() == norm_ref.lower():
                    exact_active = c_data
                    break

            if exact_active and exact_active.get("status") == "current":
                # Current standard confirmed valid
                continue

            # 2. Check by base number (e.g. user typed "IS 325" or "IS 8112" without year)
            base_match = re.search(r"\bIS\s*(\d+)", norm_ref, re.IGNORECASE)
            if base_match:
                base_num = base_match.group(1)
                
                # Check if there is an active current standard with this exact base number
                current_matching = None
                for c_num, c_data in self.standards_by_number.items():
                    if c_data.get("status") == "current" and re.search(rf"\bIS\s*{base_num}\b", c_num, re.IGNORECASE):
                        current_matching = c_num
                        break

                # Check if this base number was superseded
                superseded_entry = None
                for sup_key, sup_val in self.superseded_map.items():
                    if re.search(rf"\bIS\s*{base_num}\b", sup_key, re.IGNORECASE):
                        superseded_entry = sup_val
                        break

                if superseded_entry:
                    rep = superseded_entry.get("superseded_by", "current edition")
                    # If current matching has the same number (i.e. not superseded by different number) and no year was specified:
                    if current_matching and current_matching == rep and ":" not in norm_ref:
                        continue
                    alerts.append(VersionAlert(
                        referenced_standard=norm_ref,
                        status="Superseded Standard",
                        current_replacement=rep,
                        title=superseded_entry.get("title", ""),
                        recommendation=f"The standard {norm_ref} is an older standard series superseded by {rep}. Specifications should cite {rep} for active conformity assessment.",
                        severity="warning"
                    ))
                    continue

            # 3. Check for older revision year mentions (e.g., IS 456:1978 vs IS 456:2000, or IS 1180:1989 vs IS 1180:2014)
            year_match = re.search(r":(\d{4})", norm_ref)
            if year_match:
                ref_year = int(year_match.group(1))
                for curr_num, curr_data in self.standards_by_number.items():
                    if curr_data.get("status") == "current" and curr_data.get("year", 0) > ref_year:
                        curr_base = re.sub(r":\d{4}", "", curr_num).strip().lower()
                        ref_base = re.sub(r":\d{4}", "", norm_ref).strip().lower()
                        if curr_base == ref_base:
                            alerts.append(VersionAlert(
                                referenced_standard=norm_ref,
                                status="Outdated Edition Reference",
                                current_replacement=curr_num,
                                title=curr_data.get("title", ""),
                                recommendation=f"Specification cites {norm_ref}, but the current active edition is {curr_num} (reaffirmed with latest amendments). Update requirement to reflect modern tolerances and safety testing.",
                                severity="warning"
                            ))
                            break

        return alerts

