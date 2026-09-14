import re
from typing import Dict, Any, List
from backend.models.schemas import ExtractedRequirements

def extract_standards_mentions(text: str) -> List[str]:
    """Finds all occurrences of Indian Standards (e.g., IS 325:1996, IS 12615, IS/IEC 60034-1)."""
    pattern = r"\b(?:IS(?:/IEC)?\s+\d+(?:\s*\([^\)]+\))?(?::\d{4})?)\b"
    matches = re.findall(pattern, text, re.IGNORECASE)
    # Standardize casing and formatting
    cleaned = []
    for m in matches:
        clean = re.sub(r"\s+", " ", m).strip()
        # Ensure uppercase 'IS'
        if clean.lower().startswith("is"):
            clean = "IS" + clean[2:]
        if clean not in cleaned:
            cleaned.append(clean)
    return cleaned

def extract_requirements(text: str) -> ExtractedRequirements:
    """
    Dynamically extracts product entities, technical ratings, materials,
    domain, and compliance attributes from input query or tender document.
    """
    text_lower = text.lower()
    ratings: Dict[str, str] = {}
    materials: List[str] = []
    compliance_needs: List[str] = []
    
    # 1. Electrical Ratings
    # Power
    power_match = re.search(r"(\d+(?:\.\d+)?)\s*(kw|hp|kva|mva|w|wp)\b", text_lower)
    if power_match:
        ratings["Power / Capacity"] = f"{power_match.group(1)} {power_match.group(2).upper()}"

    # Voltage
    volt_match = re.search(r"(\d+(?:\.\d+)?)\s*(v|kv|volts?)\b", text_lower)
    if volt_match:
        ratings["Voltage"] = f"{volt_match.group(1)} {volt_match.group(2).upper()}"

    # Frequency
    freq_match = re.search(r"(\d+(?:\.\d+)?)\s*(hz|cycles)\b", text_lower)
    if freq_match:
        ratings["Frequency"] = f"{freq_match.group(1)} Hz"

    # Phase
    if "three phase" in text_lower or "3 phase" in text_lower or "3-phase" in text_lower or "three-phase" in text_lower:
        ratings["Phase"] = "Three-Phase (3-Phase)"
    elif "single phase" in text_lower or "1 phase" in text_lower or "single-phase" in text_lower:
        ratings["Phase"] = "Single-Phase (1-Phase)"

    # IP Protection
    ip_match = re.search(r"\b(ip\s*\d{2})\b", text_lower)
    if ip_match:
        ratings["Ingress Protection"] = ip_match.group(1).replace(" ", "").upper()
    elif "ip protection" in text_lower or "enclosure protection" in text_lower:
        ratings["Ingress Protection"] = "IP Protection Required"

    # Current
    current_match = re.search(r"(\d+(?:\.\d+)?)\s*(a|amp|amps|amperes?)\b", text_lower)
    if current_match and not power_match:
        ratings["Current Rating"] = f"{current_match.group(1)} A"

    # Breaking Capacity
    ka_match = re.search(r"(\d+(?:\.\d+)?)\s*ka\b", text_lower)
    if ka_match:
        ratings["Breaking Capacity"] = f"{ka_match.group(1)} kA"

    # 2. Civil / Material Ratings
    # Concrete Grades
    concrete_grade = re.search(r"\b(m-?\d{2})\b", text_lower)
    if concrete_grade:
        ratings["Concrete Grade"] = concrete_grade.group(1).upper()

    # Rebar Grades
    steel_grade = re.search(r"\b(fe\s*\d{3}[a-z]?)\b", text_lower)
    if steel_grade:
        ratings["Steel Grade"] = steel_grade.group(1).replace(" ", "").upper()

    # Cement Grades
    cement_grade = re.search(r"\b(33|43|53)\s*grade\b", text_lower)
    if cement_grade:
        ratings["Cement Grade"] = f"{cement_grade.group(1)} Grade"

    # Pipe Pressure
    pn_match = re.search(r"\b(pn\s*\d+(?:\.\d+)?)\b", text_lower)
    if pn_match:
        ratings["Pressure Rating"] = pn_match.group(1).upper().replace(" ", "")

    # Pipe / Rebar Diameters
    dia_match = re.search(r"(\d+)\s*mm\b", text_lower)
    if dia_match:
        ratings["Dimension / Diameter"] = f"{dia_match.group(1)} mm"

    # 3. Materials
    material_keywords = [
        "copper", "aluminium", "aluminum", "pvc", "xlpe", "hdpe", "mild steel", "galvanized",
        "tmt", "pozzolana", "fly ash", "silica fume", "crushed stone", "cast iron", "silicon"
    ]
    for mat in material_keywords:
        if mat in text_lower:
            materials.append(mat.capitalize())

    # 4. Compliance & Performance Requirements
    if any(w in text_lower for w in ["efficiency", "energy efficient", "ie2", "ie3", "ie4", "bee"]):
        compliance_needs.append("Energy Efficiency / BEE Star Rating")
    if any(w in text_lower for w in ["fire retardant", "frls", "frlsh", "flame"]):
        compliance_needs.append("Flame Retardant / FRLS")
    if any(w in text_lower for w in ["shock absorption", "electrical insulation", "impact resistance", "1000 v", "penetration"]):
        compliance_needs.append("High Impact & Electrical Insulation Protection")
    if any(w in text_lower for w in ["seismic", "earthquake", "ductile"]):
        compliance_needs.append("Ductile Detailing / Earthquake Resistance")
    if any(w in text_lower for w in ["compressive strength", "cube test", "tensile strength"]):
        compliance_needs.append("Mechanical Strength Testing")
    if any(w in text_lower for w in ["potable", "drinking water", "water supply"]):
        compliance_needs.append("Potable Water Safety Suitability")
    if any(w in text_lower for w in ["damp heat", "uv", "hail impact"]):
        compliance_needs.append("Environmental & Weathering Qualification")

    # 5. Product Classification & Category
    product = "Technical Requirement"
    category = "General Engineering"
    domain = "Procurement"

    if any(w in text_lower for w in ["induction motor", "squirrel cage motor", "electric motor", "three phase motor"]):
        product = "Three-Phase AC Induction Motor"
        category = "Rotating Electrical Machines"
        domain = "Electrical"
    elif any(w in text_lower for w in ["transformer", "distribution transformer", "power transformer"]):
        product = "Electrical Transformer"
        category = "Power Distribution Equipment"
        domain = "Electrical"
    elif any(w in text_lower for w in ["cable", "wire", "conductor", "wiring"]):
        product = "Electric Cable / Building Wire"
        category = "Cables and Conductors"
        domain = "Electrical"
    elif any(w in text_lower for w in ["circuit breaker", "mccb", "mcb", "rccb", "switchgear"]):
        product = "Low Voltage Circuit Breaker / Switchgear"
        category = "Switchgear and Protection"
        domain = "Electrical"
    elif any(w in text_lower for w in ["cement", "pozzolana", "opc", "ppc"]):
        product = "Hydraulic Cement"
        category = "Cement and Building Binders"
        domain = "Civil"
    elif any(w in text_lower for w in ["concrete", "rcc", "aggregate", "slump"]):
        product = "Concrete / Structural Elements"
        category = "Concrete and Structural Works"
        domain = "Civil"
    elif any(w in text_lower for w in ["tmt", "rebar", "deformed steel", "reinforcement steel"]):
        product = "High Strength Steel Reinforcement Rebar"
        category = "Reinforcing Steel"
        domain = "Civil"
    elif any(w in text_lower for w in ["structural steel", "steel plate", "beam", "joist", "angle"]):
        product = "Hot Rolled Structural Steel"
        category = "Structural Steelwork"
        domain = "Civil"
    elif any(w in text_lower for w in ["hdpe pipe", "gi pipe", "ms pipe", "steel tubes", "pipes"]):
        product = "Pressure Pipes & Tubes"
        category = "Piping Systems"
        domain = "Mechanical"
    elif any(w in text_lower for w in ["submersible pump", "water pump", "borewell pump", "openwell"]):
        product = "Submersible / Monoset Pumpset"
        category = "Pumping Machinery"
        domain = "Mechanical"
    elif any(w in text_lower for w in ["helmet", "hard hat", "head protection"]):
        product = "Industrial Safety Helmet (PPE)"
        category = "Personal Protective Equipment"
        domain = "Safety/PPE"
    elif any(w in text_lower for w in ["footwear", "safety shoes", "safety boots", "steel toe"]):
        product = "Industrial Safety Footwear (PPE)"
        category = "Personal Protective Equipment"
        domain = "Safety/PPE"
    elif any(w in text_lower for w in ["solar", "photovoltaic", "pv module"]):
        product = "Crystalline Silicon Solar PV Module"
        category = "Solar Photovoltaic Systems"
        domain = "Solar/Renewable"
    elif any(w in text_lower for w in ["led lamp", "led bulb", "luminaire", "street light"]):
        product = "LED Luminaire / Self-Ballasted Lamp"
        category = "Illumination and Lighting"
        domain = "Consumer/Lighting"
    elif any(w in text_lower for w in ["smart meter", "energy meter", "watt-hour meter", "watt hour"]):
        product = "Static Watt-Hour Energy / Smart Meter"
        category = "Metering and Instrumentation"
        domain = "Electrical"
    elif any(w in text_lower for w in ["fire extinguisher", "extinguisher"]):
        product = "Portable Fire Extinguisher"
        category = "Fire Fighting and Life Safety"
        domain = "Safety/Fire"
    elif any(w in text_lower for w in ["earthing", "grounding"]):
        product = "Electrical Earthing System"
        category = "Earthing & Substation Safety"
        domain = "Electrical"

    # 6. Application Context
    app_context = "General Procurement"
    if "industrial" in text_lower or "factory" in text_lower or "manufacturing" in text_lower:
        app_context = "Industrial / Heavy Duty Operation"
    elif "marine" in text_lower or "jetty" in text_lower or "coastal" in text_lower:
        app_context = "Marine / Aggressive Chemical Exposure"
    elif "construction" in text_lower or "building" in text_lower or "civil" in text_lower:
        app_context = "Building Construction & Infrastructure"
    elif "agricultural" in text_lower or "irrigation" in text_lower or "borewell" in text_lower:
        app_context = "Agricultural & Irrigation Pumping"
    elif "residential" in text_lower or "domestic" in text_lower or "household" in text_lower:
        app_context = "Residential / Commercial Installation"
    elif "mining" in text_lower:
        app_context = "Mining & Hazardous Work Environment"

    # Mentioned Standards
    detected_stds = extract_standards_mentions(text)

    return ExtractedRequirements(
        product=product,
        category=category,
        domain=domain,
        ratings=ratings,
        materials=materials,
        compliance_needs=compliance_needs,
        application=app_context,
        detected_standards=detected_stds
    )
