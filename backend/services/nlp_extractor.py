import re
from typing import Dict, Any, List, Optional
from backend.models.schemas import ExtractedRequirements

def extract_standards_mentions(text: str) -> List[str]:
    """Finds all occurrences of Indian Standards (e.g., IS 325:1996, IS 12615, IS/IEC 60034-1)."""
    pattern = r"\b(?:IS(?:/IEC)?\s+\d+(?:\s*\([^\)]+\))?(?::\d{4})?)\b"
    matches = re.findall(pattern, text, re.IGNORECASE)
    cleaned = []
    for m in matches:
        clean = re.sub(r"\s+", " ", m).strip()
        if clean.lower().startswith("is"):
            clean = "IS" + clean[2:]
        if clean not in cleaned:
            cleaned.append(clean)
    return cleaned

def extract_requirements(text: str) -> ExtractedRequirements:
    """
    Dynamically parses natural language requirements or tender text to extract
    structured parameters across 16 technical dimensions.
    """
    text_lower = text.lower()
    ratings: Dict[str, str] = {}
    materials: List[str] = []
    perf_reqs: List[str] = []
    safety_reqs: List[str] = []
    test_reqs: List[str] = []

    # 1. Electrical & Mechanical Ratings
    # Power / Capacity
    power_val: Optional[str] = None
    power_match = re.search(r"(\d+(?:\.\d+)?)\s*(kw|hp|kva|mva|w|wp)\b", text_lower)
    if power_match:
        power_val = f"{power_match.group(1)} {power_match.group(2).upper()}"
        ratings["Power / Capacity"] = power_val

    # Voltage
    voltage_val: Optional[str] = None
    volt_match = re.search(r"(\d+(?:\.\d+)?)\s*(v|kv|volts?)\b", text_lower)
    if volt_match:
        voltage_val = f"{volt_match.group(1)} {volt_match.group(2).upper()}"
        ratings["Voltage"] = voltage_val

    # Current
    current_val: Optional[str] = None
    curr_match = re.search(r"(\d+(?:\.\d+)?)\s*(a|amp|amps|amperes?)\b", text_lower)
    if curr_match and not power_match:
        current_val = f"{curr_match.group(1)} A"
        ratings["Current"] = current_val

    # Frequency
    frequency_val: Optional[str] = None
    freq_match = re.search(r"(\d+(?:\.\d+)?)\s*(hz|cycles)\b", text_lower)
    if freq_match:
        frequency_val = f"{freq_match.group(1)} Hz"
        ratings["Frequency"] = frequency_val

    # Phase
    phase_val: Optional[str] = None
    if any(p in text_lower for p in ["three phase", "3 phase", "3-phase", "three-phase"]):
        phase_val = "Three-Phase"
        ratings["Phase"] = "Three-Phase (3-Phase)"
    elif any(p in text_lower for p in ["single phase", "1 phase", "1-phase", "single-phase"]):
        phase_val = "Single-Phase"
        ratings["Phase"] = "Single-Phase (1-Phase)"

    # Ingress Protection (IP Code)
    ip_val: Optional[str] = None
    ip_match = re.search(r"\b(ip\s*\d{2})\b", text_lower)
    if ip_match:
        ip_val = ip_match.group(1).replace(" ", "").upper()
        ratings["Ingress Protection"] = ip_val
    elif "ip protection" in text_lower or "enclosure protection" in text_lower:
        ip_val = "IP Enclosure Protection"
        ratings["Ingress Protection"] = "IP Protection Required"

    # Dimensions / Diameters / Thickness
    dim_val: Optional[str] = None
    dim_match = re.search(r"(\d+(?:\.\d+)?)\s*(mm|cm|inch|inches|meter|m)\b", text_lower)
    if dim_match:
        dim_val = f"{dim_match.group(1)} {dim_match.group(2)}"
        ratings["Dimensions"] = dim_val

    # Pressure / Hydraulic Rating
    pressure_val: Optional[str] = None
    pn_match = re.search(r"\b(pn\s*\d+(?:\.\d+)?|(\d+)\s*(?:bar|kg/cm2|mpa))\b", text_lower)
    if pn_match:
        pressure_val = pn_match.group(1).upper()
        ratings["Pressure"] = pressure_val
    elif re.search(r"\b(\d+)\s*ka\b", text_lower):
        ka_m = re.search(r"\b(\d+)\s*ka\b", text_lower)
        pressure_val = f"{ka_m.group(1)} kA Breaking Capacity"
        ratings["Breaking Capacity"] = pressure_val

    # Temperature Limits
    temp_val: Optional[str] = None
    temp_match = re.search(r"(\d+)\s*(?:deg\s*c|°c|celsius|k\s*rise)\b", text_lower)
    if temp_match:
        temp_val = temp_match.group(0).strip()
        ratings["Temperature"] = temp_val

    # Concrete / Material Grades
    concrete_match = re.search(r"\b(m-?\d{2})\b", text_lower)
    if concrete_match:
        ratings["Concrete Grade"] = concrete_match.group(1).upper()

    steel_match = re.search(r"\b(fe\s*\d{3}[a-z]?)\b", text_lower)
    if steel_match:
        ratings["Steel Grade"] = steel_match.group(1).replace(" ", "").upper()

    cement_match = re.search(r"\b(33|43|53)\s*grade\b", text_lower)
    if cement_match:
        ratings["Cement Grade"] = f"{cement_match.group(1)} Grade"

    # 2. Materials
    materials_catalog = [
        "copper", "aluminium", "aluminum", "pvc", "xlpe", "hdpe", "mild steel", "galvanized",
        "tmt", "pozzolana", "fly ash", "silica fume", "crushed stone", "cast iron", "silicon",
        "stainless steel", "polyethylene", "brass", "rubber"
    ]
    for mat in materials_catalog:
        if mat in text_lower:
            materials.append(mat.capitalize())

    # 3. Performance Requirements
    if any(w in text_lower for w in ["efficiency", "energy efficient", "ie2", "ie3", "ie4", "bee star"]):
        perf_reqs.append("Energy Efficiency (IE Code / BEE Star)")
    if any(w in text_lower for w in ["accuracy", "class 1", "class 2", "class 0.5"]):
        perf_reqs.append("Precision Accuracy Class")
    if any(w in text_lower for w in ["luminous flux", "efficacy", "lumens/watt", "cri"]):
        perf_reqs.append("Luminous Efficacy & Photometric Quality")
    if any(w in text_lower for w in ["ductility", "ductile detailing", "elongation", "earthquake", "seismic"]):
        perf_reqs.append("High Ductility & Seismic Resistance")
    if any(w in text_lower for w in ["continuous duty", "s1 duty", "heavy duty"]):
        perf_reqs.append("Continuous Heavy-Duty Rating (S1)")

    # 4. Safety Requirements
    if any(w in text_lower for w in ["shock absorption", "electrical insulation", "1000 v", "penetration"]):
        safety_reqs.append("Shock Absorption & High-Voltage Dielectric Insulation")
    if any(w in text_lower for w in ["fire retardant", "frls", "frlsh", "flame resistance", "fire extinguisher"]):
        safety_reqs.append("Fire Resistance & Low Smoke Halogen-Free (FRLS)")
    if any(w in text_lower for w in ["electric shock", "earth leakage", "rccb", "elcb", "30 ma"]):
        safety_reqs.append("Human Electric Shock Protection (<30 mA)")
    if any(w in text_lower for w in ["fall arrest", "safety harness", "height safety"]):
        safety_reqs.append("Personal Fall Arrest & Dynamic Drop Safety")
    if any(w in text_lower for w in ["potable", "drinking water", "water supply"]):
        safety_reqs.append("Potable Drinking Water Non-Toxicity")

    # 5. Testing Requirements
    if any(w in text_lower for w in ["loss determination", "efficiency test", "dynamometer"]):
        test_reqs.append("Efficiency & Losses Test (IS 15999)")
    if any(w in text_lower for w in ["cube test", "compressive strength", "flexural strength"]):
        test_reqs.append("Compressive / Mechanical Strength Test (IS 516 / IS 4031)")
    if any(w in text_lower for w in ["hydrostatic", "pressure test"]):
        test_reqs.append("Hydrostatic Pressure Withstand Testing")
    if any(w in text_lower for w in ["damp heat", "thermal cycling", "uv preconditioning", "hail impact"]):
        test_reqs.append("Environmental Damp Heat & Weathering Qualification")
    if any(w in text_lower for w in ["dielectric withstand", "spark test", "insulation resistance"]):
        test_reqs.append("High Voltage Dielectric & Spark Testing")

    # 6. Product Classification & Sector Domain
    product = "Procurement Item"
    product_type = "Standard Equipment"
    industry_domain = "General Procurement"
    application = "General Industrial / Civil Application"

    # Multi-domain mapping
    if any(w in text_lower for w in ["induction motor", "electric motor", "squirrel cage motor", "squirrel cage", "squirrel-cage", "rotating machine", "prime mover"]):
        product = "Three-Phase AC Induction Motor"
        product_type = "Line-Operated Squirrel Cage AC Motor"
        industry_domain = "Electrical"
        application = "Industrial Machinery & Continuous Duty Drives"
    elif any(w in text_lower for w in ["transformer", "distribution transformer", "power transformer"]):
        product = "Oil Immersed Electrical Transformer"
        product_type = "Outdoor Distribution / Power Transformer"
        industry_domain = "Electrical"
        application = "Substation Electrical Power Distribution"
    elif any(w in text_lower for w in ["control panel", "mcc panel", "switchboard", "switchgear assembly", "distribution board", "motor control center"]):
        product = "Low-Voltage Switchgear & Control Panel Assembly"
        product_type = "Factory Built Low Voltage Assembly (IS/IEC 61439)"
        industry_domain = "Electrical"
        application = "Industrial Power Control & Motor Starter Distribution"
    elif any(w in text_lower for w in ["cable", "wire", "conductor", "wiring", "frls"]):
        product = "Insulated Electric Cable / Building Wire"
        product_type = "PVC / XLPE Insulated Power & Control Conductor"
        industry_domain = "Electrical"
        application = "Internal Building Wiring & Underground Power Feeder"
    elif any(w in text_lower for w in ["mccb", "mcb", "rccb", "circuit breaker", "switchgear"]):
        product = "Low Voltage Circuit Breaker / Switchgear"
        product_type = "Moulded Case / Residual Current Circuit Breaker"
        industry_domain = "Electrical"
        application = "Power Distribution Board & Personnel Shock Protection"
    elif any(w in text_lower for w in ["smart meter", "energy meter", "watt-hour meter", "watt hour"]):
        product = "Static Watt-Hour Smart Energy Meter"
        product_type = "Direct Connected Bi-Directional AMI Smart Meter"
        industry_domain = "Electrical"
        application = "Utility Grid Metering & Automated Metering Infrastructure"
    elif any(w in text_lower for w in ["earthing", "grounding", "earth electrode", "earth pit"]):
        product = "Electrical Earthing System"
        product_type = "Pipe / Plate Earth Electrode & Grounding Pit"
        industry_domain = "Electrical"
        application = "Substation & Facility Electrical Fault Grounding"
    elif any(w in text_lower for w in ["cement", "pozzolana", "opc", "ppc"]):
        product = "Hydraulic Structural Cement"
        product_type = "Portland Pozzolana / Ordinary Portland Cement"
        industry_domain = "Civil"
        application = "Reinforced Concrete Foundation & Structural Civil Works"
    elif any(w in text_lower for w in ["concrete", "rcc", "aggregate", "slump", "mix design"]):
        product = "Plain and Reinforced Concrete"
        product_type = "Design Mix Concrete with Coarse & Fine Aggregates"
        industry_domain = "Civil"
        application = "Structural Building Frames, Beams, Slabs & Columns"
    elif any(w in text_lower for w in ["tmt", "rebar", "deformed steel", "reinforcement bar"]):
        product = "High Strength Deformed Steel Reinforcement Bar"
        product_type = "Thermo-Mechanically Treated (TMT) Steel Rebar"
        industry_domain = "Civil"
        application = "Earthquake Resistant Concrete Reinforcement"
    elif any(w in text_lower for w in ["structural steel", "steel plate", "beam", "joist", "steel section"]):
        product = "Hot Rolled Structural Steel"
        product_type = "Medium and High Tensile Structural Steel Sections"
        industry_domain = "Civil"
        application = "Steel Trusses, Pre-Engineered Buildings & Bridges"
    elif any(w in text_lower for w in ["hdpe pipe", "gi pipe", "ms pipe", "steel tubes", "pipe"]):
        product = "Pressure Supply Piping"
        product_type = "High Density Polyethylene / Galvanized Mild Steel Pipe"
        industry_domain = "Mechanical"
        application = "Potable Drinking Water Mains & Plumbing Conveyance"
    elif any(w in text_lower for w in ["submersible pump", "water pump", "borewell pump", "openwell"]):
        product = "Submersible Water Pumpset"
        product_type = "Borewell / Openwell Multistage Electric Pumpset"
        industry_domain = "Mechanical"
        application = "Agricultural Irrigation & Deep Well Water Extraction"
    elif any(w in text_lower for w in ["helmet", "hard hat", "head protection"]):
        product = "Industrial Safety Helmet (PPE)"
        product_type = "High Impact Shock Absorbing Hard Hat"
        industry_domain = "Safety/PPE"
        application = "Construction Site & Industrial Head Protection"
    elif any(w in text_lower for w in ["safety shoes", "safety footwear", "safety boots", "steel toe"]):
        product = "Personal Protective Safety Footwear"
        product_type = "200J Impact Resistant Steel Toe Safety Shoes"
        industry_domain = "Safety/PPE"
        application = "Factory Floor & Industrial Foot Protection"
    elif any(w in text_lower for w in ["respirator", "half mask", "dust mask", "ffp2"]):
        product = "Respiratory Protective Half Mask"
        product_type = "Particle Filtering Half Mask Respirator"
        industry_domain = "Safety/PPE"
        application = "Particulate, Aerosol & Hazardous Dust Protection"
    elif any(w in text_lower for w in ["safety harness", "safety belt", "fall arrest"]):
        product = "Personal Fall Arrest Safety Harness"
        product_type = "Full Body Industrial Fall Arrest Harness"
        industry_domain = "Safety/PPE"
        application = "Working at Height & Transmission Tower Maintenance"
    elif any(w in text_lower for w in ["fire extinguisher", "extinguisher", "abc powder"]):
        product = "Portable Fire Extinguisher"
        product_type = "ABC Dry Chemical Powder / CO2 Portable Extinguisher"
        industry_domain = "Safety/Fire"
        application = "First-Aid Fire Fighting in Buildings & Factories"
    elif any(w in text_lower for w in ["solar", "photovoltaic", "pv module"]):
        product = "Crystalline Silicon Terrestrial PV Module"
        product_type = "Mono/Polycrystalline Silicon Photovoltaic Panel"
        industry_domain = "Solar/Renewable"
        application = "Utility Grid-Connected Solar Power Plants"
    elif any(w in text_lower for w in ["led lamp", "led bulb", "luminaire", "street light"]):
        product = "Self-Ballasted LED Lamp / Luminaire"
        product_type = "Energy Efficient LED Fixture & Road Luminaire"
        industry_domain = "Consumer/Lighting"
        application = "Residential, Commercial & Street Illumination"

    # Duty / Usage pattern
    duty_val: Optional[str] = None
    if any(w in text_lower for w in ["continuous duty", "s1 duty", "continuous operation", "continuous running"]):
        duty_val = "Continuous Duty (S1)"
        ratings["Duty Cycle"] = duty_val
    elif any(w in text_lower for w in ["intermittent", "s2 duty", "s3 duty"]):
        duty_val = "Intermittent Duty"
        ratings["Duty Cycle"] = duty_val

    # Efficiency Class / Energy Star
    eff_val: Optional[str] = None
    if "ie4" in text_lower or "super premium efficiency" in text_lower:
        eff_val = "IE4 Super Premium Efficiency"
        ratings["Efficiency Class"] = eff_val
    elif "ie3" in text_lower or "premium efficiency" in text_lower:
        eff_val = "IE3 Premium Efficiency"
        ratings["Efficiency Class"] = eff_val
    elif "ie2" in text_lower or "high efficiency" in text_lower:
        eff_val = "IE2 High Efficiency"
        ratings["Efficiency Class"] = eff_val
    elif "5 star" in text_lower or "5-star" in text_lower:
        eff_val = "BEE 5-Star Energy Rating"
        ratings["Energy Label"] = eff_val
    elif "3 star" in text_lower or "3-star" in text_lower:
        eff_val = "BEE 3-Star Energy Rating"
        ratings["Energy Label"] = eff_val

    # Subtype detection
    subtype_val: Optional[str] = None
    if "squirrel cage" in text_lower or "squirrel-cage" in text_lower:
        subtype_val = "Squirrel Cage Rotor"
    elif "slip ring" in text_lower or "wound rotor" in text_lower:
        subtype_val = "Slip Ring Wound Rotor"
    elif "split case" in text_lower:
        subtype_val = "Horizontal Split-Case"
    elif "monoset" in text_lower:
        subtype_val = "Monoset Centrifugal"
    elif "submersible" in text_lower:
        subtype_val = "Multi-Stage Submersible Borehole"
    elif "tmt" in text_lower or "thermo mechanical" in text_lower:
        subtype_val = "Thermo-Mechanically Treated (TMT)"
    elif "ppc" in text_lower or "pozzolana" in text_lower:
        subtype_val = "Portland Pozzolana Cement (Fly Ash / Calcined Clay)"
    elif "opc" in text_lower:
        subtype_val = "Ordinary Portland Cement (OPC)"
    elif "k9" in text_lower:
        subtype_val = "Class K9 Heavy Duty Pressure"
    elif "di pipe" in text_lower or "ductile iron" in text_lower:
        subtype_val = "Ductile Iron Spun"

    # Installation requirement
    installation_req = any(w in text_lower for w in ["installation", "supply and installation", "erection", "laying", "commissioning", "jointing"])

    # Operating conditions
    op_conditions: List[str] = []
    if "continuous" in text_lower or "heavy duty" in text_lower:
        op_conditions.append("Continuous Heavy-Duty Operation")
    if any(w in text_lower for w in ["outdoor", "substation", "open yard"]):
        op_conditions.append("Outdoor Substation Environment")
    if any(w in text_lower for w in ["marine", "jetty", "coastal", "saline"]):
        op_conditions.append("Marine / Aggressive Coastal Atmosphere")
    if any(w in text_lower for w in ["underground", "buried", "soil"]):
        op_conditions.append("Underground Direct Burial")
    if any(w in text_lower for w in ["high rise", "multi-story", "building"]):
        op_conditions.append("High-Rise Building Infrastructure")

    # Context override from text clues
    if "marine" in text_lower or "jetty" in text_lower or "coastal" in text_lower:
        application = "Marine & High Chemical Exposure Infrastructure"
    elif "agricultural" in text_lower or "irrigation" in text_lower or "canal" in text_lower:
        application = "Agricultural Pumping & Irrigation Schemes"
    elif "mining" in text_lower:
        application = "Underground Mining & Heavy Industrial Extraction"

    detected_stds = extract_standards_mentions(text)

    # Consolidated compliance needs list
    compliance_needs = list(set(perf_reqs + safety_reqs + test_reqs))

    return ExtractedRequirements(
        product=product,
        product_type=product_type,
        subtype=subtype_val,
        application=application,
        industry_domain=industry_domain,
        voltage=voltage_val,
        current=current_val,
        power=power_val,
        frequency=frequency_val,
        phase=phase_val,
        dimensions=dim_val,
        materials=materials,
        temperature=temp_val,
        pressure=pressure_val,
        ip_rating=ip_val,
        capacity=power_val or dim_val or pressure_val,
        duty=duty_val,
        efficiency=eff_val,
        installation_required=installation_req,
        operating_conditions=op_conditions,
        performance_requirements=perf_reqs,
        safety_requirements=safety_reqs,
        testing_requirements=test_reqs,
        detected_standards=detected_stds,
        ratings=ratings,
        compliance_needs=compliance_needs
    )

