import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer

# Load existing 62 standards as the base foundation
with open("data/standards.json", "r", encoding="utf-8") as f:
    existing_standards = json.load(f)

print(f"Loaded {len(existing_standards)} existing standards.")

# Function to generate structured chunks for any standard
def create_structured_chunks(std):
    params_str = ", ".join(f"{k}: {v}" for k, v in std.get("technical_parameters", {}).items())
    apps_str = ", ".join(std.get("technical_parameters", {}).get("application", [])) if isinstance(std.get("technical_parameters", {}).get("application"), list) else str(std.get("technical_parameters", {}).get("application", ""))
    norm_refs = ", ".join(std.get("normative_references", []))
    test_refs = ", ".join(std.get("test_methods", []))
    safety_refs = ", ".join(std.get("safety_standards", []))
    cert_str = ", ".join(std.get("certification", []))
    
    return {
        "scope": f"Standard {std['is_number']} covers {std['title']}. Scope: {std['scope']}",
        "key_requirements": f"Key compliance requirements for {std['is_number']}: Certification under {cert_str}. Status: {std['status']}. Keywords: {', '.join(std.get('keywords', []))}.",
        "technical_parameters": f"Technical specifications and parameters for {std['is_number']}: {params_str}.",
        "applications": f"Intended applications and operational environments for {std['is_number']}: {apps_str}. Industrial domain: {std.get('domain', '')}.",
        "testing_methods": f"Testing methods, compliance verification, and inspection procedures for {std['is_number']}: {test_refs}.",
        "safety_criteria": f"Safety criteria, protection requirements, and personal hazard mitigations for {std['is_number']}: {safety_refs}." if safety_refs else f"Safety criteria and environmental considerations under {std['is_number']}.",
        "normative_references": f"Normative references and cited standards for {std['is_number']}: {norm_refs}." if norm_refs else f"Referenced harmonized codes for {std['is_number']}."
    }

# Ensure all existing standards have structured chunks
for s in existing_standards:
    if "chunks" not in s:
        s["chunks"] = create_structured_chunks(s)

