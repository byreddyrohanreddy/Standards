"""
QCO Engine — Deterministic Quality Control Order lookup service.

Sources: Publicly verified BIS/Ministry of Heavy Industries/DPIIT/Ministry of Steel
gazette notifications. All entries in qco_database.json are traceable to specific
Gazette of India Extraordinary notifications (S.O. numbers cited).

This is a deterministic lookup — not LLM-inferred. Certification mandates have real
legal consequences; no data is fabricated or assumed.
"""

import json
import os
from datetime import date, datetime
from typing import List, Dict, Any, Optional
from backend.models.schemas import QCOStatus, QCOResult


class QCOEngine:
    """
    Date-aware Quality Control Order lookup engine.

    For each recommended IS standard, determines:
    - Whether a mandatory QCO applies
    - Current enforcement status (mandatory / upcoming / superseded)
    - Issuing ministry and certification scheme type
    """

    def __init__(self, qco_path: str = "data/qco_database.json"):
        self.qco_path = qco_path
        self.qco_records: List[Dict[str, Any]] = []
        # Index: IS number -> list of matching QCO records
        self._by_is_number: Dict[str, List[Dict[str, Any]]] = {}
        self._load()

    def _load(self):
        with open(self.qco_path, "r", encoding="utf-8") as f:
            self.qco_records = json.load(f)

        for record in self.qco_records:
            for is_num in record.get("applicable_is_numbers", []):
                key = is_num.strip().upper()
                if key not in self._by_is_number:
                    self._by_is_number[key] = []
                self._by_is_number[key].append(record)

    def _parse_date(self, date_str: str) -> date:
        """Parse ISO date string YYYY-MM-DD to date object."""
        return datetime.strptime(date_str, "%Y-%m-%d").date()

    def _compute_status(self, record: Dict[str, Any], reference_date: Optional[date] = None) -> QCOStatus:
        """
        Computes date-aware enforcement status for a QCO record.

        Classification:
          - 'mandatory'  : enforcement_date <= reference_date (QCO is currently in force)
          - 'upcoming'   : enforcement_date > reference_date (not yet in force)
          - 'superseded' : explicitly marked superseded in database

        reference_date defaults to today (date.today()).
        """
        today = reference_date or date.today()

        if record.get("superseded_by"):
            return QCOStatus(
                enforcement_status="superseded",
                enforcement_date=record.get("enforcement_date"),
                gazette_notification=record.get("gazette_notification"),
                status_label="⚠ Superseded QCO",
                status_detail=f"This QCO has been superseded by {record['superseded_by']}."
            )

        enforcement_date_str = record.get("enforcement_date", "")
        if not enforcement_date_str:
            return QCOStatus(
                enforcement_status="unknown",
                enforcement_date=None,
                gazette_notification=record.get("gazette_notification"),
                status_label="Enforcement date unknown",
                status_detail="Enforcement date not recorded. Verify with issuing ministry."
            )

        enf_date = self._parse_date(enforcement_date_str)

        if enf_date <= today:
            days_since = (today - enf_date).days
            return QCOStatus(
                enforcement_status="mandatory",
                enforcement_date=enforcement_date_str,
                gazette_notification=record.get("gazette_notification"),
                status_label="🔴 Mandatory (Currently Enforced)",
                status_detail=(
                    f"This QCO has been in force since {enforcement_date_str} "
                    f"({days_since} days). Procurement without valid BIS certification "
                    f"is non-compliant and subject to legal action."
                )
            )
        else:
            days_until = (enf_date - today).days
            return QCOStatus(
                enforcement_status="upcoming",
                enforcement_date=enforcement_date_str,
                gazette_notification=record.get("gazette_notification"),
                status_label="🟡 Upcoming (Not Yet In Force)",
                status_detail=(
                    f"This QCO takes effect on {enforcement_date_str} "
                    f"({days_until} days from today). Procurement processes initiated "
                    f"now should factor in certification requirements."
                )
            )

    def lookup(
        self,
        is_number: str,
        reference_date: Optional[date] = None
    ) -> List[QCOResult]:
        """
        Looks up all applicable QCOs for a given IS standard number.

        Performs both exact-match and base-number match (strips year suffix).
        Returns an empty list if no QCO applies — absence of a result means
        no mandatory QCO found for this standard in the database.

        Args:
            is_number: e.g. "IS 12615:2018" or "IS 694:2010"
            reference_date: date to evaluate status against; defaults to today

        Returns:
            List of QCOResult objects (empty if no QCO applies)
        """
        today = reference_date or date.today()
        results: List[QCOResult] = []
        seen_ids: set = set()

        # Try exact match first
        candidates = self._by_is_number.get(is_number.strip().upper(), [])

        # Also try stripping the year for base match (e.g. "IS 12615")
        base_num = is_number.strip().upper().split(":")[0].strip()
        for key, recs in self._by_is_number.items():
            if key.startswith(base_num) and key != is_number.strip().upper():
                for r in recs:
                    if r["qco_id"] not in seen_ids:
                        candidates = candidates + [r]

        for record in candidates:
            qco_id = record["qco_id"]
            if qco_id in seen_ids:
                continue
            seen_ids.add(qco_id)

            status = self._compute_status(record, today)

            results.append(QCOResult(
                qco_id=qco_id,
                qco_title=record.get("qco_title", ""),
                product_name=record.get("product_name", ""),
                applicable_is_numbers=record.get("applicable_is_numbers", []),
                certification_scheme=record.get("certification_scheme", ""),
                issuing_ministry=record.get("issuing_ministry", ""),
                gazette_notification=record.get("gazette_notification", ""),
                gazette_date=record.get("gazette_date", ""),
                scope_note=record.get("scope_note", ""),
                source_url=record.get("source_url", ""),
                status=status,
                verified=record.get("verified", False),
                notes=record.get("notes", "")
            ))

        return results

    def lookup_by_domain(self, domain: str, reference_date: Optional[date] = None) -> List[QCOResult]:
        """
        Returns all QCOs relevant to a given procurement domain (e.g. 'Electrical', 'Civil').
        Useful for surfacing all mandatory certifications in a domain during a multi-requirement audit.
        """
        domain_keywords = {
            "Electrical": ["motor", "transformer", "cable", "wire", "switchgear", "circuit breaker", "meter", "led"],
            "Civil": ["cement", "steel", "tmt", "rebar", "pipe", "hdpe"],
            "Safety/PPE": ["helmet", "footwear", "safety"],
            "Solar/Renewable": ["solar", "photovoltaic"],
            "Safety/Fire": ["extinguisher", "fire"],
        }
        keywords = domain_keywords.get(domain, [])
        if not keywords:
            return []

        results: List[QCOResult] = []
        seen_ids: set = set()

        for record in self.qco_records:
            product_lower = record.get("product_name", "").lower()
            if any(kw in product_lower for kw in keywords):
                qco_id = record["qco_id"]
                if qco_id in seen_ids:
                    continue
                seen_ids.add(qco_id)
                status = self._compute_status(record, reference_date)
                results.append(QCOResult(
                    qco_id=qco_id,
                    qco_title=record.get("qco_title", ""),
                    product_name=record.get("product_name", ""),
                    applicable_is_numbers=record.get("applicable_is_numbers", []),
                    certification_scheme=record.get("certification_scheme", ""),
                    issuing_ministry=record.get("issuing_ministry", ""),
                    gazette_notification=record.get("gazette_notification", ""),
                    gazette_date=record.get("gazette_date", ""),
                    scope_note=record.get("scope_note", ""),
                    source_url=record.get("source_url", ""),
                    status=status,
                    verified=record.get("verified", False),
                    notes=record.get("notes", "")
                ))

        return results