def normalize_query_for_semantic_search(req: ExtractedRequirements, raw_query: str) -> str:
    """
    Synthesizes a rich, normalized semantic query anchored on the raw query
    and enriched with extracted product taxonomy, operating parameters, and standards vocabulary.
    """
    enrichments: List[str] = []
    if req.product and req.product != "Procurement Item":
        enrichments.append(req.product)
    if req.product_type and req.product_type != "Standard Equipment":
        enrichments.append(req.product_type)
    if req.subtype:
        enrichments.append(req.subtype)
    if req.application and "General" not in req.application:
        enrichments.append(req.application)
    if req.industry_domain and "General" not in req.industry_domain:
        enrichments.append(f"{req.industry_domain} Sector")
    if req.power:
        enrichments.append(f"Rating {req.power}")
    if req.voltage:
        enrichments.append(f"Voltage {req.voltage}")
    if req.phase:
        enrichments.append(req.phase)
    if req.frequency:
        enrichments.append(req.frequency)
    if req.ip_rating:
        enrichments.append(req.ip_rating)
    if req.duty:
        enrichments.append(req.duty)
    if req.efficiency:
        enrichments.append(req.efficiency)
    if req.pressure:
        enrichments.append(f"Pressure {req.pressure}")
    if req.dimensions:
        enrichments.append(f"Dimension {req.dimensions}")
    if req.materials:
        enrichments.append(f"Material {', '.join(req.materials)}")
    
    enrichments.extend(req.compliance_needs[:3])
    enrichments.extend(req.operating_conditions[:2])
    
    # Filter out enrichments already present in raw query (case-insensitive)
    query_lower = raw_query.lower()
    novel_enrichments = [e for e in enrichments if e.lower() not in query_lower]
    
    if novel_enrichments:
        return f"{raw_query.strip()} {' '.join(novel_enrichments)}"
    return raw_query.strip()