# Define 51 NEW authentic Indian Standards with full metadata and structured chunks
new_standards = [
    # --- ELECTRICAL: SWITCHGEAR ASSEMBLIES & PANELS ---
    {
        "id": "IS_IEC_61439_1_2011",
        "is_number": "IS/IEC 61439-1:2011",
        "title": "Low-Voltage Switchgear and Controlgear Assemblies - Part 1: General Rules",
        "year": 2011,
        "domain": "Electrical",
        "scope": "Applies to low-voltage switchgear and controlgear assemblies (enclosed or open, stationary or movable) intended for use in connection with the generation, transmission, distribution and conversion of electric energy up to 1000 V AC or 1500 V DC.",
        "status": "current",
        "supersedes": ["IS 8623 (Part 1):1993"],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 2017, "description": "Clarifications on design verification by testing and temperature rise limits."}
        ],
        "normative_references": ["IS/IEC 60947-1:2007", "IS/IEC 60947-2:2016", "IS/IEC 60529:2001"],
        "test_methods": ["IS/IEC 61439-1:2011 Clause 10 (Design Verification, Temperature Rise, Short-circuit withstand)"],
        "safety_standards": ["IS/IEC 60529:2001 (Degrees of Protection IP Code)", "IS 3043:2018 (Earthing)"],
        "installation_standards": ["IS 10118 (Part 2):1982"],
        "related_standards": ["IS/IEC 61439-2:2011", "IS 8623 (Part 1):1993"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Low Voltage Switchgear QCO"],
        "technical_parameters": {
            "equipment_type": "low-voltage switchgear assembly",
            "rated_voltage": "up to 1000 V AC / 1500 V DC",
            "frequency": "50 Hz",
            "ip_rating": ["IP31", "IP42", "IP54", "IP65"],
            "short_circuit_withstand": "up to 65 kA for 1s",
            "forms_of_separation": ["Form 1", "Form 2b", "Form 3b", "Form 4b"],
            "application": ["control panel", "motor control center", "power control center", "distribution board", "industrial substation"]
        },
        "keywords": ["switchgear assembly", "control panel", "mcc", "pcc", "distribution board", "switchboard", "415v", "low voltage", "busbar"]
    },
    {
        "id": "IS_IEC_61439_2_2011",
        "is_number": "IS/IEC 61439-2:2011",
        "title": "Low-Voltage Switchgear and Controlgear Assemblies - Part 2: Power Switchgear and Controlgear Assemblies",
        "year": 2011,
        "domain": "Electrical",
        "scope": "Specific requirements for power switchgear and controlgear assemblies (PSC-assemblies) intended for industrial and commercial facilities, motor control centers (MCC), power control centers (PCC) and main distribution boards.",
        "status": "current",
        "supersedes": ["IS 8623 (Part 2):1993"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 61439-1:2011", "IS/IEC 60947-2:2016", "IS/IEC 60947-4-1:2012"],
        "test_methods": ["IS/IEC 61439-1:2011 Clause 10"],
        "safety_standards": ["IS/IEC 60529:2001", "IS 3043:2018"],
        "installation_standards": ["IS 10118:1982"],
        "related_standards": ["IS/IEC 61439-1:2011", "IS/IEC 60947-2:2016"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "equipment_type": "power switchgear and controlgear assembly",
            "rated_current": "up to 4000 A",
            "rated_voltage": "415 V AC",
            "frequency": "50 Hz",
            "forms_of_internal_separation": ["Form 3b", "Form 4a", "Form 4b"],
            "application": ["motor control center", "mcc panel", "industrial power control", "feeder pillar"]
        },
        "keywords": ["mcc panel", "motor control center", "power control center", "pcc panel", "switchboard", "starter panel", "distribution panel"]
    },
    {
        "id": "IS_IEC_60947_1_2007",
        "is_number": "IS/IEC 60947-1:2007",
        "title": "Low-Voltage Switchgear and Controlgear - Part 1: General Rules",
        "year": 2007,
        "domain": "Electrical",
        "scope": "Applies to low-voltage switchgear and controlgear intended to be connected to circuits of rated voltage up to 1000 V AC or 1500 V DC. Covers definitions, operating characteristics, dielectric properties, and temperature rise.",
        "status": "current",
        "supersedes": ["IS 13947 (Part 1):1993"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 60068", "IS/IEC 60529:2001"],
        "test_methods": ["IS/IEC 60947-1:2007 Clause 8 (Type Tests and Routine Tests)"],
        "safety_standards": ["IS/IEC 60529:2001"],
        "installation_standards": ["IS 10118:1982"],
        "related_standards": ["IS/IEC 60947-2:2016", "IS/IEC 60947-3:2012"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "voltage": "up to 1000 V AC",
            "frequency": "50 Hz",
            "application": ["industrial switchgear", "control circuits", "power distribution"]
        },
        "keywords": ["switchgear", "controlgear", "low voltage", "dielectric test", "insulation"]
    },
    {
        "id": "IS_IEC_60947_3_2012",
        "is_number": "IS/IEC 60947-3:2012",
        "title": "Low-Voltage Switchgear and Controlgear - Part 3: Switches, Disconnectors, Switch-Disconnectors and Fuse-Combination Units",
        "year": 2012,
        "domain": "Electrical",
        "scope": "Applies to switches, disconnectors, switch-disconnectors and fuse-combination units to be used in distribution and motor circuits of rated voltage up to 1000 V AC or 1500 V DC.",
        "status": "current",
        "supersedes": ["IS 13947 (Part 3):1993"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 60947-1:2007"],
        "test_methods": ["Making and breaking capacity tests, operational performance tests"],
        "safety_standards": ["IS/IEC 60529:2001"],
        "installation_standards": ["IS 10118:1982"],
        "related_standards": ["IS/IEC 60947-2:2016"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "equipment_type": "switch disconnector / fuse switch",
            "rated_voltage": "415 V AC",
            "rated_current": "16 A to 1250 A",
            "utilization_category": ["AC-21A", "AC-22A", "AC-23A"],
            "application": ["isolator", "main switch", "fuse switch unit", "panel incoming switch"]
        },
        "keywords": ["switch disconnector", "isolator", "fuse combination unit", "sdfu", "main switch", "415v isolator"]
    },
    {
        "id": "IS_IEC_62305_1_2010",
        "is_number": "IS/IEC 62305-1:2010",
        "title": "Protection Against Lightning - Part 1: General Principles",
        "year": 2010,
        "domain": "Electrical",
        "scope": "Provides general principles to be followed for protection of structures against lightning, including their installations and contents, as well as persons.",
        "status": "current",
        "supersedes": ["IS 2309:1989"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 3043:2018"],
        "test_methods": ["Lightning risk assessment methodology"],
        "safety_standards": ["IS 3043:2018 (Earthing Code)"],
        "installation_standards": ["IS/IEC 62305-3:2010"],
        "related_standards": ["IS 3043:2018", "IS 2309:1989"],
        "certification": ["Advisory and building code requirement under National Building Code (NBC 2016)"],
        "technical_parameters": {
            "protection_levels": ["LPL I", "LPL II", "LPL III", "LPL IV"],
            "lightning_current_peak": "up to 200 kA (10/350 us wave)",
            "application": ["building lightning protection", "substation protection", "industrial plants", "telecom towers"]
        },
        "keywords": ["lightning protection", "lightning conductor", "surge protection", "air termination", "down conductor", "earthing"]
    },
    {
        "id": "IS_996_2009",
        "is_number": "IS 996:2009",
        "title": "Single-Phase AC Induction Motors for General Purpose - Specification",
        "year": 2009,
        "domain": "Electrical",
        "scope": "Covers fractional and integral kilowatt single-phase induction motors (capacitor start, capacitor run, split phase, shaded pole) for voltages up to 250 V and 50 Hz for domestic, commercial and light industrial applications.",
        "status": "current",
        "supersedes": ["IS 996:1979"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2015, "description": "Tolerance on capacitor ratings and marking requirements"}],
        "normative_references": ["IS/IEC 60034-1:2004", "IS 900:1992"],
        "test_methods": ["IS 996:2009 Clause 14 (Locked rotor test, temperature rise, efficiency)"],
        "safety_standards": ["IS 302 (Part 1):2008"],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS 12615:2018"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "equipment_type": "single-phase induction motor",
            "phase": "single-phase",
            "voltage": "230 V / 240 V",
            "frequency": "50 Hz",
            "power_range": "0.18 kW to 2.2 kW (0.25 HP to 3 HP)",
            "duty": "continuous (S1)",
            "application": ["domestic pumps", "wet grinders", "bench drills", "exhaust fans", "compressors"]
        },
        "keywords": ["single phase motor", "230v motor", "capacitor run motor", "single phase induction motor", "domestic motor", "1 phase motor"]
    },
    {
        "id": "IS_16444_2_2017",
        "is_number": "IS 16444 (Part 2):2017",
        "title": "a.c. Static Transformer Operated Smart Electricity Meters - Class 0.2S and 0.5S",
        "year": 2017,
        "domain": "Electrical",
        "scope": "Covers static transformer operated smart electricity meters of accuracy class 0.2S and 0.5S for measurement of active and reactive energy with two-way communication capabilities for HT and LT industrial/commercial consumers.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2020, "description": "Updated communication protocols (IS 15959 Part 3 DLMS/COSEM)"}],
        "normative_references": ["IS 14697:1999", "IS 15959 (Part 3):2017"],
        "test_methods": ["IS 14697:1999 Clause 12", "IS 16444 (Part 2):2017 Clause 9"],
        "safety_standards": ["IS 13779:2020"],
        "installation_standards": ["IS 15707:2006"],
        "related_standards": ["IS 16444 (Part 1):2015", "IS 14697:1999"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Electrical Wires, Cables and Meters QCO"],
        "technical_parameters": {
            "accuracy_class": ["0.2S", "0.5S"],
            "meter_type": "transformer operated smart meter",
            "voltage": "3 x 110 V or 3 x 240/415 V",
            "communication": ["Cellular 4G/NB-IoT", "RF Mesh", "Optical port"],
            "application": ["HT consumer metering", "substation metering", "industrial energy audit", "feeder metering"]
        },
        "keywords": ["smart meter", "transformer operated meter", "class 0.2s", "class 0.5s", "energy meter", "ht meter", "smart grid", "dlms"]
    },
    {
        "id": "IS_15884_2010",
        "is_number": "IS 15884:2010",
        "title": "a.c. Static Direct Connected Pre-payment Electricity Meters, Class 1 and 2 - Specification",
        "year": 2010,
        "domain": "Electrical",
        "scope": "Covers design, construction, and testing of static direct connected pre-payment electricity meters of accuracy class 1 and 2 for active energy measurement with internal load switch and token/card interface.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 13779:1999", "IS 15959:2011"],
        "test_methods": ["IS 13779:1999 Clause 12", "IS 15884:2010 Clause 12"],
        "safety_standards": ["IS 13779:1999"],
        "installation_standards": ["IS 15707:2006"],
        "related_standards": ["IS 16444 (Part 1):2015", "IS 13779:2020"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "accuracy_class": ["1.0", "2.0"],
            "type": "prepayment meter",
            "rated_current": "5-30 A, 10-60 A",
            "voltage": "240 V single phase / 415 V three phase",
            "application": ["residential prepayment", "temporary connections", "rental housing", "commercial complexes"]
        },
        "keywords": ["prepaid meter", "prepayment electricity meter", "rechargeable meter", "smart card meter", "kwh meter"]
    },
    {
        "id": "IS_14697_1999",
        "is_number": "IS 14697:1999",
        "title": "a.c. Static Transformer Operated Watt-hour and VAR-Hour Meters, Class 0.2S and 0.5S - Specification",
        "year": 1999,
        "domain": "Electrical",
        "scope": "Covers requirements for static transformer operated electricity meters of high accuracy class 0.2S and 0.5S for bulk power transfer, grid substations and industrial consumers.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 2001, "description": "Harmonic influence testing"},
            {"number": "Amendment 2", "year": 2004, "description": "Tamper and fraud protection features"}
        ],
        "normative_references": ["IS/IEC 60687"],
        "test_methods": ["IS 14697:1999 Clause 12 (Accuracy limits, temperature coefficient, impulse voltage test)"],
        "safety_standards": ["IS 13779:1999"],
        "installation_standards": ["IS 15707:2006"],
        "related_standards": ["IS 16444 (Part 2):2017", "IS 13779:2020"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "accuracy_class": ["0.2S", "0.5S"],
            "current_rating": "-/1 A, -/5 A",
            "voltage_rating": "3x110 V (HT) / 3x240/415 V (LT)",
            "application": ["grid substations", "tariff metering", "industrial bulk power", "power plant output"]
        },
        "keywords": ["ht meter", "class 0.2s", "class 0.5s", "transformer operated meter", "tri-vector meter", "tariff meter", "ct pt meter"]
    },
    {
        "id": "IS_16046_1_2018",
        "is_number": "IS 16046 (Part 1):2018 / IEC 62133-1:2017",
        "title": "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes - Nickel Systems - Safety Requirements",
        "year": 2018,
        "domain": "Electronics",
        "scope": "Specifies requirements and tests for the safe operation of portable sealed secondary nickel cells and batteries containing alkaline electrolyte under intended use and reasonably foreseeable misuse.",
        "status": "current",
        "supersedes": ["IS 16046:2015"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 13252 (Part 1):2010"],
        "test_methods": ["Continuous charging, short circuit test, thermal abuse test, crush test"],
        "safety_standards": ["IEC 62133-1"],
        "installation_standards": [],
        "related_standards": ["IS 16046 (Part 2):2018"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory under Electronics & IT Goods QCO"],
        "technical_parameters": {
            "chemistry": "nickel metal hydride (Ni-MH) / nickel cadmium (Ni-Cd)",
            "battery_type": "portable secondary rechargeable cell/battery",
            "application": ["portable electronics", "emergency lights", "power tools", "telecom handsets"]
        },
        "keywords": ["nickel battery", "ni-mh battery", "rechargeable battery", "portable cell", "crs scheme", "battery safety"]
    },
    {
        "id": "IS_16046_2_2018",
        "is_number": "IS 16046 (Part 2):2018 / IEC 62133-2:2017",
        "title": "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes - Lithium Systems - Safety Requirements",
        "year": 2018,
        "domain": "Electronics",
        "scope": "Specifies safety requirements and tests for portable sealed secondary lithium cells and batteries (lithium-ion, lithium polymer) for use in mobile devices, laptops, energy storage systems, and electric equipment.",
        "status": "current",
        "supersedes": ["IS 16046:2015"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2021, "description": "Clarifications on battery pack management systems (BMS) and fire propagation"}],
        "normative_references": ["IS 13252 (Part 1):2010"],
        "test_methods": ["Continuous charging, external short circuit, thermal abuse (130 C), drop test, overcharging, forced discharge"],
        "safety_standards": ["IEC 62133-2:2017"],
        "installation_standards": [],
        "related_standards": ["IS 16046 (Part 1):2018", "IS 16220 (Part 1):2014"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory under MeitY Electronics QCO"],
        "technical_parameters": {
            "chemistry": "lithium-ion / lithium iron phosphate (LFP) / lithium polymer",
            "voltage": "3.2 V - 3.7 V per cell",
            "application": ["laptops", "mobile phones", "power banks", "electric vehicles", "portable power stations"]
        },
        "keywords": ["lithium ion battery", "li-ion cell", "lithium battery", "power bank battery", "lfp cell", "bms", "crs mandatory"]
    },
    {
        "id": "IS_16103_1_2012",
        "is_number": "IS 16103 (Part 1):2012",
        "title": "Led Modules for General Lighting - Part 1: Safety Requirements",
        "year": 2012,
        "domain": "Electrical",
        "scope": "Specifies general and safety requirements for light emitting diode (LED) modules for operation at constant voltage, constant current or constant power for general illumination.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 15885 (Part 2/Sec 13):2012", "IS 16102 (Part 1):2012"],
        "test_methods": ["Insulation resistance, electric strength, endurance test, thermal management"],
        "safety_standards": ["IS/IEC 60598-1"],
        "installation_standards": ["IS 10322"],
        "related_standards": ["IS 16102 (Part 1):2012", "IS 10322 (Part 5/Sec 1):2012"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory"],
        "technical_parameters": {
            "equipment_type": "LED module",
            "input_type": "constant current / constant voltage",
            "application": ["street lights", "indoor luminaires", "downlights", "high bay lighting"]
        },
        "keywords": ["led module", "led light engine", "led driver", "led safety", "crs scheme", "solid state lighting"]
    },
    {
        "id": "IS_1554_2_1988",
        "is_number": "IS 1554 (Part 2):1988",
        "title": "PVC Insulated (Heavy Duty) Electric Cables - Part 2: For Working Voltages from 3.3 kV up to and including 11 kV",
        "year": 1988,
        "domain": "Electrical",
        "scope": "Covers requirements for single, twin, three and four core PVC insulated and PVC sheathed armoured and unarmoured heavy duty cables for working voltages from 3.3 kV up to and including 11 kV.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 1993, "description": "Conductor resistance values and armour wire dimensions"},
            {"number": "Amendment 2", "year": 2002, "description": "Updated reference to test methods"}
        ],
        "normative_references": ["IS 8130:2013", "IS 10810:1984"],
        "test_methods": ["IS 10810 (Conductor resistance, insulation resistance, high voltage water immersion test)"],
        "safety_standards": ["IS 10810 (Flammability tests)"],
        "installation_standards": ["IS 1255:1983"],
        "related_standards": ["IS 1554 (Part 1):1988", "IS 7098 (Part 2):2011"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Cables QCO"],
        "technical_parameters": {
            "voltage_rating": "3.3 kV, 6.6 kV, 11 kV (HT cables)",
            "conductor": "Aluminium / Copper (Class 2 stranded)",
            "insulation": "PVC Type C / Type D",
            "armouring": "Galvanized steel flat strip / round wire",
            "application": ["industrial HT power distribution", "substation feeders", "mining underground cables"]
        },
        "keywords": ["ht cable", "11kv cable", "pvc cable", "armoured cable", "underground cable", "heavy duty cable", "3.3kv cable"]
    },
    {
        "id": "IS_16221_2_2015",
        "is_number": "IS 16221 (Part 2):2015 / IEC 62109-2:2011",
        "title": "Safety of Power Converters for use in Photovoltaic Power Systems - Part 2: Particular Requirements for Inverters",
        "year": 2015,
        "domain": "Solar",
        "scope": "Covers safety requirements for grid-connected and stand-alone utility solar inverters regarding protection against electric shock, energy, fire, mechanical and other hazards.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 16169:2014", "IS 14286:2010"],
        "test_methods": ["Array insulation resistance monitoring, ground fault protection, short circuit tests, temperature limits"],
        "safety_standards": ["IEC 62109-1", "IEC 62109-2"],
        "installation_standards": ["CEA Technical Standards for Grid Connectivity"],
        "related_standards": ["IS 16169:2014", "IS 14286:2010"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory under MNRE Solar QCO"],
        "technical_parameters": {
            "converter_type": "solar photovoltaic inverter (string / central / micro)",
            "dc_input_voltage": "up to 1500 V DC",
            "ac_output_voltage": "230 V 1-phase / 415 V 3-phase / HT grid",
            "efficiency": "> 98%",
            "application": ["rooftop solar", "utility scale solar farm", "solar water pumping inverters", "hybrid solar systems"]
        },
        "keywords": ["solar inverter", "grid tie inverter", "pv inverter", "solar converter", "mnre solar", "string inverter", "crs mandatory"]
    },
    {
        "id": "IS_16169_2014",
        "is_number": "IS 16169:2014 / IEC 62116:2011",
        "title": "Test Procedure of Islanding Prevention Measures for Utility-Interconnected Photovoltaic Inverters",
        "year": 2014,
        "domain": "Solar",
        "scope": "Provides a test procedure to evaluate the performance of islanding prevention measures used in utility-interconnected photovoltaic (PV) inverters to ensure the inverter automatically disconnects when the grid loses power.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 16221 (Part 2):2015"],
        "test_methods": ["Resonant RLC load islanding test with trip time measurement (< 2 seconds)"],
        "safety_standards": ["IS 16221 (Part 2):2015", "CEA Regulations 2013"],
        "installation_standards": ["Grid Connectivity Guidelines"],
        "related_standards": ["IS 16221 (Part 2):2015"],
        "certification": ["Mandatory test compliance under MNRE Solar Inverter Guidelines"],
        "technical_parameters": {
            "anti_islanding_trip_time": "< 2.0 seconds",
            "tested_power_levels": "25%, 50%, 100% rated output",
            "application": ["grid interactive solar systems", "rooftop net metering inverters"]
        },
        "keywords": ["anti islanding", "islanding prevention", "grid trip", "solar grid safety", "rlc test", "net metering"]
    },
    {
        "id": "IS_16220_1_2014",
        "is_number": "IS 16220 (Part 1):2014",
        "title": "Secondary Cells and Batteries for Solar Photovoltaic Application - General Requirements and Methods of Test",
        "year": 2014,
        "domain": "Solar",
        "scope": "Covers requirements and tests for lead-acid and other secondary storage batteries intended for use with solar photovoltaic (SPV) power systems.",
        "status": "current",
        "supersedes": ["IS 13369:1992 (in part for solar duty)"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 13369:1992", "IS 15549:2005"],
        "test_methods": ["Capacity test (C10 rating), endurance in solar cycling, ampere-hour efficiency, charge retention"],
        "safety_standards": ["IS 13369:1992"],
        "installation_standards": [],
        "related_standards": ["IS 13369:1992", "IS 14286:2010"],
        "certification": ["BIS Scheme-I (ISI Mark) / MNRE Approved"],
        "technical_parameters": {
            "battery_chemistry": "lead-acid (tubular plate / gel / vrla)",
            "nominal_voltage": "2 V, 12 V",
            "rating": "C10 capacity rating (40 Ah to 1000 Ah)",
            "cycle_life": "> 1500 cycles at 80% DOD",
            "application": ["solar street lights", "solar off-grid home systems", "telecom solar towers", "solar microgrids"]
        },
        "keywords": ["solar battery", "tubular battery", "c10 battery", "solar storage", "deep cycle battery", "spv battery"]
    },
    {
        "id": "IS_13369_1992",
        "is_number": "IS 13369:1992",
        "title": "Stationary Lead-Acid Batteries with Tubular Positive Plates - Specification",
        "year": 1992,
        "domain": "Electrical",
        "scope": "Covers stationary lead-acid cells and batteries with tubular positive plates for generating stations, substations, telephone exchanges, solar and UPS installations.",
        "status": "current",
        "supersedes": ["IS 1651:1979 (in part)"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 1997, "description": "Clarifications on electrolyte specific gravity and container materials"}],
        "normative_references": ["IS 1069:1993", "IS 266:1993"],
        "test_methods": ["IS 13369:1992 Clause 11 (Ampere-hour capacity, endurance test, retention of charge)"],
        "safety_standards": ["Vent plug flame arrestor requirements"],
        "installation_standards": [],
        "related_standards": ["IS 16220 (Part 1):2014", "IS 15549:2005"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "cell_voltage": "2.0 V nominal",
            "capacity": "100 Ah to 5000 Ah at C10",
            "plate_type": "tubular positive plate",
            "application": ["substation dc backup", "telecom ups", "power plant emergency power"]
        },
        "keywords": ["tubular battery", "stationary battery", "lead acid battery", "substation battery", "2v cell", "ups battery", "c10 rating"]
    },
    {
        "id": "IS_12933_1_2003",
        "is_number": "IS 12933 (Part 1):2003",
        "title": "Solar Flat Plate Collector - Specification",
        "year": 2003,
        "domain": "Solar",
        "scope": "Covers thermal performance, construction, materials and safety requirements for solar flat plate collectors intended for water heating applications in domestic and commercial sectors.",
        "status": "current",
        "supersedes": ["IS 12933 (Part 1):1992"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2011, "description": "Selective coating requirements on absorber sheet and glass transmittance"}],
        "normative_references": ["IS 2553 (Part 1):1990", "IS 737:1986"],
        "test_methods": ["Outdoor thermal efficiency test, stagnation test, internal/external thermal shock, pressure test (500 kPa)"],
        "safety_standards": ["Tempered safety glass requirement"],
        "installation_standards": [],
        "related_standards": ["IS 12933 (Part 2):2003"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Solar Thermal QCO"],
        "technical_parameters": {
            "absorber_area": "2.0 sq.m nominal",
            "absorber_material": "copper sheet with black chrome / selective coating",
            "glazing": "toughened low-iron solar glass (transmittance > 85%)",
            "operating_pressure": "up to 5 bar",
            "application": ["solar water heater", "swh system", "industrial process water heating", "hospital hot water"]
        },
        "keywords": ["solar flat plate collector", "solar water heater", "swh collector", "thermal collector", "flat plate collector", "solar thermal"]
    },

    # --- CIVIL & STRUCTURAL ---
    {
        "id": "IS_455_2015",
        "is_number": "IS 455:2015",
        "title": "Portland Slag Cement - Specification",
        "year": 2015,
        "domain": "Civil",
        "scope": "Covers manufacture and chemical/physical requirements of Portland Slag Cement (PSC) produced by intergrinding Portland cement clinker and granulated blast furnace slag. Especially suitable for marine and aggressive chemical environments.",
        "status": "current",
        "supersedes": ["IS 455:1989"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2018, "description": "Permissible slag content range revised to 25% to 70%"}],
        "normative_references": ["IS 4031", "IS 4032"],
        "test_methods": ["IS 4031 (Part 6):1988 Compressive strength, IS 4031 (Part 5):1988 Setting times, Soundness (Le Chatelier)"],
        "safety_standards": ["IS 456:2000 (Concrete Code)"],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 269:2015", "IS 1489 (Part 1):2015"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Cement Quality Control Order"],
        "technical_parameters": {
            "cement_type": "Portland Slag Cement (PSC)",
            "compressive_strength_28d": "minimum 33 MPa (matches 43/53 MPa concrete grades)",
            "initial_setting_time": "minimum 30 minutes",
            "final_setting_time": "maximum 600 minutes",
            "slag_constituent": "25% to 70% granulated blast furnace slag",
            "application": ["marine structures", "sewage treatment plants", "mass concrete foundations", "coastal ports"]
        },
        "keywords": ["portland slag cement", "psc cement", "slag cement", "marine concrete", "sulfate resistant cement", "coastal construction"]
    },
    {
        "id": "IS_1489_2_2015",
        "is_number": "IS 1489 (Part 2):2015",
        "title": "Portland Pozzolana Cement - Specification - Part 2: Calcined Clay Based",
        "year": 2015,
        "domain": "Civil",
        "scope": "Covers manufacture, chemical and physical requirements of Portland Pozzolana Cement using calcined clay (calcined clay pozzolana) as blending material (15% to 35%).",
        "status": "current",
        "supersedes": ["IS 1489 (Part 2):1991"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 4031", "IS 4032"],
        "test_methods": ["IS 4031 (Part 6) Compressive strength, IS 4031 (Part 4) Consistency"],
        "safety_standards": ["IS 456:2000"],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 1489 (Part 1):2015", "IS 269:2015"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Cement QCO"],
        "technical_parameters": {
            "cement_type": "calcined clay based PPC",
            "pozzolana_content": "15% to 35% calcined clay",
            "compressive_strength_28d": "minimum 33 MPa",
            "application": ["masonry mortar", "plastering", "hydraulic structures", "foundation work"]
        },
        "keywords": ["ppc cement", "calcined clay cement", "pozzolana cement", "plastering cement", "masonry cement"]
    },
    {
        "id": "IS_432_1_1982",
        "is_number": "IS 432 (Part 1):1982",
        "title": "Mild Steel and Medium Tensile Steel Bars and Hard-Drawn Steel Wire for Concrete Reinforcement - Part 1: Mild Steel and Medium Tensile Steel Bars",
        "year": 1982,
        "domain": "Civil",
        "scope": "Covers requirements for plain mild steel bars and medium tensile steel bars used as reinforcement in concrete structures, stirrups, column ties, and structural hooks.",
        "status": "current",
        "supersedes": ["IS 432:1966"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 1989, "description": "Chemical composition limits and bend test mandrel diameters"}],
        "normative_references": ["IS 226", "IS 1608"],
        "test_methods": ["IS 1608 (Tensile testing), IS 1599 (Bend test)"],
        "safety_standards": ["IS 456:2000"],
        "installation_standards": ["IS 2502:1963 (Bending and fixing of bars)"],
        "related_standards": ["IS 1786:2008"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Steel Products QCO"],
        "technical_parameters": {
            "grade": ["Mild Steel Grade I (Fe 250)", "Medium Tensile Steel (Fe 350)"],
            "yield_strength": "minimum 250 MPa",
            "tensile_strength": "minimum 410 MPa",
            "elongation": "minimum 23%",
            "application": ["stirrups", "shear links", "structural ties", "reinforcement binding", "drainage slabs"]
        },
        "keywords": ["mild steel bar", "fe 250", "plain round bar", "stirrup steel", "column ties", "ms rebar"]
    },
    {
        "id": "IS_1077_1992",
        "is_number": "IS 1077:1992",
        "title": "Common Burnt Clay Building Bricks - Specification",
        "year": 1992,
        "domain": "Civil",
        "scope": "Covers quality, dimensions, compressive strength classes (3.5 MPa to 35 MPa), water absorption, and efflorescence requirements for common burnt clay building bricks for masonry walls.",
        "status": "current",
        "supersedes": ["IS 1077:1986"],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 1997, "description": "Modular and non-modular standard dimensions"},
            {"number": "Amendment 2", "year": 2002, "description": "Water absorption tolerance"}
        ],
        "normative_references": ["IS 3495 (Parts 1 to 4):1992"],
        "test_methods": ["IS 3495 (Part 1) Compressive strength, (Part 2) Water absorption, (Part 3) Efflorescence"],
        "safety_standards": ["IS 1905:1987 (Code of practice for structural safety of masonry)"],
        "installation_standards": ["IS 2212:1991 (Code of practice for brickwork)"],
        "related_standards": ["IS 2185 (Part 1):2005"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "strength_classes": ["Class 3.5", "Class 5", "Class 7.5", "Class 10", "Class 15"],
            "compressive_strength": "3.5 N/mm2 to 35 N/mm2",
            "water_absorption": "< 20% by weight for class up to 12.5; < 15% for higher classes",
            "dimensions": "190 x 90 x 90 mm (modular), 230 x 115 x 75 mm (non-modular)",
            "application": ["load bearing masonry", "partition walls", "boundary walls", "building foundations"]
        },
        "keywords": ["red bricks", "clay bricks", "building bricks", "burnt clay bricks", "masonry bricks", "class 7.5 bricks", "brickwork"]
    },
    {
        "id": "IS_2185_1_2005",
        "is_number": "IS 2185 (Part 1):2005",
        "title": "Concrete Masonry Units - Part 1: Hollow and Solid Concrete Blocks",
        "year": 2005,
        "domain": "Civil",
        "scope": "Specifies requirements for solid and hollow precast concrete masonry blocks made from lightweight or dense aggregates for use in the construction of concrete masonry walls.",
        "status": "current",
        "supersedes": ["IS 2185 (Part 1):1979"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2012, "description": "Drying shrinkage test limits"}],
        "normative_references": ["IS 383:2016", "IS 269:2015"],
        "test_methods": ["Compressive strength test, water absorption test, block density measurement"],
        "safety_standards": ["IS 1905:1987"],
        "installation_standards": ["IS 2572:2005 (Code of practice for construction of concrete masonry walls)"],
        "related_standards": ["IS 1077:1992"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "block_type": "hollow concrete block / solid concrete block",
            "grade": ["Grade A (load-bearing)", "Grade B (load-bearing)", "Grade C (non-load bearing)"],
            "compressive_strength": "3.5 MPa to 15.0 MPa",
            "dimensions": "400 x 200 x 200 mm, 400 x 100 x 200 mm",
            "density": "1500 kg/m3 to 2000 kg/m3",
            "application": ["load bearing walls", "partition walls", "compound walls", "high rise external cladding"]
        },
        "keywords": ["concrete blocks", "hollow blocks", "solid blocks", "cmu blocks", "masonry blocks", "cement blocks"]
    },
    {
        "id": "IS_1346_1991",
        "is_number": "IS 1346:1991",
        "title": "Code of Practice for Waterproofing of Roofs with Bitumen Felts",
        "year": 1991,
        "domain": "Civil",
        "scope": "Provides guidance on the selection and application of bitumen felts for waterproofing of flat and sloping roofs of buildings.",
        "status": "current",
        "supersedes": ["IS 1346:1976"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 1322:1993", "IS 702:1988"],
        "test_methods": ["Water tightness ponding test for 72 hours"],
        "safety_standards": ["Fire safety during bitumen heating (IS 3037)"],
        "installation_standards": ["IS 1346:1991 Section 6"],
        "related_standards": ["IS 2645:2003"],
        "certification": ["CPWD Specification compliance"],
        "technical_parameters": {
            "treatment_type": "bitumen felt membrane waterproofing (four course / six course treatment)",
            "roof_slope": "flat and sloping roofs",
            "ponding_test": "minimum 72 hours without leakage",
            "application": ["roof waterproofing", "terrace water barrier", "balcony waterproofing", "slab moisture barrier"]
        },
        "keywords": ["roof waterproofing", "bitumen felt", "terrace waterproofing", "tar felt", "waterproofing treatment", "roof leakage"]
    },
    {
        "id": "IS_2645_2003",
        "is_number": "IS 2645:2003",
        "title": "Integral Waterproofing Compounds for Cement Mortar and Concrete - Specification",
        "year": 2003,
        "domain": "Civil",
        "scope": "Covers physical and chemical requirements for solid or liquid integral waterproofing compounds added to cement concrete or mortar to impart water repellency and reduce water permeability.",
        "status": "current",
        "supersedes": ["IS 2645:1975"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 456:2000", "IS 516"],
        "test_methods": ["Permeability test under 20 m water head, compressive strength retention (>90%), setting time test"],
        "safety_standards": ["IS 456:2000"],
        "installation_standards": ["IS 456:2000 Clause 5.5"],
        "related_standards": ["IS 1346:1991", "IS 9103:1999"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "physical_state": "liquid / powder",
            "dosage": "1% to 2% by weight of cement",
            "water_permeability_reduction": "> 50% compared to control mix",
            "application": ["basements", "water retaining tanks", "swimming pools", "plastering of external walls", "roof slabs"]
        },
        "keywords": ["waterproofing compound", "integral waterproofing", "admixture", "concrete waterproofing", "leak proof cement"]
    },
    {
        "id": "IS_458_2021",
        "is_number": "IS 458:2021",
        "title": "Precast Concrete Pipes (With and Without Reinforcement) - Specification",
        "year": 2021,
        "domain": "Civil",
        "scope": "Covers requirements for precast non-reinforced and reinforced concrete pipes (NP1, NP2, NP3, NP4 classes) used for culverts, storm water drainage, irrigation, and sewers.",
        "status": "current",
        "supersedes": ["IS 458:2003"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 456:2000", "IS 383:2016", "IS 1786:2008"],
        "test_methods": ["Three-edge bearing test (crushing load), hydrostatic pressure test, barrel absorption test"],
        "safety_standards": ["Highway culvert load design (IRC:6)"],
        "installation_standards": ["IS 783:1985 (Code of practice for laying of concrete pipes)"],
        "related_standards": ["IS 1536:2001", "IS 8329:2000"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "pipe_class": ["NP2 (light duty non-pressure)", "NP3 (medium duty road culvert)", "NP4 (heavy duty highway culvert)"],
            "internal_diameter": "150 mm to 2400 mm",
            "hydrostatic_pressure": "up to 0.07 MPa for NP classes",
            "joint_type": "spigot and socket, collar joint, flush joint",
            "application": ["highway culvert", "storm water drain", "sewage collection", "railway crossing drain"]
        },
        "keywords": ["rcc pipe", "np3 pipe", "np4 pipe", "concrete pipe", "hume pipe", "drainage pipe", "culvert pipe", "sewer pipe"]
    },
    {
        "id": "IS_1536_2001",
        "is_number": "IS 1536:2001",
        "title": "Centrifugally Cast (Spun) Iron Pressure Pipes for Water, Gas and Sewage - Specification",
        "year": 2001,
        "domain": "Civil",
        "scope": "Covers centrifugally cast (spun) iron pressure pipes with spigot and socket or flanged ends for water, gas and sewage mains.",
        "status": "current",
        "supersedes": ["IS 1536:1989"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 1538:1993"],
        "test_methods": ["Hydrostatic factory pressure test, tensile test, hardness test"],
        "safety_standards": ["CPHEEO Water Supply Manual"],
        "installation_standards": ["IS 3114:1994"],
        "related_standards": ["IS 8329:2000"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "nominal_size": "80 mm to 1000 mm",
            "pressure_class": ["Class LA", "Class A", "Class B"],
            "working_pressure": "up to 1.6 MPa (16 bar)",
            "application": ["water distribution mains", "sewage gravity mains", "pumping mains"]
        },
        "keywords": ["cast iron pipe", "ci pipe", "spun iron pipe", "water pipeline", "water main", "pressure pipe"]
    },
    {
        "id": "IS_8329_2000",
        "is_number": "IS 8329:2000",
        "title": "Centrifugally Cast (Spun) Ductile Iron Pipes for Water, Gas and Sewage - Specification",
        "year": 2000,
        "domain": "Civil",
        "scope": "Specifies requirements and test methods for ductile iron pipes centrifugally cast in metal or sand moulds, with socket and spigot ends or flanged ends, for potable water conveyance, sewer gravity lines, and pressure mains.",
        "status": "current",
        "supersedes": ["IS 8329:1994"],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 2006, "description": "Addition of Class C performance requirements"},
            {"number": "Amendment 2", "year": 2012, "description": "Zinc coating and internal cement mortar lining updates"}
        ],
        "normative_references": ["IS 9523:2000", "IS 12288:1987"],
        "test_methods": ["Hydrostatic test at works (up to 50 bar), tensile test (min 420 MPa), elongation test (min 10%), ring bending test"],
        "safety_standards": ["Internal cement mortar lining for drinking water safety"],
        "installation_standards": ["IS 12288:1987 (Code of practice for laying of ductile iron pipes)"],
        "related_standards": ["IS 4984:2016", "IS 1536:2001"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Ductile Iron Pipes QCO"],
        "technical_parameters": {
            "pressure_class": ["Class K7", "Class K9", "Class K12"],
            "nominal_diameter": "80 mm to 2000 mm",
            "internal_lining": "cement mortar lining (OPC or sulfate resisting)",
            "external_coating": "metallic zinc coating with bituminous finishing layer",
            "application": ["municipal water supply", "raw water transmission", "cross-country pipeline", "sewer rising main"]
        },
        "keywords": ["ductile iron pipe", "di pipe", "k9 pipe", "k7 pipe", "water transmission pipe", "potable water pipeline", "di pipeline"]
    },
    {
        "id": "IS_1239_2_1992",
        "is_number": "IS 1239 (Part 2):1992",
        "title": "Mild Steel Tubular and Other Wrought Steel Pipe Fittings - Specification",
        "year": 1992,
        "domain": "Mechanical",
        "scope": "Specifies requirements for mild steel tubulars and other wrought steel pipe fittings (bends, tees, reducers, couplings, flanges, elbows) suitable for screwed connection with mild steel tubes conforming to IS 1239 (Part 1).",
        "status": "current",
        "supersedes": ["IS 1239 (Part 2):1982"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 1239 (Part 1):2004", "IS 554:1985"],
        "test_methods": ["Hydrostatic pressure test (3 MPa), threading gauging test to IS 554"],
        "safety_standards": ["Fire safety and plumbing codes"],
        "installation_standards": ["IS 2065:1983 (Code of practice for water supply in buildings)"],
        "related_standards": ["IS 1239 (Part 1):2004"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "fitting_type": "elbow, tee, reducer, socket, union, coupling",
            "nominal_size": "15 mm to 150 mm",
            "finish": "black (uncoated) or hot-dip galvanized (GI)",
            "working_pressure": "up to 1.2 MPa for steam / 1.6 MPa for water",
            "application": ["fire fighting pipelines", "chilled water piping", "compressed air lines", "building plumbing"]
        },
        "keywords": ["gi fittings", "pipe fittings", "ms elbow", "gi tee", "pipe coupling", "threaded fittings", "plumbing fittings"]
    },

    # --- MECHANICAL: PUMPS & VALVES ---
    {
        "id": "IS_9079_2018",
        "is_number": "IS 9079:2018",
        "title": "Monoset Pumps for Clean, Cold Water for Agricultural and Industrial Applications - Specification",
        "year": 2018,
        "domain": "Mechanical",
        "scope": "Covers design, construction, materials and performance of electric motor driven monoset pumps for handling clean, cold water for agricultural, industrial, and domestic applications with power up to 22 kW.",
        "status": "current",
        "supersedes": ["IS 9079:2002"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 12615:2018", "IS 7538:1996"],
        "test_methods": ["IS 11346:2002 (Testing of agricultural and industrial water pumps)"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 10804:1994 (Installation and maintenance of pumps)"],
        "related_standards": ["IS 1520:1980", "IS 12615:2018"],
        "certification": ["BIS Scheme-I (ISI Mark) / BEE Star Energy Labeling Mandatory"],
        "technical_parameters": {
            "pump_type": "monoset centrifugal pump",
            "power_rating": "0.37 kW to 22 kW (0.5 HP to 30 HP)",
            "discharge": "up to 120 lps",
            "head": "up to 100 meters",
            "efficiency": "BEE 5-star / 4-star energy efficient ratings",
            "application": ["agricultural irrigation", "industrial water circulation", "building water booster", "cooling towers"]
        },
        "keywords": ["monoset pump", "centrifugal pump", "water pump", "irrigation pump", "industrial pump", "bee star pump", "agricultural pump"]
    },
    {
        "id": "IS_8034_2018",
        "is_number": "IS 8034:2018",
        "title": "Submersible Pumpsets for Clear, Cold Water - Specification",
        "year": 2018,
        "domain": "Mechanical",
        "scope": "Specifies requirements for multi-stage borehole submersible pumpsets (submersible pump coupled to submersible water-filled motor) for clean, cold water in borewells of 100 mm to 300 mm diameter.",
        "status": "current",
        "supersedes": ["IS 8034:2002"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2021, "description": "Revised energy efficiency benchmarks aligned with BEE Star ratings"}],
        "normative_references": ["IS 9283:2013 (Submersible Motors)"],
        "test_methods": ["IS 11346:2002 Pump performance test, shut-off head test, vibration test"],
        "safety_standards": ["IS 9283:2013 (Water lubricated motor safety)"],
        "installation_standards": ["IS 10804:1994"],
        "related_standards": ["IS 9283:2013", "IS 9079:2018"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Centrifugal Pumps QCO"],
        "technical_parameters": {
            "borewell_size": "100 mm (4 inch), 150 mm (6 inch), 200 mm (8 inch)",
            "power_range": "0.75 kW to 75 kW (1 HP to 100 HP)",
            "head_range": "20 m to 450 m",
            "discharge_range": "10 LPM to 2500 LPM",
            "application": ["deep tube well pumping", "municipal water supply", "mine dewatering", "industrial raw water extraction"]
        },
        "keywords": ["submersible pump", "borewell pump", "deep well pump", "multi stage pump", "submersible pumpset", "tube well pump"]
    },
    {
        "id": "IS_1520_1980",
        "is_number": "IS 1520:1980",
        "title": "Horizontal Centrifugal Pumps for Clear, Cold, Fresh Water - Specification",
        "year": 1980,
        "domain": "Mechanical",
        "scope": "Covers design and testing of horizontal split case and end-suction centrifugal pumps for clear, cold fresh water for public water supply, civil works, power stations and industrial facilities.",
        "status": "current",
        "supersedes": ["IS 1520:1972"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 1990, "description": "NPSH requirements and hydrostatic test pressure"}],
        "normative_references": ["IS 12615:2018", "IS 5120"],
        "test_methods": ["IS 9137 (Centrifugal, axial and mixed flow pumps testing - Class B)"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 10804:1994"],
        "related_standards": ["IS 9079:2018", "IS 12615:2018"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "pump_type": "horizontal split case / end suction centrifugal pump",
            "capacity": "up to 5000 m3/hr",
            "head": "up to 200 m",
            "casing_material": "cast iron / cast steel / bronze",
            "application": ["municipal water treatment", "intake pump house", "fire water booster", "cooling water circulation"]
        },
        "keywords": ["horizontal pump", "centrifugal pump", "split case pump", "water booster pump", "water supply pump", "end suction pump"]
    },
    {
        "id": "IS_6595_1_2002",
        "is_number": "IS 6595 (Part 1):2002",
        "title": "Horizontal Centrifugal Pumps for Agricultural Purposes - Specification",
        "year": 2002,
        "domain": "Mechanical",
        "scope": "Covers performance requirements for horizontal centrifugal pumps intended for agricultural lift irrigation from open wells, rivers, canals and storage tanks.",
        "status": "current",
        "supersedes": ["IS 6595:1980"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 11346"],
        "test_methods": ["Pump hydraulic performance test, suction lift test"],
        "safety_standards": ["Belt guard protection requirements"],
        "installation_standards": ["IS 10804:1994"],
        "related_standards": ["IS 9079:2018"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "pump_type": "agricultural centrifugal pump",
            "drive_type": "electric motor / diesel engine driven",
            "head": "6 m to 40 m",
            "application": ["canal lift irrigation", "agricultural drainage", "fish ponds", "farm water supply"]
        },
        "keywords": ["agricultural pump", "lift irrigation pump", "diesel engine pump", "canal pump", "farm water pump"]
    },
    {
        "id": "IS_14846_2000",
        "is_number": "IS 14846:2000",
        "title": "Sluice Valves for Water Works Purposes (50 to 1200 mm Size) - Specification",
        "year": 2000,
        "domain": "Mechanical",
        "scope": "Specifies requirements for non-rising and rising stem sluice (gate) valves of sizes 50 mm to 1200 mm with flanged ends, for water works and potable water supply systems with ratings PN 1.0 and PN 1.6.",
        "status": "current",
        "supersedes": ["IS 780:1984", "IS 2906:1984"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2005, "description": "Seat tightness test pressure requirements"}],
        "normative_references": ["IS 1538", "IS 210:2009"],
        "test_methods": ["Body hydrostatic test (1.5 x PN), seat leakage test (1.1 x PN), torque test"],
        "safety_standards": ["CPHEEO Guidelines for Water Distribution"],
        "installation_standards": ["IS 2685:1971 (Code of practice for selection, installation and maintenance of sluice valves)"],
        "related_standards": ["IS 778:1984", "IS 13095:1991"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Valves QCO"],
        "technical_parameters": {
            "valve_type": "sluice valve / gate valve",
            "nominal_size": "50 mm to 1200 mm (DN 50 to DN 1200)",
            "pressure_rating": ["PN 1.0 (10 bar)", "PN 1.6 (16 bar)"],
            "construction": "cast iron body with bronze trim / stainless steel spindle",
            "application": ["potable water supply", "water transmission pipelines", "water treatment plants", "reservoir isolation"]
        },
        "keywords": ["sluice valve", "gate valve", "water valve", "isolation valve", "pn 16 valve", "ci valve", "waterworks valve"]
    },
    {
        "id": "IS_778_1984",
        "is_number": "IS 778:1984",
        "title": "Copper Alloy Gate, Globe and Check Valves for Water Works Purposes - Specification",
        "year": 1984,
        "domain": "Mechanical",
        "scope": "Specifies requirements for copper alloy (bronze / gunmetal / brass) gate, globe and check valves of nominal sizes 8 mm to 100 mm for water works and building plumbing systems up to PN 1.6 rating.",
        "status": "current",
        "supersedes": ["IS 778:1971"],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 1990, "description": "Material chemical composition specifications"},
            {"number": "Amendment 2", "year": 2000, "description": "Lead content restrictions for drinking water applications"}
        ],
        "normative_references": ["IS 318:1981 (Leaded Tin Bronze)"],
        "test_methods": ["Body pressure test (2.4 MPa), seat pressure test (1.6 MPa)"],
        "safety_standards": ["National Building Code Plumbing Chapter"],
        "installation_standards": ["IS 2065:1983"],
        "related_standards": ["IS 14846:2000"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "valve_type": "gunmetal gate valve / globe valve / non-return check valve (NRV)",
            "material": "gunmetal (leaded tin bronze Grade LTB 2)",
            "nominal_size": "15 mm to 100 mm",
            "pressure_rating": ["Class 1 (PN 1.0)", "Class 2 (PN 1.6)"],
            "application": ["domestic water plumbing", "overhead water tank valve", "pump discharge nrv", "boiler feed lines"]
        },
        "keywords": ["gunmetal valve", "bronze valve", "check valve", "nrv valve", "globe valve", "plumbing valve", "brass valve"]
    },
    {
        "id": "IS_13095_1991",
        "is_number": "IS 13095:1991",
        "title": "Butterfly Valves for General Purposes - Specification",
        "year": 1991,
        "domain": "Mechanical",
        "scope": "Covers design, manufacturing and testing of cast iron, ductile iron and cast steel butterfly valves (wafer and flanged type) with resilient or metal seating for isolation and flow regulation in pipelines.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2003, "description": "EPDM liner vulcanization and face to face dimensions"}],
        "normative_references": ["IS 210:2009", "IS 1538"],
        "test_methods": ["Shell hydrostatic test, seat leakage test, operating torque test"],
        "safety_standards": ["Fire fighting water supply requirements"],
        "installation_standards": ["IS 2685:1971"],
        "related_standards": ["IS 14846:2000"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "valve_type": "butterfly valve (wafer / double flanged / lug type)",
            "nominal_size": "50 mm to 1800 mm",
            "pressure_rating": ["PN 0.6", "PN 1.0", "PN 1.6"],
            "seat_type": "resilient EPDM / Nitrile rubber / metal-to-metal",
            "application": ["hvac chilled water", "cooling tower pipelines", "water treatment plants", "fire hydrant loops"]
        },
        "keywords": ["butterfly valve", "wafer valve", "flow regulation valve", "chilled water valve", "water pipeline valve", "pn 16 valve"]
    },
    {
        "id": "IS_4985_2021",
        "is_number": "IS 4985:2021",
        "title": "Unplasticized Polyvinyl Chloride (uPVC) Pipes for Potable Water Supplies - Specification",
        "year": 2021,
        "domain": "Mechanical",
        "scope": "Specifies requirements for plain ended or socketed unplasticized polyvinyl chloride (uPVC) pipes for potable water transportation, plumbing and irrigation under pressure.",
        "status": "current",
        "supersedes": ["IS 4985:2000"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 12235 (Methods of Test for uPVC Pipes)", "IS 10500:2012"],
        "test_methods": ["Short-term hydrostatic pressure test, internal hydrostatic pressure 1000 hr test, impact test at 0 C, opacity test"],
        "safety_standards": ["Heavy metal extraction test (Lead-free formulations for drinking water compliance)"],
        "installation_standards": ["IS 7634 (Part 3):2003 (Laying and jointing of uPVC pipes)"],
        "related_standards": ["IS 4984:2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under PVC Pipes QCO"],
        "technical_parameters": {
            "material": "unplasticized polyvinyl chloride (uPVC)",
            "pressure_class": ["Class 1 (0.25 MPa)", "Class 2 (0.4 MPa)", "Class 3 (0.6 MPa)", "Class 4 (1.0 MPa)", "Class 5 (1.25 MPa)"],
            "nominal_outer_diameter": "16 mm to 400 mm",
            "application": ["drinking water supply", "tube well casing and strainer", "agricultural irrigation", "building plumbing"]
        },
        "keywords": ["upvc pipe", "pvc pipe", "potable water pipe", "plastic pipe", "irrigation pipe", "water plumbing pipe", "lead free upvc"]
    },
    {
        "id": "IS_12786_1989",
        "is_number": "IS 12786:1989",
        "title": "Irrigation Equipment - Polyethylene Pipes for Irrigation Laterals - Specification",
        "year": 1989,
        "domain": "Mechanical",
        "scope": "Covers requirements for low density and linear low density polyethylene (LLDPE) pipes used as laterals in drip (trickle) irrigation systems.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 1994, "description": "Carbon black dispersion requirements"}],
        "normative_references": ["IS 2530:1963", "IS 4984:2016"],
        "test_methods": ["Hydrostatic pressure test, carbon black content (2.0 to 3.0%), environmental stress crack resistance (ESCR)"],
        "safety_standards": ["Micro-irrigation standards"],
        "installation_standards": ["IS 10791"],
        "related_standards": ["IS 4984:2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Drip Irrigation QCO"],
        "technical_parameters": {
            "material": "LLDPE / LDPE with UV stabilizer",
            "outer_diameter": "12 mm, 16 mm, 20 mm, 25 mm, 32 mm",
            "working_pressure": "Class 1 (0.25 MPa), Class 2 (0.4 MPa)",
            "application": ["drip irrigation laterals", "micro-sprinkler lines", "greenhouse irrigation", "orchard drip systems"]
        },
        "keywords": ["drip pipe", "irrigation pipe", "lldpe pipe", "drip lateral", "micro irrigation", "trickle irrigation"]
    },
    {
        "id": "IS_3844_1989",
        "is_number": "IS 3844:1989",
        "title": "Code of Practice for Installation and Maintenance of Internal Fire Hydrants and Hose Reels on Premises",
        "year": 1989,
        "domain": "Mechanical",
        "scope": "Lays down requirements for installation and maintenance of internal fire hydrants and first-aid hose reel systems for commercial, industrial, institutional and residential multi-story buildings.",
        "status": "current",
        "supersedes": ["IS 3844:1966"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2005, "description": "Water pressure requirements at topmost hydrant landing valve (minimum 3.5 bar)"}],
        "normative_references": ["IS 5290:1993 (Landing Valves)", "IS 884:1985 (First-Aid Hose Reels)"],
        "test_methods": ["Hydrostatic flow test (900 lpm at 3.5 bar running pressure)"],
        "safety_standards": ["National Building Code Part 4 (Fire and Life Safety)"],
        "installation_standards": ["IS 3844:1989"],
        "related_standards": ["IS 15683:2018", "IS 2190:2010"],
        "certification": ["State Fire Service Fire NOC mandatory compliance"],
        "technical_parameters": {
            "hydrant_valve_size": "63 mm instantaneous landing valve",
            "hose_reel": "19 mm / 25 mm braided rubber hose (30 m length)",
            "running_pressure": "minimum 3.5 bar at highest outlet",
            "pump_capacity": "2280 lpm (main fire pump)",
            "application": ["commercial high rise buildings", "shopping malls", "industrial warehouses", "hospitals"]
        },
        "keywords": ["fire hydrant", "hose reel", "landing valve", "internal hydrant", "fire fighting system", "fire safety code", "wet riser"]
    },
    {
        "id": "IS_2878_2004",
        "is_number": "IS 2878:2004",
        "title": "Fire Extinguisher, Carbon Dioxide Type (Portable and Trolley Mounted) - Specification",
        "year": 2004,
        "domain": "Mechanical",
        "scope": "Specifies requirements for portable and trolley-mounted carbon dioxide (CO2) fire extinguishers of capacities 2 kg, 3 kg, 4.5 kg, 6.8 kg, 9 kg, and 22.5 kg for Class B and electrical fire hazards.",
        "status": "current",
        "supersedes": ["IS 2878:1986"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2011, "description": "Gas cylinder testing in accordance with Gas Cylinder Rules (PESO)"}],
        "normative_references": ["IS 7285 (Seamless Steel Gas Cylinders)", "IS 15683:2018"],
        "test_methods": ["Hydrostatic pressure test (250 bar), discharge test (minimum 95% gas discharge within 30s)"],
        "safety_standards": ["PESO (Petroleum and Explosives Safety Organisation) approved cylinder"],
        "installation_standards": ["IS 2190:2010"],
        "related_standards": ["IS 15683:2018", "IS 2190:2010"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "extinguishing_agent": "pure carbon dioxide gas (CO2)",
            "capacity": ["2 kg", "3 kg", "4.5 kg", "6.8 kg", "9 kg", "22.5 kg"],
            "fire_rating": ["21B", "34B", "55B", "Electrical hazards"],
            "discharge_time": "10 to 30 seconds",
            "application": ["electrical server rooms", "substations", "control rooms", "flammable liquid storage", "laboratories"]
        },
        "keywords": ["co2 extinguisher", "carbon dioxide fire extinguisher", "electrical fire extinguisher", "fire safety", "server room extinguisher"]
    },

    # --- SAFETY & PERSONAL PROTECTIVE EQUIPMENT (PPE) ---
    {
        "id": "IS_15298_3_2019",
        "is_number": "IS 15298 (Part 3):2019",
        "title": "Personal Protective Equipment - Part 3: Protective Footwear",
        "year": 2019,
        "domain": "Safety/PPE",
        "scope": "Specifies basic and additional requirements for protective footwear with toe caps tested for 100 Joules impact resistance and 10 kN compression resistance.",
        "status": "current",
        "supersedes": ["IS 15298 (Part 3):2002"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 15298 (Part 1):2011"],
        "test_methods": ["100 J toe impact resistance, 10 kN compression, sole adhesion, slip resistance"],
        "safety_standards": ["Directorate General of Mines Safety (DGMS) / Factory Act"],
        "installation_standards": [],
        "related_standards": ["IS 15298 (Part 2):2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Footwear QCO"],
        "technical_parameters": {
            "impact_resistance": "100 Joules (Protective Footwear)",
            "compression_resistance": "10 kN",
            "features": ["slip resistant sole", "oil and chemical resistant", "penetration resistant midsole"],
            "application": ["warehouse workers", "logistics staff", "light manufacturing", "maintenance personnel"]
        },
        "keywords": ["protective footwear", "safety shoes 100j", "toe cap shoes", "industrial boots", "safety footwear", "foot protection"]
    },
    {
        "id": "IS_3521_2_2021",
        "is_number": "IS 3521 (Part 2):2021",
        "title": "Industrial Fall Arrest Systems - Part 2: Lanyards and Energy Absorbers",
        "year": 2021,
        "domain": "Safety/PPE",
        "scope": "Specifies requirements, test methods, instructions for use and marking for energy absorbers and lanyards used as connecting elements in personal fall arrest systems.",
        "status": "current",
        "supersedes": ["IS 3521:1999 (in part)"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 3521 (Part 1):2021"],
        "test_methods": ["Dynamic performance test (drop mass 100 kg with braking force < 6 kN), static strength test (min 15 kN)"],
        "safety_standards": ["OSHA / DGMS Height Safety Regulations"],
        "installation_standards": [],
        "related_standards": ["IS 3521 (Part 1):2021"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "lanyard_length": "up to 2.0 meters",
            "braking_force": "maximum 6 kN during arrest",
            "material": "polyamide / polyester webbing or kernmantle rope with shock absorber",
            "application": ["scaffolding work", "transmission tower erection", "structural steel erection", "facade maintenance"]
        },
        "keywords": ["shock absorber lanyard", "energy absorber", "safety lanyard", "fall arrest", "height safety", "safety harness lanyard"]
    },
    {
        "id": "IS_5983_1980",
        "is_number": "IS 5983:1980",
        "title": "Eye-Protectors - Specification",
        "year": 1980,
        "domain": "Safety/PPE",
        "scope": "Covers functional, optical and mechanical requirements for eye-protectors (safety spectacles, goggles, face shields) against mechanical impact, dust, liquid splash, and molten metals.",
        "status": "current",
        "supersedes": ["IS 5983:1971"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 1995, "description": "High velocity steel ball impact test and anti-fog lens coating criteria"}],
        "normative_references": ["IS 7524 (Part 1):1979"],
        "test_methods": ["Drop ball impact test, optical power/astigmatism test, flame resistance test"],
        "safety_standards": ["Factories Act 1948 Section 35"],
        "installation_standards": [],
        "related_standards": ["IS 8521 (Part 1):1977"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under PPE Quality Control Order"],
        "technical_parameters": {
            "lens_material": "polycarbonate / toughened mineral glass",
            "optical_class": "Class 1 (continuous work)",
            "impact_protection": "Grade 1 (high speed particle impact)",
            "application": ["welding", "grinding", "chemical handling", "construction site dust", "laboratory operations"]
        },
        "keywords": ["safety goggles", "eye protector", "safety glasses", "protective spectacles", "polycarbonate goggles", "eye protection"]
    },
    {
        "id": "IS_8521_1_1977",
        "is_number": "IS 8521 (Part 1):1977",
        "title": "Industrial Safety Face Shields with Plastic Visor - Specification",
        "year": 1977,
        "domain": "Safety/PPE",
        "scope": "Specifies requirements for industrial safety face shields fitted with transparent or shaded plastic visors to protect face, eyes, and neck against flying particles, sparks, and chemical splash.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 5983:1980"],
        "test_methods": ["Impact test with 6 mm steel ball, chemical penetration resistance, heat resistance"],
        "safety_standards": ["Factories Act Section 35"],
        "installation_standards": [],
        "related_standards": ["IS 5983:1980", "IS 2925:2024"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "visor_material": "polycarbonate / cellulose acetate",
            "thickness": "1.0 mm to 2.0 mm",
            "headband": "adjustable ratchet suspension",
            "application": ["metal grinding", "chemical decanting", "furnace inspection", "wood lathe work"]
        },
        "keywords": ["face shield", "safety visor", "industrial face shield", "grinding shield", "chemical face shield", "ppe face protection"]
    },
    {
        "id": "IS_15809_2017",
        "is_number": "IS 15809:2017",
        "title": "High Visibility Warning Clothes - Specification",
        "year": 2017,
        "domain": "Safety/PPE",
        "scope": "Specifies requirements for high visibility warning clothing capable of visually signaling the user's presence in daylight and under vehicle headlights in the dark.",
        "status": "current",
        "supersedes": ["IS 15809:2008"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/ISO 105", "IS/ISO 20471"],
        "test_methods": ["Photometric retroreflective coefficient test, color fastness to washing, dimensional stability"],
        "safety_standards": ["IRC:SP:55 (Guidelines on Traffic Management in Work Zones)"],
        "installation_standards": [],
        "related_standards": ["IS 2925:2024"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "class": ["Class 1", "Class 2", "Class 3 (Full body suit)"],
            "background_color": "fluorescent yellow-green / fluorescent orange-red",
            "retroreflective_tape_width": "minimum 50 mm",
            "application": ["highway construction workers", "traffic police", "railway track maintainers", "airport ground crew"]
        },
        "keywords": ["reflective jacket", "safety vest", "high visibility jacket", "hi vis vest", "reflective vest", "warning clothing"]
    },
    {
        "id": "IS_4770_1991",
        "is_number": "IS 4770:1991",
        "title": "Rubber Gloves for Electrical Purposes - Specification",
        "year": 1991,
        "domain": "Safety/PPE",
        "scope": "Covers requirements for insulating rubber gloves used for protection of electrical workers against electric shock during live line electrical work from 650 V up to 33 kV.",
        "status": "current",
        "supersedes": ["IS 4770:1968"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2002, "description": "Dielectric proof test voltage tables and leakage current limits"}],
        "normative_references": ["IS 3400 (Methods of test for vulcanized rubber)"],
        "test_methods": ["Proof voltage test in water bath (up to 40 kV AC), leakage current measurement (< 10 mA), tensile strength (> 14 MPa)"],
        "safety_standards": ["Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations"],
        "installation_standards": [],
        "related_standards": ["IS 3043:2018"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Electrical Safety QCO"],
        "technical_parameters": {
            "voltage_classes": ["Class 00 (500 V)", "Class 0 (1000 V)", "Class 1 (7.5 kV)", "Class 2 (17 kV)", "Class 3 (26.5 kV)", "Class 4 (36 kV)"],
            "material": "natural rubber latex / synthetic elastomer",
            "length": "355 mm to 410 mm (gauntlet style)",
            "application": ["substation maintenance", "live line lineman work", "transformer testing", "switchyard operations"]
        },
        "keywords": ["electrical gloves", "insulating gloves", "rubber gloves", "electrical safety gloves", "lineman gloves", "11kv gloves", "33kv gloves"]
    },

    # --- APPLIANCES & CONSUMER PRODUCTS ---
    {
        "id": "IS_1391_1_2017",
        "is_number": "IS 1391 (Part 1):2017",
        "title": "Room Air Conditioners - Part 1: Unitary Air Conditioners",
        "year": 2017,
        "domain": "Consumer/Appliances",
        "scope": "Specifies construction, rating and performance requirements for unitary (window type) room air conditioners with cooling capacity up to 10.5 kW (3 tons).",
        "status": "current",
        "supersedes": ["IS 1391 (Part 1):1992"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2021, "description": "Indian Seasonal Energy Efficiency Ratio (ISEER) calculation formula"}],
        "normative_references": ["IS 302 (Part 1):2008", "IS 10617"],
        "test_methods": ["Calorimeter room cooling capacity test, maximum operating condition test, freeze-up test, enclosure electrical safety"],
        "safety_standards": ["IS 302 (Part 1):2008"],
        "installation_standards": ["National Building Code HVAC Chapter"],
        "related_standards": ["IS 1391 (Part 2):2018"],
        "certification": ["BIS Scheme-I (ISI Mark) / BEE Mandatory Star Rating"],
        "technical_parameters": {
            "cooling_capacity": "1.0 Ton to 2.0 Ton (3.5 kW to 7.0 kW)",
            "energy_metric": "ISEER (BEE 3-Star to 5-Star)",
            "voltage": "230 V, 50 Hz single phase",
            "refrigerant": "R32 / R410A eco-friendly refrigerants",
            "application": ["office cabins", "residential rooms", "site porta cabins", "guard rooms"]
        },
        "keywords": ["window ac", "air conditioner", "unitary air conditioner", "room ac", "iseer", "bee star ac"]
    },
    {
        "id": "IS_1391_2_2018",
        "is_number": "IS 1391 (Part 2):2018",
        "title": "Room Air Conditioners - Part 2: Split Air Conditioners",
        "year": 2018,
        "domain": "Consumer/Appliances",
        "scope": "Specifies requirements for split type air conditioners consisting of an indoor fan-coil unit and outdoor condensing unit with cooling capacity up to 18 kW, including inverter and fixed speed types.",
        "status": "current",
        "supersedes": ["IS 1391 (Part 2):1992"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2022, "description": "Testing protocols for inverter variable speed air conditioners"}],
        "normative_references": ["IS 302 (Part 1):2008"],
        "test_methods": ["ISEER evaluation in psychrometric test room, sound level test, condensate disposal"],
        "safety_standards": ["IS 302 (Part 1):2008", "IS/ISO 5149 (Refrigerating safety)"],
        "installation_standards": [],
        "related_standards": ["IS 1391 (Part 1):2017"],
        "certification": ["BIS Scheme-I (ISI Mark) / BEE Mandatory Energy Labeling"],
        "technical_parameters": {
            "cooling_capacity": "1.0 Ton, 1.5 Ton, 2.0 Ton (3.5 kW to 7.2 kW)",
            "compressor_type": "inverter rotary / scroll compressor",
            "iseer_rating": "BEE 5-star (ISEER >= 5.0) or 3-star (ISEER >= 3.8)",
            "refrigerant": "R-32 / R-410A",
            "application": ["commercial offices", "conference rooms", "server rooms", "residential quarters"]
        },
        "keywords": ["split ac", "inverter ac", "air conditioner", "split air conditioner", "1.5 ton ac", "5 star ac", "iseer"]
    },
    {
        "id": "IS_15750_2006",
        "is_number": "IS 15750:2006",
        "title": "Household Frost-Free Refrigerating Appliances - Characteristics and Test Methods",
        "year": 2006,
        "domain": "Consumer/Appliances",
        "scope": "Specifies characteristics and test methods for household frost-free refrigerators, refrigerator-freezers and food freezers with automatic defrosting.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2014, "description": "Annual energy consumption calculation aligned with BEE Star labeling"}],
        "normative_references": ["IS 302 (Part 1):2008", "IS 1476 (Part 1):2000"],
        "test_methods": ["Energy consumption test at 32 C ambient, storage temperature test, freezing capacity, pull-down test"],
        "safety_standards": ["IS 302 (Part 2/Sec 24):1994 (Safety of refrigerators and freezers)"],
        "installation_standards": [],
        "related_standards": ["IS 1476 (Part 1):2000"],
        "certification": ["BIS Scheme-I (ISI Mark) / BEE Mandatory Energy Labeling"],
        "technical_parameters": {
            "appliance_type": "frost-free refrigerator-freezer",
            "storage_volume": "200 Litres to 600 Litres",
            "refrigerant": "R600a (isobutane eco-friendly)",
            "energy_efficiency": "BEE 3-Star to 5-Star rating",
            "application": ["residential pantry", "hospital laboratory sample storage", "canteen kitchen", "guest house"]
        },
        "keywords": ["frost free refrigerator", "refrigerator", "fridge", "freezer", "bee star refrigerator", "double door fridge"]
    },
    {
        "id": "IS_302_1_2008",
        "is_number": "IS 302 (Part 1):2008",
        "title": "Safety of Household and Similar Electrical Appliances - Part 1: General Requirements",
        "year": 2008,
        "domain": "Consumer/Appliances",
        "scope": "Deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase and 480 V for other appliances.",
        "status": "current",
        "supersedes": ["IS 302 (Part 1):1979"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2017, "description": "Electronic circuit protection and software safety validation"}],
        "normative_references": ["IS 3043:2018", "IS/IEC 60529:2001"],
        "test_methods": ["High voltage dielectric test (1250 V / 3750 V), leakage current test (< 0.75 mA), temperature rise test, mechanical hazard test"],
        "safety_standards": ["Core electrical appliance safety code for India"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS 2082:1993", "IS 1391 (Part 1):2017"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory umbrella standard for domestic electrical appliances"],
        "technical_parameters": {
            "rated_voltage": "230 V single phase / 415 V three phase",
            "insulation_classes": ["Class 0", "Class I (earthed)", "Class II (double insulated)", "Class III (SELV)"],
            "application": ["all domestic electrical appliances", "kitchen equipment", "office appliances"]
        },
        "keywords": ["electrical safety", "appliance safety", "isi safety mark", "insulation test", "household electrical safety"]
    },
    {
        "id": "IS_2082_1993",
        "is_number": "IS 2082:1993",
        "title": "Stationary Storage Type Electric Water Heaters - Specification",
        "year": 1993,
        "domain": "Consumer/Appliances",
        "scope": "Covers stationary non-pressure, cistern, and pressure storage type electric water heaters (geysers) for household and commercial hot water supplies.",
        "status": "current",
        "supersedes": ["IS 2082:1985"],
        "superseded_by": None,
        "amendments": [
            {"number": "Amendment 1", "year": 2000, "description": "Pressure safety relief valve requirements (up to 8 bar)"},
            {"number": "Amendment 2", "year": 2008, "description": "Standing loss energy efficiency limits aligned with BEE Star ratings"}
        ],
        "normative_references": ["IS 302 (Part 1):2008", "IS 302 (Part 2/Sec 21):2011"],
        "test_methods": ["Hydrostatic pressure test (1.2 MPa for tank), standing loss test (kWh/24h), thermostat cut-off test"],
        "safety_standards": ["Pressure relief valve, thermal cut-out, thermostat double protection"],
        "installation_standards": ["IS 2065:1983"],
        "related_standards": ["IS 302 (Part 1):2008"],
        "certification": ["BIS Scheme-I (ISI Mark) / BEE Mandatory Star Rating"],
        "technical_parameters": {
            "tank_capacity": "6 Litres, 10 Litres, 15 Litres, 25 Litres, 50 Litres",
            "heating_element": "2 kW / 3 kW copper or stainless steel tubular element",
            "rated_pressure": "up to 8 bar (0.8 MPa) for high-rise buildings",
            "standing_loss": "BEE 5-star energy efficient insulation",
            "application": ["bathrooms", "hostel hot water", "hospital utility", "commercial kitchens"]
        },
        "keywords": ["water heater", "geyser", "storage water heater", "electric geyser", "bee star geyser", "hot water geyser"]
    }
]

# Generate chunks for new standards
for ns in new_standards:
    ns["chunks"] = create_structured_chunks(ns)

# Combine datasets
combined_standards = existing_standards + new_standards
print(f"Combined total: {len(combined_standards)} standards.")

# Save updated standards.json
with open("data/standards.json", "w", encoding="utf-8") as f:
    json.dump(combined_standards, f, indent=2, ensure_ascii=False)

print("Saved updated data/standards.json.")

# Rebuild relationships.json with edges from all standards
relationships = []
edge_set = set()

for std in combined_standards:
    s_id = std["id"]
    # Normative
    for ref in std.get("normative_references", []):
        key = (s_id, ref, "normative")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "normative",
                "label": "Normative Reference",
                "description": f"Mandatory technical standard cited by {std['is_number']}"
            })
    # Testing
    for ref in std.get("test_methods", []):
        key = (s_id, ref, "testing")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "testing",
                "label": "Testing Method",
                "description": f"Compliance and test procedure standard for {std['is_number']}"
            })
    # Safety
    for ref in std.get("safety_standards", []):
        key = (s_id, ref, "safety")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "safety",
                "label": "Safety Standard",
                "description": f"Mandatory safety or hazard protection code referenced by {std['is_number']}"
            })
    # Installation
    for ref in std.get("installation_standards", []):
        key = (s_id, ref, "installation")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "installation",
                "label": "Installation Code",
                "description": f"Installation, maintenance or commissioning code for {std['is_number']}"
            })
    # Related products
    for ref in std.get("related_standards", []):
        key = (s_id, ref, "related")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "related",
                "label": "Related Product",
                "description": f"Related product, complementary standard or parent specification"
            })
    # Supersedes
    for ref in std.get("supersedes", []):
        key = (s_id, ref, "supersedes")
        if key not in edge_set:
            edge_set.add(key)
            relationships.append({
                "source_id": s_id,
                "target_id": ref,
                "relationship_type": "supersedes",
                "label": "Supersedes",
                "description": f"{std['is_number']} supersedes older standard {ref}"
            })

