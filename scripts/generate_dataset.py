import json
import os

os.makedirs("data", exist_ok=True)

standards = [
    # --- ELECTRICAL: MOTORS & ROTATING MACHINES ---
    {
        "id": "IS_12615_2018",
        "is_number": "IS 12615:2018",
        "title": "Line Operated Three-Phase AC Motors (IE Code) - Energy Efficient Induction Motors - Specification",
        "year": 2018,
        "domain": "Electrical",
        "scope": "Covers performance, energy efficiency classes (IE2, IE3, IE4), dimensions, and ratings for line operated three-phase squirrel cage induction motors from 0.12 kW up to 1000 kW for voltages up to 1000 V and 50 Hz.",
        "status": "current",
        "supersedes": ["IS 325:1996", "IS 12615:2011"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 1",
                "year": 2021,
                "description": "Revision of tolerance on efficiency values for IE3 and IE4 motors and updated reference to IS 15999."
            },
            {
                "number": "Amendment 2",
                "year": 2023,
                "description": "Clarification on test certificate requirements and marking on nameplate."
            }
        ],
        "normative_references": ["IS/IEC 60034-1:2004", "IS/IEC 60034-5:2000", "IS/IEC 60034-8:2002", "IS 1231:1974"],
        "test_methods": ["IS 15999 (Part 2/Sec 1):2015"],
        "safety_standards": ["IS/IEC 60034-5:2000", "IS 3043:2018"],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS/IEC 60947-4-1:2012", "IS 12615:2011"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Electrical Motors Quality Control Order (QCO)"],
        "technical_parameters": {
            "equipment_type": "three-phase induction motor",
            "phase": "three-phase",
            "power_range": "0.12 kW to 1000 kW",
            "voltage_range": "up to 1000 V (typically 415 V)",
            "frequency": "50 Hz",
            "efficiency_class": ["IE2", "IE3", "IE4"],
            "ip_rating": ["IP55", "IP56", "IP65", "IP66"],
            "application": ["industrial", "continuous duty", "manufacturing", "pumps", "fans", "compressors"]
        },
        "keywords": ["induction motor", "three phase", "415v", "50hz", "electric motor", "squirrel cage", "energy efficiency", "ie3", "ie2", "industrial motor", "ip55", "kw"]
    },
    {
        "id": "IS_325_1996",
        "is_number": "IS 325:1996",
        "title": "Three-Phase Induction Motors - Specification",
        "year": 1996,
        "domain": "Electrical",
        "scope": "Covers three-phase induction motors for voltages up to and including 11 000 V. Note: For line operated energy efficient motors, this standard has been superseded by IS 12615.",
        "status": "superseded",
        "supersedes": [],
        "superseded_by": "IS 12615:2018",
        "amendments": [
            {
                "number": "Amendment 1",
                "year": 2002,
                "description": "Supersession notice advising procurement agencies to specify IS 12615 for energy efficiency."
            }
        ],
        "normative_references": ["IS 1231:1974", "IS 4722:1968"],
        "test_methods": ["IS 4029:2010"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS 12615:2018"],
        "certification": ["Superseded - New ISI licenses issued under IS 12615"],
        "technical_parameters": {
            "equipment_type": "three-phase induction motor",
            "phase": "three-phase",
            "voltage_range": "415 V to 11000 V",
            "application": ["general purpose", "industrial"]
        },
        "keywords": ["is 325", "induction motor", "three phase motor", "superseded motor standard"]
    },
    {
        "id": "IS_15999_Part2_Sec1_2015",
        "is_number": "IS 15999 (Part 2/Sec 1):2015",
        "title": "Rotating Electrical Machines - Part 2: Methods for Determining Losses and Efficiency from Tests (Excluding Machines for Traction Vehicles)",
        "year": 2015,
        "domain": "Electrical",
        "scope": "Applies to rotating electrical machines and specifies test procedures and precision methods for determining losses and efficiency from test results.",
        "status": "current",
        "supersedes": ["IS 4029:2010"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 60034-1:2004"],
        "test_methods": ["IS 15999 (Part 2/Sec 1):2015"],
        "safety_standards": [],
        "installation_standards": [],
        "related_standards": ["IS 12615:2018"],
        "certification": ["Referenced test method for BIS accreditation & BEE star rating"],
        "technical_parameters": {
            "test_type": "efficiency and loss determination",
            "applicable_equipment": "rotating electrical machines, motors, generators"
        },
        "keywords": ["efficiency test", "motor loss", "dynamometer test", "calibrated machine test", "induction motor testing"]
    },
    {
        "id": "IS_IEC_60034_1_2004",
        "is_number": "IS/IEC 60034-1:2004",
        "title": "Rotating Electrical Machines - Part 1: Rating and Performance",
        "year": 2004,
        "domain": "Electrical",
        "scope": "Applies to all rotating electrical machines except those covered by other IEC/IS standards. Specifies duty types (S1 to S9), thermal class, temperature rise limits, and electrical ratings.",
        "status": "current",
        "supersedes": ["IS 4722:1992"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": [],
        "test_methods": ["IS 15999 (Part 2/Sec 1):2015"],
        "safety_standards": ["IS/IEC 60034-5:2000"],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS 12615:2018"],
        "certification": ["Foundational standard for motor manufacturing"],
        "technical_parameters": {
            "duty_cycle": ["S1", "S2", "S3", "S4"],
            "insulation_class": ["Class B", "Class F", "Class H"],
            "temperature_rise": "80K to 105K"
        },
        "keywords": ["duty type s1", "class f insulation", "motor rating", "temperature rise", "rotating machine"]
    },
    {
        "id": "IS_IEC_60034_5_2000",
        "is_number": "IS/IEC 60034-5:2000",
        "title": "Degrees of Protection Provided by the Integral Design of Rotating Electrical Machines (IP Code) - Classification",
        "year": 2000,
        "domain": "Electrical",
        "scope": "Defines the requirements for protective enclosures of rotating electrical machines, defining IP ratings for protection of persons against contact with live parts and ingress of water and solid foreign objects.",
        "status": "current",
        "supersedes": ["IS 4691:1985"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": [],
        "test_methods": ["IS/IEC 60529:2001"],
        "safety_standards": ["IS/IEC 60034-5:2000"],
        "installation_standards": [],
        "related_standards": ["IS 12615:2018"],
        "certification": ["Ingress protection compliance requirement"],
        "technical_parameters": {
            "protection_classes": ["IP44", "IP54", "IP55", "IP56", "IP65", "IP66"]
        },
        "keywords": ["ip code", "ip55", "ip65", "ingress protection", "enclosure protection", "dust protection", "water protection"]
    },
    {
        "id": "IS_1231_1974",
        "is_number": "IS 1231:1974",
        "title": "Dimensions of Three-Phase Foot-Mounted Induction Motors",
        "year": 1974,
        "domain": "Electrical",
        "scope": "Specifies frame dimensions, shaft extensions, and keyways for foot-mounted three-phase induction motors from frame size 56 to 315M.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 3", "year": 2012, "description": "Alignment with IEC frame sizes"}],
        "normative_references": [],
        "test_methods": [],
        "safety_standards": [],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS 12615:2018"],
        "certification": [],
        "technical_parameters": {
            "mounting": "foot mounted B3",
            "frame_sizes": "56 to 355"
        },
        "keywords": ["foot mounted", "motor frame", "shaft dimension", "flange mounted"]
    },
    {
        "id": "IS_900_1992",
        "is_number": "IS 900:1992",
        "title": "Code of Practice for Installation and Maintenance of Induction Motors",
        "year": 1992,
        "domain": "Electrical",
        "scope": "Provides guidelines on the selection, foundation, alignment, electrical wiring, earthing, commissioning, and preventive maintenance of induction motors.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 3043:2018", "IS 732:2019"],
        "test_methods": [],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 900:1992"],
        "related_standards": ["IS 12615:2018"],
        "certification": [],
        "technical_parameters": {
            "domain": "motor installation and maintenance"
        },
        "keywords": ["motor installation", "motor alignment", "maintenance", "earthing of motors"]
    },

    # --- ELECTRICAL: TRANSFORMERS ---
    {
        "id": "IS_1180_Part1_2014",
        "is_number": "IS 1180 (Part 1):2014",
        "title": "Outdoor Type Oil Immersed Distribution Transformers Up to and Including 2500 kVA, 33 kV - Specification",
        "year": 2014,
        "domain": "Electrical",
        "scope": "Specifies standard ratings, maximum allowable losses (Standard loss levels 1, 2, 3), performance, fittings, and testing for mineral oil immersed distribution transformers up to 2500 kVA, 33 kV.",
        "status": "current",
        "supersedes": ["IS 1180 (Part 1):1989", "IS 1180 (Part 2):1989"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 1",
                "year": 2016,
                "description": "Mandatory BEE Star Rating loss levels alignment and dielectric fluid options."
            },
            {
                "number": "Amendment 4",
                "year": 2021,
                "description": "Updated short-circuit withstand test protocols and temperature rise limits."
            }
        ],
        "normative_references": ["IS 2026 (Part 1):2011", "IS 335:2018", "IS 2099:1986"],
        "test_methods": ["IS 2026 (Part 1 to 5):2011"],
        "safety_standards": ["IS 3043:2018", "IS 10028 (Part 1 to 3):1985"],
        "installation_standards": ["IS 10028 (Part 2):1981"],
        "related_standards": ["IS 2026:2011", "IS 335:2018"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Transformers QCO"],
        "technical_parameters": {
            "equipment_type": "distribution transformer",
            "capacity": "up to 2500 kVA",
            "voltage_rating": "11 kV, 22 kV, 33 kV / 433 V",
            "cooling_type": "ONAN (Oil Natural Air Natural)",
            "phase": "three-phase"
        },
        "keywords": ["distribution transformer", "oil immersed", "11kv", "33kv", "kva", "transformer losses", "bee star rating", "step down transformer"]
    },
    {
        "id": "IS_2026_Part1_2011",
        "is_number": "IS 2026 (Part 1):2011",
        "title": "Power Transformers - Part 1: General",
        "year": 2011,
        "domain": "Electrical",
        "scope": "Applies to three-phase and single-phase power transformers (including auto-transformers). Specifies ratings, cooling methods, tap changers, temperature rise, and tolerances.",
        "status": "current",
        "supersedes": ["IS 2026 (Part 1):1977"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 335:2018", "IS 2099:1986"],
        "test_methods": ["IS 2026 (Part 1 to 5):2011"],
        "safety_standards": ["IS 10028:1985"],
        "installation_standards": ["IS 10028:1985"],
        "related_standards": ["IS 1180 (Part 1):2014"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "equipment_type": "power transformer",
            "capacity": "above 2500 kVA, up to 765 kV",
            "cooling_type": ["ONAN", "ONAF", "OFAF", "OFWF"]
        },
        "keywords": ["power transformer", "substation transformer", "high voltage transformer", "tap changer", "mva"]
    },
    {
        "id": "IS_335_2018",
        "is_number": "IS 335:2018",
        "title": "New Insulating Oils - Specification",
        "year": 2018,
        "domain": "Electrical",
        "scope": "Specifies physical, chemical, and electrical requirements and test methods for unused mineral insulating oils as delivered, for use in transformers, switchgear and similar electrical equipment.",
        "status": "current",
        "supersedes": ["IS 335:1993", "IS 12463:1988"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2020, "description": "Inclusion of inhibited oil specifications"}],
        "normative_references": ["IS 6792:1992"],
        "test_methods": ["IS 6792:1992", "IS 6103:1971"],
        "safety_standards": [],
        "installation_standards": [],
        "related_standards": ["IS 1180 (Part 1):2014", "IS 2026 (Part 1):2011"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Mineral Oil QCO"],
        "technical_parameters": {
            "dielectric_strength": "> 30 kV (untreated) / > 70 kV (treated)",
            "viscosity": "< 12 mm2/s at 40 deg C",
            "flash_point": "> 135 deg C"
        },
        "keywords": ["transformer oil", "insulating oil", "dielectric fluid", "breakdown voltage", "mineral oil"]
    },

    # --- ELECTRICAL: CABLES & WIRING ---
    {
        "id": "IS_694_2010",
        "is_number": "IS 694:2010",
        "title": "Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords with Rigid and Flexible Conductor for Rated Voltages Up to and Including 450/750 V",
        "year": 2010,
        "domain": "Electrical",
        "scope": "Covers copper and aluminium conductor PVC insulated building wires, domestic and industrial single and multi-core cables up to 1100 V working voltage.",
        "status": "current",
        "supersedes": ["IS 694:1990"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 2",
                "year": 2017,
                "description": "Incorporation of FRLS (Flame Retardant Low Smoke) and halogen free conductor specifications."
            }
        ],
        "normative_references": ["IS 8130:2013", "IS 5831:1984"],
        "test_methods": ["IS 10810:1984"],
        "safety_standards": ["IS 732:2019", "IS 3043:2018"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS 7098 (Part 1):1988", "IS 1554 (Part 1):1988"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Wires & Cables QCO"],
        "technical_parameters": {
            "equipment_type": "pvc insulated cable / wire",
            "voltage_rating": "up to 1100 V (450/750 V)",
            "conductor_material": ["copper", "aluminium"],
            "insulation": "PVC type A / FRLS",
            "cross_section": "0.5 sq mm to 630 sq mm"
        },
        "keywords": ["pvc wire", "house wiring", "building cable", "frls cable", "copper wire", "single core cable", "flexible cable", "1100v"]
    },
    {
        "id": "IS_7098_Part1_1988",
        "is_number": "IS 7098 (Part 1):1988",
        "title": "Crosslinked Polyethylene Insulated Thermoplastic Sheathed Cables - Part 1: For Working Voltages Up to and Including 1100 V",
        "year": 1988,
        "domain": "Electrical",
        "scope": "Specifies construction, dimensions and test requirements for single, twin, three, three and a half and multi-core XLPE insulated power and control cables for working voltages up to 1100 V.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 4",
                "year": 2018,
                "description": "Enhanced smoke density and acid gas generation tests for FRLSH grade cables."
            }
        ],
        "normative_references": ["IS 8130:2013", "IS 3975:1999"],
        "test_methods": ["IS 10810:1984"],
        "safety_standards": ["IS 1255:1983"],
        "installation_standards": ["IS 1255:1983"],
        "related_standards": ["IS 7098 (Part 2):2011", "IS 694:2010"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "insulation": "XLPE",
            "voltage_rating": "1.1 kV (1100 V)",
            "armouring": ["armoured (strip/wire)", "unarmoured"],
            "max_conductor_temp": "90 deg C continuous, 250 deg C short circuit"
        },
        "keywords": ["xlpe cable", "armoured cable", "power cable", "1.1 kv cable", "underground cable", "lt cable"]
    },
    {
        "id": "IS_7098_Part2_2011",
        "is_number": "IS 7098 (Part 2):2011",
        "title": "Crosslinked Polyethylene Insulated Thermoplastic Sheathed Cables - Part 2: For Working Voltages from 3.3 kV Up to and Including 33 kV",
        "year": 2011,
        "domain": "Electrical",
        "scope": "Specifies requirements for XLPE insulated screened armoured or unarmoured electric power cables for working voltages from 3.3 kV up to and including 33 kV.",
        "status": "current",
        "supersedes": ["IS 7098 (Part 2):1985"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2019, "description": "Updated partial discharge limits and tree-retardant XLPE requirements"}],
        "normative_references": ["IS 8130:2013", "IS 3975:1999"],
        "test_methods": ["IS 10810:1984"],
        "safety_standards": ["IS 1255:1983"],
        "installation_standards": ["IS 1255:1983"],
        "related_standards": ["IS 7098 (Part 1):1988"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "voltage_rating": "3.3 kV, 6.6 kV, 11 kV, 22 kV, 33 kV",
            "insulation": "XLPE / TR-XLPE",
            "screening": "extruded semi-conducting screen + copper tape screen"
        },
        "keywords": ["ht cable", "11kv cable", "33kv cable", "high tension cable", "medium voltage cable", "xlpe armoured"]
    },
    {
        "id": "IS_3043_2018",
        "is_number": "IS 3043:2018",
        "title": "Code of Practice for Earthing",
        "year": 2018,
        "domain": "Electrical",
        "scope": "Comprehensive Indian Standard for the design, sizing, installation, and testing of electrical grounding and earthing systems (TT, TN, IT systems), earth electrodes, and earth pits for substations, industrial plants, and buildings.",
        "status": "current",
        "supersedes": ["IS 3043:1987"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 732:2019"],
        "test_methods": ["IS 3043:2018"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 3043:2018"],
        "related_standards": ["IS 732:2019", "IS/IEC 62305:2010"],
        "certification": ["Mandatory National Electrical Code (NEC) compliance standard"],
        "technical_parameters": {
            "earth_resistance": "< 1 Ohm for substations, < 5 Ohm for installations",
            "electrode_types": ["pipe electrode", "plate electrode", "rod electrode", "chemical earthing"]
        },
        "keywords": ["earthing", "grounding", "earth pit", "earth electrode", "gi earthing pipe", "copper earth plate", "earth resistance"]
    },
    {
        "id": "IS_732_2019",
        "is_number": "IS 732:2019",
        "title": "Code of Practice for Electrical Wiring Installations",
        "year": 2019,
        "domain": "Electrical",
        "scope": "Covers design, selection, erection, inspection and testing of electrical wiring installations in buildings up to 1000 V AC.",
        "status": "current",
        "supersedes": ["IS 732:1989"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 3043:2018", "IS 694:2010", "IS/IEC 60947-2:2016"],
        "test_methods": ["IS 732:2019"],
        "safety_standards": ["IS 3043:2018", "IS 732:2019"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS 3043:2018", "IS 694:2010"],
        "certification": ["National Building Code & Central Electricity Authority mandatory standard"],
        "technical_parameters": {
            "voltage": "up to 1000 V AC",
            "wiring_methods": ["conduit wiring", "surface wiring", "cable trays"]
        },
        "keywords": ["building wiring", "electrical installation", "internal wiring", "conduit wiring", "switchboard wiring"]
    },

    # --- ELECTRICAL: SWITCHGEAR & PROTECTION ---
    {
        "id": "IS_IEC_60947_2_2016",
        "is_number": "IS/IEC 60947-2:2016",
        "title": "Low-Voltage Switchgear and Controlgear - Part 2: Circuit-Breakers",
        "year": 2016,
        "domain": "Electrical",
        "scope": "Specifies characteristics of circuit-breakers (MCCB, ACB) intended for use in electrical installations up to 1000 V AC or 1500 V DC, including short-circuit breaking capacities (Icu, Ics).",
        "status": "current",
        "supersedes": ["IS 13947 (Part 2):1993"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2020, "description": "Updated electronic trip unit test procedures"}],
        "normative_references": ["IS/IEC 60947-1:2007"],
        "test_methods": ["IS/IEC 60947-2:2016"],
        "safety_standards": ["IS/IEC 60947-2:2016"],
        "installation_standards": ["IS 8623 (Part 1):1993"],
        "related_standards": ["IS/IEC 60898-1:2002", "IS/IEC 60947-4-1:2012"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Low Voltage Switchgear QCO"],
        "technical_parameters": {
            "current_range": "16 A up to 6300 A",
            "voltage": "415 V AC",
            "breaker_types": ["MCCB", "ACB", "Air Circuit Breaker", "Moulded Case Circuit Breaker"],
            "breaking_capacity": "16 kA to 100 kA"
        },
        "keywords": ["mccb", "acb", "circuit breaker", "moulded case circuit breaker", "short circuit protection", "overload release", "switchgear"]
    },
    {
        "id": "IS_IEC_60898_1_2002",
        "is_number": "IS/IEC 60898-1:2002",
        "title": "Electrical Accessories - Circuit-Breakers for Overcurrent Protection for Household and Similar Installations - Part 1: Circuit-Breakers for A.C. Operation",
        "year": 2002,
        "domain": "Electrical",
        "scope": "Applies to a.c. air-break miniature circuit-breakers (MCBs) for operation at 50 Hz, with a rated voltage not exceeding 440 V, rated current not exceeding 125 A and rated short-circuit capacity not exceeding 25 000 A.",
        "status": "current",
        "supersedes": ["IS 8828:1996"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2018, "description": "Type B, C, D tripping curve alignments"}],
        "normative_references": [],
        "test_methods": ["IS/IEC 60898-1:2002"],
        "safety_standards": ["IS/IEC 60898-1:2002"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS/IEC 60947-2:2016", "IS 12640 (Part 1):2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Circuit Breakers QCO"],
        "technical_parameters": {
            "current_rating": "0.5 A to 125 A",
            "breaking_capacity": "6 kA, 10 kA",
            "tripping_characteristics": ["B curve", "C curve", "D curve"],
            "poles": ["SP", "DP", "TP", "FP"]
        },
        "keywords": ["mcb", "miniature circuit breaker", "distribution board", "c curve mcb", "10ka mcb", "household circuit breaker"]
    },
    {
        "id": "IS_12640_Part1_2016",
        "is_number": "IS 12640 (Part 1):2016",
        "title": "Residual Current Operated Circuit-Breakers Without Integral Overcurrent Protection for Household and Similar Uses (RCCBs) - Part 1: General Rules",
        "year": 2016,
        "domain": "Electrical",
        "scope": "Specifies residual current circuit breakers (RCCB/ELCB) for protection against electric shock and earth leakage currents (30 mA, 100 mA, 300 mA) for rated voltages up to 440 V AC.",
        "status": "current",
        "supersedes": ["IS 12640 (Part 1):2000"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 60898-1:2002"],
        "test_methods": ["IS 12640 (Part 1):2016"],
        "safety_standards": ["IS 12640 (Part 1):2016", "IS 3043:2018"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS/IEC 60898-1:2002"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under RCCB QCO"],
        "technical_parameters": {
            "residual_current": ["30 mA", "100 mA", "300 mA"],
            "current_rating": "16 A to 100 A",
            "tripping_time": "< 40 ms at 5 I_delta_n"
        },
        "keywords": ["rccb", "elcb", "residual current breaker", "earth leakage protection", "electric shock protection", "30ma rccb"]
    },

    # --- CIVIL & STRUCTURAL: CEMENT & CONCRETE ---
    {
        "id": "IS_456_2000",
        "is_number": "IS 456:2000",
        "title": "Plain and Reinforced Concrete - Code of Practice",
        "year": 2000,
        "domain": "Civil",
        "scope": "The primary Indian Standard for design and construction of plain and reinforced concrete structures in general building and civil engineering construction. Specifies concrete grades (M20, M25, M30 to M80), water-cement ratios, durability, reinforcement detailing, and limit state design.",
        "status": "current",
        "supersedes": ["IS 456:1978"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 3",
                "year": 2007,
                "description": "Inclusion of mineral admixtures (fly ash, silica fume, GGBS) and high strength concrete grades."
            },
            {
                "number": "Amendment 5",
                "year": 2019,
                "description": "Revision of tensile design parameters, cover requirements, and rebar grades (Fe 550D, Fe 600)."
            }
        ],
        "normative_references": ["IS 269:2015", "IS 1489 (Part 1):2015", "IS 1786:2008", "IS 383:2016", "IS 10262:2019"],
        "test_methods": ["IS 516 (Part 1/Sec 1):2021", "IS 1199 (Part 1):2018"],
        "safety_standards": ["IS 456:2000"],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 1786:2008", "IS 13920:2016", "IS 875 (Part 1 to 5):1987"],
        "certification": ["National Building Code core standard"],
        "technical_parameters": {
            "concrete_grades": ["M20", "M25", "M30", "M35", "M40", "M50"],
            "max_water_cement_ratio": "0.40 to 0.55 depending on exposure (Mild, Moderate, Severe, Extreme)",
            "minimum_cement_content": "300 to 360 kg/m3"
        },
        "keywords": ["reinforced concrete", "rcc design", "plain concrete", "m25 concrete", "m30 concrete", "water cement ratio", "durability", "limit state design", "is 456"]
    },
    {
        "id": "IS_1786_2008",
        "is_number": "IS 1786:2008",
        "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement - Specification (TMT Steel Rebars)",
        "year": 2008,
        "domain": "Civil",
        "scope": "Specifies physical, chemical and mechanical properties for thermo-mechanically treated (TMT) steel bars and wires of grades Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600 used as reinforcement in concrete structures.",
        "status": "current",
        "supersedes": ["IS 1786:1985"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 3",
                "year": 2017,
                "description": "Introduction of Fe 650 and Fe 700 high strength grades and stringent elongation limits for seismic zones."
            }
        ],
        "normative_references": ["IS 2062:2011", "IS 228:1987"],
        "test_methods": ["IS 1608 (Part 1):2018", "IS 1599:2019"],
        "safety_standards": ["IS 13920:2016"],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 456:2000", "IS 13920:2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Steel & Steel Products QCO"],
        "technical_parameters": {
            "grades": ["Fe 415", "Fe 415D", "Fe 500", "Fe 500D", "Fe 550", "Fe 550D"],
            "yield_strength": "415 to 600 N/mm2",
            "elongation": "minimum 14.5% to 16% for 'D' grades",
            "diameters": "8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm"
        },
        "keywords": ["tmt bars", "steel rebars", "fe 500d", "fe 550d", "reinforcement steel", "concrete reinforcement", "deformed bars", "rebar", "yield strength"]
    },
    {
        "id": "IS_269_2015",
        "is_number": "IS 269:2015",
        "title": "Ordinary Portland Cement - Specification (33 Grade, 43 Grade and 53 Grade)",
        "year": 2015,
        "domain": "Civil",
        "scope": "Comprehensive standard covering 33, 43, and 53 Grade Ordinary Portland Cement (OPC), consolidating earlier separate standards IS 269:1989 (33G), IS 8112:1989 (43G) and IS 12269:1987 (53G).",
        "status": "current",
        "supersedes": ["IS 8112:1989", "IS 12269:1987", "IS 269:1989"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2021, "description": "Revision of permissible chloride content and bag packaging limits"}],
        "normative_references": ["IS 4031 (Part 1 to 15):1988", "IS 4032:1985"],
        "test_methods": ["IS 4031 (Part 6):1988", "IS 4031 (Part 5):1988"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 1489 (Part 1):2015", "IS 456:2000"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Cement QCO"],
        "technical_parameters": {
            "grades": ["OPC 33", "OPC 43", "OPC 53"],
            "compressive_strength_28day": "33 MPa, 43 MPa, 53 MPa minimum",
            "initial_setting_time": "not less than 30 minutes",
            "final_setting_time": "not more than 600 minutes",
            "soundness": "Le Chatelier expansion not more than 10 mm"
        },
        "keywords": ["opc 43", "opc 53", "ordinary portland cement", "opc cement", "compressive strength cement", "setting time cement", "clinker"]
    },
    {
        "id": "IS_8112_1989",
        "is_number": "IS 8112:1989",
        "title": "43 Grade Ordinary Portland Cement - Specification",
        "year": 1989,
        "domain": "Civil",
        "scope": "Covers manufacture and chemical and physical requirements of 43 Grade Ordinary Portland Cement. Note: This standard has been superseded by IS 269:2015 which unifies all OPC grades.",
        "status": "superseded",
        "supersedes": [],
        "superseded_by": "IS 269:2015",
        "amendments": [],
        "normative_references": ["IS 4031:1988"],
        "test_methods": ["IS 4031:1988"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 269:2015"],
        "certification": ["Superseded standard - Procurement must cite IS 269:2015"],
        "technical_parameters": {
            "grade": "43 Grade OPC"
        },
        "keywords": ["is 8112", "opc 43 grade", "superseded cement standard"]
    },
    {
        "id": "IS_12269_1987",
        "is_number": "IS 12269:1987",
        "title": "53 Grade Ordinary Portland Cement - Specification",
        "year": 1987,
        "domain": "Civil",
        "scope": "Covers manufacture and chemical and physical requirements of 53 Grade Ordinary Portland Cement. Note: Superseded by unified IS 269:2015.",
        "status": "superseded",
        "supersedes": [],
        "superseded_by": "IS 269:2015",
        "amendments": [],
        "normative_references": ["IS 4031:1988"],
        "test_methods": ["IS 4031:1988"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 269:2015"],
        "certification": ["Superseded standard - Procurement must cite IS 269:2015"],
        "technical_parameters": {
            "grade": "53 Grade OPC"
        },
        "keywords": ["is 12269", "opc 53 grade", "superseded 53 grade cement"]
    },
    {
        "id": "IS_1489_Part1_2015",
        "is_number": "IS 1489 (Part 1):2015",
        "title": "Portland Pozzolana Cement - Specification - Part 1: Fly Ash Based",
        "year": 2015,
        "domain": "Civil",
        "scope": "Specifies manufacturing, chemical and physical requirements for fly ash based Portland Pozzolana Cement (PPC) containing 15% to 35% pozzolana for high durability, marine and general construction.",
        "status": "current",
        "supersedes": ["IS 1489 (Part 1):1991"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2021, "description": "Eco-label criteria and packaging standard update"}],
        "normative_references": ["IS 4031:1988", "IS 3812 (Part 1):2013"],
        "test_methods": ["IS 4031 (Part 6):1988", "IS 4031 (Part 5):1988"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 269:2015", "IS 456:2000"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Cement QCO"],
        "technical_parameters": {
            "cement_type": "PPC (Portland Pozzolana Cement)",
            "pozzolana_percentage": "15% to 35% fly ash",
            "compressive_strength": "33 MPa minimum at 28 days",
            "fineness": "not less than 300 m2/kg"
        },
        "keywords": ["ppc cement", "portland pozzolana cement", "fly ash cement", "blended cement", "hydraulic cement", "marine concrete"]
    },
    {
        "id": "IS_383_2016",
        "is_number": "IS 383:2016",
        "title": "Coarse and Fine Aggregate for Concrete - Specification",
        "year": 2016,
        "domain": "Civil",
        "scope": "Covers chemical and physical requirements for coarse aggregates, natural sand, crushed stone sand, manufactured sand (M-sand), and recycled concrete aggregate (RCA) for concrete.",
        "status": "current",
        "supersedes": ["IS 383:1970"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2019, "description": "Enhanced limits for alkali-silica reactivity and recycled aggregate utilization"}],
        "normative_references": ["IS 2386 (Part 1 to 8):1963"],
        "test_methods": ["IS 2386 (Part 1 to 8):1963"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 456:2000", "IS 10262:2019"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "aggregate_types": ["coarse aggregate", "fine aggregate", "m-sand", "gravel"],
            "particle_shape": ["flakiness index < 35%", "elongation index"],
            "impact_value": "< 45% for concrete, < 30% for wearing surfaces"
        },
        "keywords": ["coarse aggregate", "fine aggregate", "sand", "m-sand", "crushed stone", "concrete aggregate", "flakiness", "aggregate impact"]
    },
    {
        "id": "IS_516_Part1_Sec1_2021",
        "is_number": "IS 516 (Part 1/Sec 1):2021",
        "title": "Hardened Concrete - Methods of Test - Part 1: Testing of Strength of Hardened Concrete - Section 1: Compressive, Flexural and Split Tensile Strength",
        "year": 2021,
        "domain": "Civil",
        "scope": "Prescribes methods of testing compressive, flexural, and splitting tensile strength of hardened concrete test specimens (cubes and cylinders).",
        "status": "current",
        "supersedes": ["IS 516:1959"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 1199 (Part 5):2018"],
        "test_methods": ["IS 516 (Part 1/Sec 1):2021"],
        "safety_standards": [],
        "installation_standards": [],
        "related_standards": ["IS 456:2000"],
        "certification": ["Standard test method for civil quality control"],
        "technical_parameters": {
            "specimen_sizes": ["150mm cube", "100mm cube", "150mm dia cylinder"],
            "test_type": "compressive strength test"
        },
        "keywords": ["compressive strength test", "concrete cube test", "flexural strength", "split tensile", "concrete testing", "is 516"]
    },
    {
        "id": "IS_10262_2019",
        "is_number": "IS 10262:2019",
        "title": "Concrete Mix Proportioning - Guidelines",
        "year": 2019,
        "domain": "Civil",
        "scope": "Provides detailed guidelines for designing concrete mixes from ordinary (M10-M20) to standard (M25-M55) and high strength (M60-M100) concrete, including self-compacting concrete (SCC).",
        "status": "current",
        "supersedes": ["IS 10262:2009"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 456:2000", "IS 383:2016", "IS 269:2015"],
        "test_methods": ["IS 1199:2018", "IS 516:2021"],
        "safety_standards": [],
        "installation_standards": ["IS 456:2000"],
        "related_standards": ["IS 456:2000"],
        "certification": [],
        "technical_parameters": {
            "mix_design": ["standard concrete", "high performance concrete", "self compacting concrete"]
        },
        "keywords": ["concrete mix design", "target mean strength", "water cement ratio design", "mix proportioning", "is 10262"]
    },

    # --- CIVIL & STRUCTURAL: STRUCTURAL STEEL ---
    {
        "id": "IS_2062_2011",
        "is_number": "IS 2062:2011",
        "title": "Hot Rolled Medium and High Tensile Structural Steel - Specification",
        "year": 2011,
        "domain": "Civil",
        "scope": "Covers requirements for steel plates, shapes, sections, flats, bars and strips for use in structural work, bridges, buildings, towers, and pre-engineered buildings.",
        "status": "current",
        "supersedes": ["IS 2062:2006"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 2",
                "year": 2019,
                "description": "Updated sub-qualities (BR, B0, C) for sub-zero Charpy V-notch impact toughness."
            }
        ],
        "normative_references": ["IS 1852:1985", "IS 228:1987"],
        "test_methods": ["IS 1608 (Part 1):2018", "IS 1757 (Part 1):2014"],
        "safety_standards": ["IS 800:2007"],
        "installation_standards": ["IS 800:2007"],
        "related_standards": ["IS 800:2007", "IS 808:2021"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Steel & Steel Products QCO"],
        "technical_parameters": {
            "steel_grades": ["E250", "E275", "E300", "E350", "E410", "E450"],
            "tensile_strength": "410 to 620 MPa",
            "yield_stress": "minimum 250 MPa for E250",
            "forms": ["plates", "angles", "channels", "joists", "beams", "flats"]
        },
        "keywords": ["structural steel", "e250 steel", "e350 steel", "ms plates", "steel angles", "is 2062", "steel beams", "peb steel", "hot rolled steel"]
    },
    {
        "id": "IS_800_2007",
        "is_number": "IS 800:2007",
        "title": "General Construction in Steel - Code of Practice",
        "year": 2007,
        "domain": "Civil",
        "scope": "Code of practice for use of structural steel in general building and civil engineering construction, based on Limit State Design (LSD) method.",
        "status": "current",
        "supersedes": ["IS 800:1984"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2012, "description": "Modifications in column buckling curves and bolt connection shear capacity"}],
        "normative_references": ["IS 2062:2011", "IS 1367:2002", "IS 808:2021"],
        "test_methods": [],
        "safety_standards": ["IS 800:2007"],
        "installation_standards": ["IS 800:2007"],
        "related_standards": ["IS 2062:2011", "IS 875:1987"],
        "certification": ["National Building Code standard for steel design"],
        "technical_parameters": {
            "design_method": "Limit State Design",
            "elements": ["tension members", "compression members", "flexural members", "connections"]
        },
        "keywords": ["steel design", "is 800", "structural steel design", "steel truss", "steel column", "limit state steel"]
    },

    # --- MECHANICAL: PIPES, VALVES & PUMPS ---
    {
        "id": "IS_4984_2016",
        "is_number": "IS 4984:2016",
        "title": "High Density Polyethylene (HDPE) Pipes for Water Supply - Specification",
        "year": 2016,
        "domain": "Mechanical",
        "scope": "Specifies requirements for high density polyethylene (HDPE) pipes of material classes PE 63, PE 80 and PE 100 for potable water supplies, sewer pressure mains, and irrigation schemes.",
        "status": "current",
        "supersedes": ["IS 4984:1995"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2022, "description": "Enhanced carbon black dispersion and hydrostatic pressure test rules"}],
        "normative_references": ["IS 2530:1963", "IS 7328:1992"],
        "test_methods": ["IS 12235 (Part 1 to 19):2004"],
        "safety_standards": ["IS 10500:2012"],
        "installation_standards": ["IS 7634 (Part 2):2012"],
        "related_standards": ["IS 14333:1996", "IS 1239 (Part 1):2004"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Pipes QCO"],
        "technical_parameters": {
            "material_grades": ["PE 63", "PE 80", "PE 100"],
            "pressure_ratings": ["PN 2.5", "PN 4", "PN 6", "PN 10", "PN 12.5", "PN 16"],
            "nominal_diameters": "20 mm to 1000 mm"
        },
        "keywords": ["hdpe pipe", "pe 100 pipe", "water supply pipe", "potable water pipe", "pn 10", "pn 16", "plastic pipe", "butt fusion"]
    },
    {
        "id": "IS_1239_Part1_2004",
        "is_number": "IS 1239 (Part 1):2004",
        "title": "Steel Tubes, Tubulars and Other Wrought Steel Fittings - Part 1: Steel Tubes (Mild Steel Pipes)",
        "year": 2004,
        "domain": "Mechanical",
        "scope": "Applies to welded and seamless plain end or screwed and socketed steel tubes and pipes (MS tubes, GI pipes) of light, medium, and heavy classes used for conveying water, gas, steam and air.",
        "status": "current",
        "supersedes": ["IS 1239 (Part 1):1990"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 5", "year": 2017, "description": "Galvanizing mass coating and zinc purity test requirements"}],
        "normative_references": ["IS 1387:1993", "IS 4736:1986"],
        "test_methods": ["IS 1239 (Part 1):2004", "IS 2328:2018"],
        "safety_standards": [],
        "installation_standards": ["IS 1239 (Part 2):2011"],
        "related_standards": ["IS 1239 (Part 2):2011", "IS 3589:2001"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Steel Pipes QCO"],
        "technical_parameters": {
            "classes": ["Light (A-Class / Yellow band)", "Medium (B-Class / Blue band)", "Heavy (C-Class / Red band)"],
            "nominal_bore": "15 mm to 150 mm",
            "finishing": ["Black MS pipe", "Hot-dip Galvanized (GI pipe)"]
        },
        "keywords": ["gi pipe", "ms pipe", "mild steel tubes", "galvanized pipe", "b-class pipe", "c-class pipe", "water pipe steel", "is 1239"]
    },
    {
        "id": "IS_8320_2000",
        "is_number": "IS 8320:2000",
        "title": "General Requirements for Submersible Pumpsets - Specification",
        "year": 2000,
        "domain": "Mechanical",
        "scope": "Specifies general requirements, material standards, construction, motor ratings, and testing for single and multistage submersible pumpsets operated by electric motors suitable for clean, cold drinking and irrigation water.",
        "status": "current",
        "supersedes": ["IS 8320:1982"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 3", "year": 2018, "description": "Energy efficiency and BEE Star Label integration"}],
        "normative_references": ["IS 9283:2013", "IS 1710:1989"],
        "test_methods": ["IS 11346:2002", "IS 9137:1978"],
        "safety_standards": ["IS 9283:2013", "IS 3043:2018"],
        "installation_standards": ["IS 14600:1999"],
        "related_standards": ["IS 9283:2013", "IS 14220:1994"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Agricultural Pumps QCO"],
        "technical_parameters": {
            "equipment_type": "submersible pumpset",
            "flow_rate": "1 m3/h to 150 m3/h",
            "head": "10 m to 400 m",
            "motor_power": "0.5 HP to 50 HP (0.37 kW to 37 kW)",
            "well_sizes": ["100 mm (4 inch)", "150 mm (6 inch)", "200 mm (8 inch)"]
        },
        "keywords": ["submersible pump", "borewell pump", "water pump", "multistage pump", "irrigation pump", "deep well pump", "is 8320"]
    },
    {
        "id": "IS_9283_2013",
        "is_number": "IS 9283:2013",
        "title": "Motors for Submersible Pumpsets - Specification",
        "year": 2013,
        "domain": "Electrical",
        "scope": "Covers two-pole, water-filled or oil-filled, rewindable, squirrel cage induction motors suitable for continuous duty in deep boreholes and open wells for driving submersible pumpsets.",
        "status": "current",
        "supersedes": ["IS 9283:1995"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2019, "description": "Dielectric fluid standards and high ambient water temperature performance"}],
        "normative_references": ["IS/IEC 60034-1:2004"],
        "test_methods": ["IS 9283:2013"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": ["IS 14600:1999"],
        "related_standards": ["IS 8320:2000", "IS 14220:1994"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "voltage": "415 V three-phase / 230 V single-phase, 50 Hz",
            "insulation": "Class B or Class F water resistant synthetic film"
        },
        "keywords": ["submersible motor", "water filled motor", "borewell motor", "submersible pumpset motor"]
    },
    {
        "id": "IS_14220_1994",
        "is_number": "IS 14220:1994",
        "title": "Openwell Submersible Pumpsets - Specification",
        "year": 1994,
        "domain": "Mechanical",
        "scope": "Specifies requirements for single and multistage openwell submersible pumpsets with electric motors for agricultural and domestic water pumping from canals, open wells, and tanks.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 3", "year": 2016, "description": "Alignment with BEE star labelling requirements"}],
        "normative_references": ["IS 9283:2013"],
        "test_methods": ["IS 11346:2002"],
        "safety_standards": ["IS 3043:2018"],
        "installation_standards": [],
        "related_standards": ["IS 8320:2000"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "pump_type": "openwell submersible",
            "ratings": "0.5 HP to 20 HP"
        },
        "keywords": ["openwell pump", "openwell submersible", "water pump agriculture", "canal pump"]
    },

    # --- SAFETY & PERSONAL PROTECTIVE EQUIPMENT (PPE) ---
    {
        "id": "IS_2925_2024",
        "is_number": "IS 2925:2024",
        "title": "Specification for Industrial Safety Helmets",
        "year": 2024,
        "domain": "Safety/PPE",
        "scope": "Specifies physical, mechanical and performance requirements, test methods and marking for industrial safety helmets providing head protection against falling objects, shock absorption, penetration, flame resistance, and electrical insulation up to 1000 V.",
        "status": "current",
        "supersedes": ["IS 2925:1984"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 15298 (Part 1):2011"],
        "test_methods": ["IS 2925:2024"],
        "safety_standards": ["IS 2925:2024"],
        "installation_standards": ["IS 8519:1977"],
        "related_standards": ["IS 15298 (Part 2):2016", "IS 3521 (Part 1):2021"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under PPE Protective Helmets QCO 2021"],
        "technical_parameters": {
            "equipment_type": "industrial safety helmet / hard hat",
            "impact_absorption": "transmitted force < 5.0 kN after 50 J impact",
            "penetration_resistance": "striker does not contact headform",
            "electrical_resistance": "leakage current < 1.2 mA at 1200 V AC",
            "flame_resistance": "no flame persists after 5 seconds",
            "harness": "4-point or 6-point cradle suspension"
        },
        "keywords": ["safety helmet", "industrial hard hat", "head protection", "safety hardhat", "is 2925", "shock absorption helmet", "electrical helmet", "construction helmet"]
    },
    {
        "id": "IS_2925_1984",
        "is_number": "IS 2925:1984",
        "title": "Specification for Industrial Safety Helmets",
        "year": 1984,
        "domain": "Safety/PPE",
        "scope": "Specifies requirements for industrial safety helmets for protection of head against impact and electrical hazards. Note: Superseded by IS 2925:2024 which modernizes test methods and harness standards.",
        "status": "superseded",
        "supersedes": [],
        "superseded_by": "IS 2925:2024",
        "amendments": [],
        "normative_references": [],
        "test_methods": ["IS 2925:1984"],
        "safety_standards": ["IS 2925:1984"],
        "installation_standards": [],
        "related_standards": ["IS 2925:2024"],
        "certification": ["Superseded - Current tenders must reference IS 2925:2024"],
        "technical_parameters": {
            "equipment_type": "industrial safety helmet"
        },
        "keywords": ["is 2925:1984", "safety helmet older version", "superseded helmet standard"]
    },
    {
        "id": "IS_15298_Part2_2016",
        "is_number": "IS 15298 (Part 2):2016",
        "title": "Personal Protective Equipment - Part 2: Safety Footwear (Second Revision)",
        "year": 2016,
        "domain": "Safety/PPE",
        "scope": "Specifies basic and additional (optional) requirements for safety footwear equipped with toecaps designed to provide protection against impacts with an energy level of at least 200 Joules and against compression at a load of at least 15 kN.",
        "status": "current",
        "supersedes": ["IS 15298 (Part 2):2002", "IS 1989 (Part 1):1986"],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 2",
                "year": 2020,
                "description": "Slip resistance test requirements (SRA, SRB, SRC) and anti-static sole conductivity."
            }
        ],
        "normative_references": ["IS 15298 (Part 1):2011"],
        "test_methods": ["IS 15298 (Part 1):2011"],
        "safety_standards": ["IS 15298 (Part 2):2016"],
        "installation_standards": ["IS 8519:1977"],
        "related_standards": ["IS 2925:2024", "IS 3521 (Part 1):2021"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Footwear QCO"],
        "technical_parameters": {
            "toe_impact_resistance": "200 Joules",
            "toe_compression_resistance": "15 kN",
            "features": ["anti-static (A)", "penetration resistant midsole (P)", "oil resistant outsole (FO)", "water resistant upper (WRU)"],
            "classes": ["SB", "S1", "S1P", "S2", "S3"]
        },
        "keywords": ["safety shoes", "safety footwear", "steel toe shoes", "safety boots", "200 joules toe cap", "oil resistant shoes", "anti-static footwear"]
    },
    {
        "id": "IS_15298_Part1_2011",
        "is_number": "IS 15298 (Part 1):2011",
        "title": "Personal Protective Equipment - Part 1: Test Methods for Footwear",
        "year": 2011,
        "domain": "Safety/PPE",
        "scope": "Specifies test methods for all kinds of personal protective equipment footwear, including impact resistance of toecaps, compression resistance, penetration resistance, dielectric properties, and slip resistance.",
        "status": "current",
        "supersedes": ["IS 15298 (Part 1):2002"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": [],
        "test_methods": ["IS 15298 (Part 1):2011"],
        "safety_standards": ["IS 15298 (Part 1):2011"],
        "installation_standards": [],
        "related_standards": ["IS 15298 (Part 2):2016"],
        "certification": ["Accredited test method for footwear testing"],
        "technical_parameters": {
            "test_types": "toe impact, puncture resistance, electrical resistance, flex cracking"
        },
        "keywords": ["footwear test method", "toe cap impact test", "sole adhesion test"]
    },
    {
        "id": "IS_9473_2002",
        "is_number": "IS 9473:2002",
        "title": "Respiratory Protective Devices - Filtering Half Masks to Protect Against Particles - Specification",
        "year": 2002,
        "domain": "Safety/PPE",
        "scope": "Specifies minimum requirements for filtering half masks (respirators class FFP1, FFP2, FFP3) used as respiratory protective devices against particulates, dusts, mists, and industrial aerosols.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2020, "description": "Inward leakage limits and breathing resistance testing"}],
        "normative_references": [],
        "test_methods": ["IS 9473:2002"],
        "safety_standards": ["IS 9473:2002"],
        "installation_standards": ["IS 9623:2008"],
        "related_standards": ["IS 2925:2024"],
        "certification": ["BIS Scheme-I (ISI Mark)"],
        "technical_parameters": {
            "classes": ["FFP1 (80% filtration)", "FFP2 (94% filtration - N95 equivalent)", "FFP3 (99% filtration)"],
            "breathing_resistance": "< 3.0 mbar at 95 L/min"
        },
        "keywords": ["respirator", "dust mask", "ffp2 mask", "n95 mask", "particulate respirator", "industrial half mask", "air filtering mask"]
    },
    {
        "id": "IS_3521_Part1_2021",
        "is_number": "IS 3521 (Part 1):2021",
        "title": "Personal Fall Arrest Systems - Part 1: Full Body Harness",
        "year": 2021,
        "domain": "Safety/PPE",
        "scope": "Specifies requirements, test methods, marking and user instructions for full body harnesses intended for fall arrest in construction, scaffolding, transmission towers, and industrial maintenance at heights.",
        "status": "current",
        "supersedes": ["IS 3521:1999"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/ISO 10333-1:2000"],
        "test_methods": ["IS 3521 (Part 1):2021"],
        "safety_standards": ["IS 3521 (Part 1):2021"],
        "installation_standards": ["IS 8519:1977"],
        "related_standards": ["IS 2925:2024", "IS 15298 (Part 2):2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "equipment_type": "full body harness",
            "webbing_width": "> 40 mm",
            "static_strength": "> 15 kN",
            "dynamic_drop_test": "free fall with 100 kg torso dummy without release"
        },
        "keywords": ["safety harness", "full body harness", "fall arrest", "safety belt", "height safety", "working at height harness"]
    },

    # --- SOLAR PHOTOVOLTAIC & RENEWABLE ENERGY ---
    {
        "id": "IS_14286_2010",
        "is_number": "IS 14286:2010 / IEC 61215:2005",
        "title": "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules - Design Qualification and Type Approval",
        "year": 2010,
        "domain": "Solar/Renewable",
        "scope": "Lays down requirements for design qualification and type approval of terrestrial crystalline silicon photovoltaic modules suitable for long-term outdoor operation in general climates, testing thermal cycling, damp heat, UV preconditioning, hail impact, and mechanical load.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2019, "description": "Adoption of updated bypass diode thermal tests"}],
        "normative_references": ["IS/IEC 61730 (Part 1):2004", "IS/IEC 61730 (Part 2):2004"],
        "test_methods": ["IS 14286:2010"],
        "safety_standards": ["IS/IEC 61730 (Part 1):2004", "IS/IEC 61730 (Part 2):2004"],
        "installation_standards": ["IS 16221 (Part 2):2015"],
        "related_standards": ["IS/IEC 61730 (Part 1):2004", "IS/IEC 61730 (Part 2):2004"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory under Solar Photovoltaics QCO"],
        "technical_parameters": {
            "technology": ["mono-crystalline silicon", "poly-crystalline silicon"],
            "tests_covered": ["thermal cycling 200 cycles", "damp heat 1000h", "hail impact test", "mechanical load 2400 Pa / 5400 Pa"]
        },
        "keywords": ["solar panel", "solar module", "pv module", "photovoltaic module", "crystalline silicon solar", "iec 61215", "solar pv"]
    },
    {
        "id": "IS_IEC_61730_Part1_2004",
        "is_number": "IS/IEC 61730 (Part 1):2004",
        "title": "Photovoltaic (PV) Module Safety Qualification - Part 1: Requirements for Construction",
        "year": 2004,
        "domain": "Solar/Renewable",
        "scope": "Specifies fundamental construction requirements for photovoltaic (PV) modules to provide safe electrical and mechanical operation during their expected lifetime, mitigating electric shock, fire hazards and personal injury.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 14286:2010"],
        "test_methods": ["IS/IEC 61730 (Part 2):2004"],
        "safety_standards": ["IS/IEC 61730 (Part 1):2004", "IS/IEC 61730 (Part 2):2004"],
        "installation_standards": ["IS 16221:2015"],
        "related_standards": ["IS 14286:2010", "IS/IEC 61730 (Part 2):2004"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory"],
        "technical_parameters": {
            "safety_class": "Class A (General access, hazardous voltage > 50V DC or > 240W)"
        },
        "keywords": ["solar safety", "pv module construction", "solar insulation resistance", "junction box solar"]
    },
    {
        "id": "IS_IEC_61730_Part2_2004",
        "is_number": "IS/IEC 61730 (Part 2):2004",
        "title": "Photovoltaic (PV) Module Safety Qualification - Part 2: Requirements for Testing",
        "year": 2004,
        "domain": "Solar/Renewable",
        "scope": "Provides test sequences (MST 01 to MST 55) for verifying electrical shock hazard, fire hazard, mechanical stress hazard, and environmental resistance of PV modules.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS/IEC 61730 (Part 1):2004", "IS 14286:2010"],
        "test_methods": ["IS/IEC 61730 (Part 2):2004"],
        "safety_standards": ["IS/IEC 61730 (Part 2):2004"],
        "installation_standards": [],
        "related_standards": ["IS 14286:2010"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory"],
        "technical_parameters": {
            "tests": ["dielectric withstand test", "ground continuity test", "fire test", "cut susceptibility test"]
        },
        "keywords": ["solar safety test", "dielectric test solar", "fire test pv module", "iec 61730"]
    },

    # --- CONSUMER PRODUCTS & LED LIGHTING ---
    {
        "id": "IS_16102_Part1_2012",
        "is_number": "IS 16102 (Part 1):2012",
        "title": "Self-Ballasted LED Lamps for General Lighting Services - Part 1: Safety Requirements",
        "year": 2012,
        "domain": "Consumer/Lighting",
        "scope": "Specifies safety and interchangeability requirements, together with test methods and conditions required to show compliance of LED lamps with integrated means for controlling, intended for domestic and general lighting up to 250 V AC.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2017, "description": "Updated insulation resistance and electric strength test protocols"}],
        "normative_references": ["IS 16102 (Part 2):2012"],
        "test_methods": ["IS 16102 (Part 1):2012"],
        "safety_standards": ["IS 16102 (Part 1):2012"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS 16102 (Part 2):2012", "IS 16103 (Part 1):2012"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory under Electronics & IT QCO"],
        "technical_parameters": {
            "equipment_type": "LED bulb / self-ballasted LED lamp",
            "voltage": "up to 250 V AC, 50 Hz",
            "lamp_cap": ["B22d", "E27", "E14"]
        },
        "keywords": ["led bulb", "led lamp", "self ballasted led", "domestic lighting", "b22 led bulb", "is 16102"]
    },
    {
        "id": "IS_16102_Part2_2012",
        "is_number": "IS 16102 (Part 2):2012",
        "title": "Self-Ballasted LED Lamps for General Lighting Services - Part 2: Performance Requirements",
        "year": 2012,
        "domain": "Consumer/Lighting",
        "scope": "Specifies performance requirements (luminous flux, efficacy lm/W, CRI color rendering index, power factor, lumen maintenance and rated lifetime) for self-ballasted LED lamps.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2017, "description": "Minimum luminous efficacy revised to 100 lm/W for energy efficiency"}],
        "normative_references": ["IS 16102 (Part 1):2012"],
        "test_methods": ["IS 16102 (Part 2):2012"],
        "safety_standards": ["IS 16102 (Part 1):2012"],
        "installation_standards": [],
        "related_standards": ["IS 16102 (Part 1):2012"],
        "certification": ["Referenced standard for BEE Star Rating of LED lamps"],
        "technical_parameters": {
            "efficacy": "> 100 lumens/watt",
            "cri": "> 80",
            "power_factor": "> 0.90",
            "lumen_maintenance": "L70 at 25000 hours"
        },
        "keywords": ["led performance", "luminous efficacy", "lumens per watt", "bee star led", "cri 80", "power factor 0.9"]
    },
    {
        "id": "IS_10322_Part5_Sec1_2012",
        "is_number": "IS 10322 (Part 5/Sec 1):2012",
        "title": "Luminaires - Part 5: Particular Requirements - Section 1: Fixed General Purpose Luminaires",
        "year": 2012,
        "domain": "Consumer/Lighting",
        "scope": "Specifies requirements for fixed general purpose luminaires (such as LED batten lights, downlights, ceiling fixtures, panel lights) for use with electric light sources on supply voltages not exceeding 1000 V.",
        "status": "current",
        "supersedes": ["IS 10322 (Part 5/Sec 1):1987"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 1", "year": 2017, "description": "Inclusion of dedicated LED driver compliance criteria"}],
        "normative_references": ["IS 10322 (Part 1):2014"],
        "test_methods": ["IS 10322 (Part 1):2014"],
        "safety_standards": ["IS 10322 (Part 5/Sec 1):2012"],
        "installation_standards": ["IS 732:2019"],
        "related_standards": ["IS 16102 (Part 1):2012"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory"],
        "technical_parameters": {
            "luminaire_type": ["LED batten", "panel light", "downlight", "surface fixture"],
            "voltage": "230 V AC"
        },
        "keywords": ["led luminaire", "led batten", "panel light", "downlight", "fixed luminaire", "indoor lighting fixture"]
    },
    {
        "id": "IS_10322_Part5_Sec3_2012",
        "is_number": "IS 10322 (Part 5/Sec 3):2012",
        "title": "Luminaires - Part 5: Particular Requirements - Section 3: Luminaires for Road and Street Lighting",
        "year": 2012,
        "domain": "Consumer/Lighting",
        "scope": "Specifies requirements for road and street lighting luminaires (LED street lights), including wind resistance, external mechanical impact (IK code) and IP65/IP66 ingress protection against monsoon rain and dust.",
        "status": "current",
        "supersedes": ["IS 10322 (Part 5/Sec 3):1987"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 10322 (Part 1):2014", "IS/IEC 60529:2001"],
        "test_methods": ["IS 10322 (Part 1):2014"],
        "safety_standards": ["IS 10322 (Part 5/Sec 3):2012"],
        "installation_standards": ["IS 1944:1970"],
        "related_standards": ["IS 10322 (Part 5/Sec 1):2012"],
        "certification": ["BIS Compulsory Registration Scheme (CRS) - Mandatory"],
        "technical_parameters": {
            "application": "street lighting, highway illumination",
            "ingress_protection": "IP65 or IP66",
            "impact_protection": "IK07 or IK08"
        },
        "keywords": ["led street light", "street light luminaire", "road lighting", "outdoor luminaire", "ip66 street light"]
    },

    # --- SMART METERS & ENERGY MEASUREMENT ---
    {
        "id": "IS_16444_Part1_2015",
        "is_number": "IS 16444 (Part 1):2015",
        "title": "A.C. Static Direct Connected Watt-Hour Smart Meter Class 1 and 2 - Specification",
        "year": 2015,
        "domain": "Electrical",
        "scope": "Specifies requirements and tests for static direct-connected smart watt-hour electricity meters of accuracy classes 1 and 2, with built-in bidirectional communication (cellular, RF mesh, PLC) and connect/disconnect switch for AMI deployment.",
        "status": "current",
        "supersedes": [],
        "superseded_by": None,
        "amendments": [
            {
                "number": "Amendment 2",
                "year": 2020,
                "description": "Standardization of push data protocols, IS 15959 DLMS/COSEM interoperability and tamper logging."
            }
        ],
        "normative_references": ["IS 13779:2020", "IS 15959 (Part 2):2016"],
        "test_methods": ["IS 13779:2020", "IS 16444 (Part 1):2015"],
        "safety_standards": ["IS 13779:2020"],
        "installation_standards": ["IS 15707:2006"],
        "related_standards": ["IS 13779:2020", "IS 15959 (Part 1 & 2):2016"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Smart Meters QCO"],
        "technical_parameters": {
            "meter_type": "smart energy meter",
            "accuracy_class": ["Class 1.0", "Class 2.0"],
            "features": ["AMI", "prepaid mode", "tamper detection", "remote connect/disconnect", "DLMS/COSEM"]
        },
        "keywords": ["smart meter", "energy meter", "prepaid electricity meter", "watt-hour meter", "ami smart meter", "dlms meter"]
    },
    {
        "id": "IS_13779_2020",
        "is_number": "IS 13779:2020",
        "title": "AC Static Watt-hour Meters, Class 1 and 2 - Specification",
        "year": 2020,
        "domain": "Electrical",
        "scope": "Specifies requirements and tests for static a.c. active watt-hour meters of accuracy classes 1 and 2 for single-phase and three-phase balanced and unbalanced loads.",
        "status": "current",
        "supersedes": ["IS 13779:1999"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": [],
        "test_methods": ["IS 13779:2020"],
        "safety_standards": ["IS 13779:2020"],
        "installation_standards": ["IS 15707:2006"],
        "related_standards": ["IS 16444 (Part 1):2015"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory"],
        "technical_parameters": {
            "accuracy_class": ["Class 1", "Class 2"],
            "phase": ["single phase 2 wire", "three phase 4 wire"]
        },
        "keywords": ["static watt hour meter", "electronic energy meter", "electric meter", "kwh meter"]
    },

    # --- FIRE SAFETY & EXTINGUISHERS ---
    {
        "id": "IS_15683_2018",
        "is_number": "IS 15683:2018",
        "title": "Portable Fire Extinguishers - Performance and Construction - Specification",
        "year": 2018,
        "domain": "Safety/Fire",
        "scope": "Specifies requirements for performance, reliability, and essential construction details for all portable fire extinguishers (water, foam, dry powder ABC, CO2, clean agent). Consolidates earlier individual standards (IS 2171, IS 2878, IS 10204).",
        "status": "current",
        "supersedes": ["IS 15683:2006", "IS 2171:1985", "IS 2878:2004"],
        "superseded_by": None,
        "amendments": [{"number": "Amendment 2", "year": 2022, "description": "Updated clean agent extinguishing media and hydrostatic pressure testing"}],
        "normative_references": ["IS 2190:2010"],
        "test_methods": ["IS 15683:2018"],
        "safety_standards": ["IS 15683:2018"],
        "installation_standards": ["IS 2190:2010"],
        "related_standards": ["IS 2190:2010"],
        "certification": ["BIS Scheme-I (ISI Mark) - Mandatory under Fire Extinguishers QCO"],
        "technical_parameters": {
            "types": ["ABC dry chemical powder", "CO2 gas", "Mechanical foam", "Water type"],
            "capacity": ["1 kg", "2 kg", "4 kg", "6 kg", "9 kg"]
        },
        "keywords": ["fire extinguisher", "portable fire extinguisher", "abc powder extinguisher", "co2 extinguisher", "fire safety equipment"]
    },
    {
        "id": "IS_2190_2010",
        "is_number": "IS 2190:2010",
        "title": "Selection, Installation and Maintenance of First-Aid Fire Extinguishers - Code of Practice",
        "year": 2010,
        "domain": "Safety/Fire",
        "scope": "Provides guidelines on the selection, installation, maintenance, routine inspection, and testing of portable first-aid fire extinguishers in residential, commercial, industrial and hazardous occupancies.",
        "status": "current",
        "supersedes": ["IS 2190:1992"],
        "superseded_by": None,
        "amendments": [],
        "normative_references": ["IS 15683:2018"],
        "test_methods": ["IS 2190:2010"],
        "safety_standards": ["IS 2190:2010"],
        "installation_standards": ["IS 2190:2010"],
        "related_standards": ["IS 15683:2018"],
        "certification": ["National Building Code Part 4 compliance"],
        "technical_parameters": {
            "hazard_classification": ["Light hazard", "Ordinary hazard", "Extra hazard"]
        },
        "keywords": ["fire extinguisher maintenance", "fire extinguisher installation", "fire safety code", "first aid fire fighting"]
    }
]

# Write standards.json
with open("data/standards.json", "w", encoding="utf-8") as f:
    json.dump(standards, f, indent=2)

# Build explicit relationships graph
relationships = []
for std in standards:
    src_id = std["id"]
    src_num = std["is_number"]
    
    # Supersedes
    for sup in std.get("supersedes", []):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": sup,
            "relationship_type": "supersedes",
            "description": f"{src_num} supersedes older standard {sup}"
        })
        
    # Superseded by
    if std.get("superseded_by"):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": std["superseded_by"],
            "relationship_type": "superseded_by",
            "description": f"{src_num} has been superseded by current standard {std['superseded_by']}"
        })
        
    # Normative references
    for norm in std.get("normative_references", []):
        relationships.append({
            "source_id": src_id,
            "source_number": src_num,
            "target_number": norm,
            "relationship_type": "normative_reference",
            "description": f"Normative reference required for specification compliance: {norm}"
        })
        
    # Test methods
    for test in std.get("test_methods", []):
        if test != src_num:
            relationships.append({
                "source_id": src_id,
                "source_number": src_num,
                "target_number": test,
                "relationship_type": "test_method",
                "description": f"Mandatory compliance testing method standard: {test}"
            })
            
    # Safety standards
    for safe in std.get("safety_standards", []):
        if safe != src_num:
            relationships.append({
                "source_id": src_id,
                "source_number": src_num,
                "target_number": safe,
                "relationship_type": "safety",
                "description": f"Safety and electrical/mechanical hazard standard: {safe}"
            })
            
    # Installation standards
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

# Certifications DB
certifications = [
    {
        "scheme": "Scheme-I (ISI Mark)",
        "authority": "Bureau of Indian Standards (BIS)",
        "description": "Product certification scheme granting license to use the Standard Mark (ISI). Governed by BIS Act 2016 and Quality Control Orders (QCOs) issued by line ministries.",
        "mandatory_items": [
            "Electric Motors (IS 12615)",
            "Distribution Transformers (IS 1180)",
            "TMT Steel Bars (IS 1786)",
            "Ordinary Portland Cement (IS 269)",
            "Portland Pozzolana Cement (IS 1489)",
            "Industrial Safety Helmets (IS 2925)",
            "Safety Footwear (IS 15298)",
            "Fire Extinguishers (IS 15683)",
            "PVC Cables & Wires (IS 694)",
            "Smart Energy Meters (IS 16444)"
        ]
    },
    {
        "scheme": "Compulsory Registration Scheme (CRS)",
        "authority": "Ministry of Electronics and Information Technology (MeitY) / Ministry of New and Renewable Energy (MNRE) through BIS",
        "description": "Self-declaration of conformity based on testing at BIS-recognized laboratories for IT, electronics and solar photovoltaic equipment.",
        "mandatory_items": [
            "Solar Photovoltaic Modules (IS 14286, IS/IEC 61730)",
            "Self-Ballasted LED Lamps (IS 16102 Part 1)",
            "Fixed General Purpose Luminaires (IS 10322 Part 5 Sec 1)",
            "Road & Street Lighting Luminaires (IS 10322 Part 5 Sec 3)",
            "Power Banks & IT Equipment (IS 13252)"
        ]
    },
    {
        "scheme": "BEE Star Labelling",
        "authority": "Bureau of Energy Efficiency (BEE)",
        "description": "Mandatory and voluntary energy efficiency rating stars (1 to 5 Star) based on BIS test standards.",
        "mandatory_items": [
            "Distribution Transformers (based on IS 1180 loss levels)",
            "Three-Phase Induction Motors (based on IS 12615 / IS 15999)",
            "Agricultural Pumpsets (based on IS 8320 / IS 11346)",
            "LED Lamps (based on IS 16102 Part 2)"
        ]
    }
]

with open("data/certifications.json", "w", encoding="utf-8") as f:
    json.dump(certifications, f, indent=2)

# Demo scenarios
examples = [
    {
        "id": "scenario_motor",
        "label": "1. Three-Phase Induction Motor (Electrical)",
        "category": "Electrical",
        "query": "15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with energy efficiency and IP55 protection requirements.",
        "expected_standard": "IS 12615:2018",
        "notes": "Demonstrates IE3 efficiency matching, 415V/50Hz voltage/frequency parameters, IP55 enclosure, and relations to IS 15999 (efficiency testing) and IS/IEC 60034-5."
    },
    {
        "id": "scenario_cement",
        "label": "2. Structural Portland Pozzolana Cement (Civil)",
        "category": "Civil",
        "query": "Fly ash based Portland Pozzolana Cement (PPC) for reinforced concrete foundation and marine civil engineering works with compressive strength testing.",
        "expected_standard": "IS 1489 (Part 1):2015",
        "notes": "Demonstrates pozzolana fly-ash matching, relations to IS 456 (concrete code) and IS 4031 (compressive strength testing)."
    },
    {
        "id": "scenario_helmet",
        "label": "3. Industrial Safety Helmet / Hard Hat (PPE)",
        "category": "Safety/PPE",
        "query": "Industrial safety helmets for construction workers providing shock absorption, penetration resistance, flame retardance and electrical insulation up to 1000 V.",
        "expected_standard": "IS 2925:2024",
        "notes": "Demonstrates PPE protective helmet classification, mandatory Scheme-I ISI mark, and shock/penetration test criteria."
    },
    {
        "id": "scenario_rebar",
        "label": "4. TMT High Strength Steel Rebars (Civil)",
        "category": "Civil",
        "query": "Fe 500D thermo-mechanically treated (TMT) high strength deformed steel bars 16 mm and 20 mm for seismic zone earthquake resistant RCC building reinforcement.",
        "expected_standard": "IS 1786:2008",
        "notes": "Demonstrates steel rebar grade Fe 500D extraction, tensile and ductility parameters, and relationship to IS 456 and IS 13920."
    },
    {
        "id": "scenario_solar",
        "label": "5. Crystalline Silicon Solar PV Modules (Renewable)",
        "category": "Solar/Renewable",
        "query": "Crystalline silicon solar photovoltaic (PV) modules 540 Wp for utility grid-connected power plant with design qualification, damp heat testing and safety qualification.",
        "expected_standard": "IS 14286:2010 / IEC 61215:2005",
        "notes": "Demonstrates Compulsory Registration Scheme (CRS) flagging, relations to IS/IEC 61730 safety tests."
    },
    {
        "id": "scenario_outdated",
        "label": "6. Legacy Tender Audit: Outdated IS 325 & IS 8112 (Version Alert)",
        "category": "Audit/Warning",
        "query": "Supply of three-phase squirrel cage induction motor manufactured as per IS 325:1996 and 43 Grade Ordinary Portland Cement conforming to IS 8112:1989 for pump station works.",
        "expected_standard": "IS 12615:2018",
        "notes": "Crucial test: Detects obsolete IS 325:1996 and IS 8112:1989 in the requirement text, generates high-priority warning alerts, and recommends current IS 12615:2018 and IS 269:2015."
    }
]

with open("data/examples.json", "w", encoding="utf-8") as f:
    json.dump(examples, f, indent=2)

# Evaluation Queries (22 Ground Truth benchmark queries)
eval_queries = [
    {
        "query": "15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements",
        "expected_standards": ["IS 12615:2018", "IS/IEC 60034-1:2004", "IS/IEC 60034-5:2000"],
        "top_expected": "IS 12615:2018",
        "check_version": False
    },
    {
        "query": "Outdoor oil immersed distribution transformer 500 kVA 11 kV / 433 V with BEE star loss levels",
        "expected_standards": ["IS 1180 (Part 1):2014", "IS 2026 (Part 1):2011", "IS 335:2018"],
        "top_expected": "IS 1180 (Part 1):2014",
        "check_version": False
    },
    {
        "query": "Fe 500D high strength deformed steel rebar for reinforced concrete building construction",
        "expected_standards": ["IS 1786:2008", "IS 456:2000"],
        "top_expected": "IS 1786:2008",
        "check_version": False
    },
    {
        "query": "Plain and reinforced concrete code of practice for design of M30 grade RCC beam and columns",
        "expected_standards": ["IS 456:2000", "IS 10262:2019", "IS 1786:2008"],
        "top_expected": "IS 456:2000",
        "check_version": False
    },
    {
        "query": "Industrial safety helmet with high impact resistance and 1000V electrical shock protection",
        "expected_standards": ["IS 2925:2024"],
        "top_expected": "IS 2925:2024",
        "check_version": False
    },
    {
        "query": "Safety footwear with 200 Joules steel toe cap and oil resistant sole for factory personnel",
        "expected_standards": ["IS 15298 (Part 2):2016", "IS 15298 (Part 1):2011"],
        "top_expected": "IS 15298 (Part 2):2016",
        "check_version": False
    },
    {
        "query": "Crystalline silicon solar photovoltaic modules design qualification for utility solar farm",
        "expected_standards": ["IS 14286:2010 / IEC 61215:2005", "IS/IEC 61730 (Part 1):2004"],
        "top_expected": "IS 14286:2010 / IEC 61215:2005",
        "check_version": False
    },
    {
        "query": "High density polyethylene HDPE pipes PE 100 PN 10 for drinking water distribution",
        "expected_standards": ["IS 4984:2016"],
        "top_expected": "IS 4984:2016",
        "check_version": False
    },
    {
        "query": "Galvanized mild steel tubes and pipes medium class for water supply plumbing",
        "expected_standards": ["IS 1239 (Part 1):2004"],
        "top_expected": "IS 1239 (Part 1):2004",
        "check_version": False
    },
    {
        "query": "Submersible pumpset 5 HP 4 inch for agricultural borewell irrigation",
        "expected_standards": ["IS 8320:2000", "IS 9283:2013"],
        "top_expected": "IS 8320:2000",
        "check_version": False
    },
    {
        "query": "Ordinary Portland Cement 53 grade for high strength precast concrete works",
        "expected_standards": ["IS 269:2015"],
        "top_expected": "IS 269:2015",
        "check_version": False
    },
    {
        "query": "Fly ash based Portland Pozzolana Cement PPC for marine jetty construction",
        "expected_standards": ["IS 1489 (Part 1):2015", "IS 456:2000"],
        "top_expected": "IS 1489 (Part 1):2015",
        "check_version": False
    },
    {
        "query": "PVC insulated copper conductor 1100 V FRLS building wire for internal conduit wiring",
        "expected_standards": ["IS 694:2010", "IS 732:2019"],
        "top_expected": "IS 694:2010",
        "check_version": False
    },
    {
        "query": "XLPE insulated armoured power cable 1.1 kV 4 core 185 sq mm for underground feeder",
        "expected_standards": ["IS 7098 (Part 1):1988"],
        "top_expected": "IS 7098 (Part 1):1988",
        "check_version": False
    },
    {
        "query": "11 kV XLPE insulated three core screened armoured cable for electrical distribution substation",
        "expected_standards": ["IS 7098 (Part 2):2011"],
        "top_expected": "IS 7098 (Part 2):2011",
        "check_version": False
    },
    {
        "query": "Code of practice for earthing and soil resistivity testing with earth electrode pit",
        "expected_standards": ["IS 3043:2018"],
        "top_expected": "IS 3043:2018",
        "check_version": False
    },
    {
        "query": "Moulded case circuit breaker MCCB 400 A 415 V 50 kA breaking capacity for main switchboard",
        "expected_standards": ["IS/IEC 60947-2:2016"],
        "top_expected": "IS/IEC 60947-2:2016",
        "check_version": False
    },
    {
        "query": "Residual current circuit breaker RCCB 40 A 30 mA 4 pole for human electric shock protection",
        "expected_standards": ["IS 12640 (Part 1):2016"],
        "top_expected": "IS 12640 (Part 1):2016",
        "check_version": False
    },
    {
        "query": "Self ballasted LED lamps 9W 6500K B22 cap for residential lighting safety and performance",
        "expected_standards": ["IS 16102 (Part 1):2012", "IS 16102 (Part 2):2012"],
        "top_expected": "IS 16102 (Part 1):2012",
        "check_version": False
    },
    {
        "query": "Smart electricity meter single phase direct connected class 1.0 with DLMS communication",
        "expected_standards": ["IS 16444 (Part 1):2015", "IS 13779:2020"],
        "top_expected": "IS 16444 (Part 1):2015",
        "check_version": False
    },
    {
        "query": "Procurement of electric motor as per IS 325:1996 for water pump",
        "expected_standards": ["IS 12615:2018"],
        "top_expected": "IS 12615:2018",
        "check_version": True,
        "outdated_flag": "IS 325:1996",
        "superseded_by": "IS 12615:2018"
    },
    {
        "query": "Supply of cement conforming to IS 8112:1989 for masonry work",
        "expected_standards": ["IS 269:2015"],
        "top_expected": "IS 269:2015",
        "check_version": True,
        "outdated_flag": "IS 8112:1989",
        "superseded_by": "IS 269:2015"
    }
]

with open("data/eval_queries.json", "w", encoding="utf-8") as f:
    json.dump(eval_queries, f, indent=2)

print(f"Generated {len(standards)} standards, {len(relationships)} relationships, {len(certifications)} certification schemes, {len(examples)} examples, and {len(eval_queries)} eval queries.")