def segment_multi_requirements(text: str) -> List[Dict[str, Any]]:
    """
    Detects and segments compound procurement queries or multi-product tenders
    into distinct requirement groups.
    Example: 'Procure three-phase induction motors, low-voltage control panels with 415V busbars, and industrial safety helmets for factory workers.'
    """
    # 1. Check for numbered lists or explicit line-delimited clauses (e.g. Item 1:, 1., 2.)
    numbered_splits = re.split(r"(?:\r?\n\s*(?:Item\s*\d+[:.]|\d+[\.\)]\s+|[-*•]\s+))", text.strip(), flags=re.IGNORECASE)
    if len(numbered_splits) > 1 and any(len(s.strip()) > 10 for s in numbered_splits[1:]):
        groups = []
        for idx, chunk in enumerate(numbered_splits):
            chunk_clean = chunk.strip()
            if len(chunk_clean) < 8:
                continue
            req = extract_requirements(chunk_clean)
            label = req.product if req.product != "Procurement Item" else f"Requirement Item #{idx + 1}"
            groups.append({
                "group_id": f"req_{idx + 1}",
                "label": label,
                "text": chunk_clean,
                "requirements": req
            })
        if len(groups) > 1:
            return groups

    # 2. Check for conjunction splits across distinct product classes (e.g. 'motors, control panels, and safety helmets')
    clauses = re.split(r",\s*(?:and\s+)?|\band\s+", text.strip(), flags=re.IGNORECASE)
    if len(clauses) > 1:
        extracted_groups = []
        seen_products = set()
        for clause in clauses:
            c_text = clause.strip()
            # remove leading procurement verbs
            c_text_cleaned = re.sub(r"^(?:procure|supply of|purchase of|requirement for)\s+", "", c_text, flags=re.IGNORECASE).strip()
            if len(c_text_cleaned) < 6:
                continue
            r = extract_requirements(c_text_cleaned)
            # Only count as distinct group if a recognized product was extracted
            if r.product != "Procurement Item":
                prod_key = (r.product, r.industry_domain)
                if prod_key not in seen_products:
                    seen_products.add(prod_key)
                    extracted_groups.append({
                        "group_id": f"req_{len(extracted_groups) + 1}",
                        "label": r.product,
                        "text": c_text,
                        "requirements": r
                    })
        if len(extracted_groups) >= 2:
            return extracted_groups

    # Single requirement default
    single_req = extract_requirements(text)
    label = single_req.product if single_req.product != "Procurement Item" else "Primary Requirement"
    return [{
        "group_id": "req_1",
        "label": label,
        "text": text,
        "requirements": single_req
    }]