print(f"Generated {len(relationships)} directed relationship edges.")
with open("data/relationships.json", "w", encoding="utf-8") as f:
    json.dump(relationships, f, indent=2, ensure_ascii=False)

# Compute both full-standard embeddings AND chunk-level embeddings
print("Pre-computing embeddings using sentence-transformers/all-MiniLM-L6-v2...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# 1. Full standard text embeddings (for baseline and backward compatibility)
full_texts = []
for std in combined_standards:
    params_str = " ".join(f"{k} {v}" for k, v in std.get("technical_parameters", {}).items())
    text = (
        f"{std['is_number']} {std['title']} {std['domain']} {std['scope']} "
        f"{params_str} {' '.join(std.get('keywords', []))} "
        f"{' '.join(std.get('normative_references', []))} {' '.join(std.get('test_methods', []))}"
    )
    full_texts.append(text)

full_embeddings = model.encode(full_texts, normalize_embeddings=True)
np.save("data/standards_embeddings.npy", full_embeddings)
print(f"Saved full embeddings shape {full_embeddings.shape} to data/standards_embeddings.npy.")

# 2. Structured chunk-level embeddings
chunk_texts = []
chunk_standard_indices = []
chunk_types = []

chunk_order = ["scope", "key_requirements", "technical_parameters", "applications", "testing_methods", "safety_criteria", "normative_references"]

for idx, std in enumerate(combined_standards):
    chunks = std.get("chunks", {})
    for c_type in chunk_order:
        c_text = chunks.get(c_type, "")
        if c_text:
            chunk_texts.append(c_text)
            chunk_standard_indices.append(idx)
            chunk_types.append(c_type)

chunk_embeddings = model.encode(chunk_texts, normalize_embeddings=True)
np.savez_compressed(
    "data/standards_chunk_embeddings.npz",
    embeddings=chunk_embeddings,
    standard_indices=np.array(chunk_standard_indices),
    chunk_types=np.array(chunk_types)
)
print(f"Saved {len(chunk_texts)} chunk embeddings (shape {chunk_embeddings.shape}) to data/standards_chunk_embeddings.npz.")
print("Dataset build complete!")
