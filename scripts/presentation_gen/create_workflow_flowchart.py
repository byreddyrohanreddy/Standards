import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow_down(draw, x, y1, y2, color="#64748b", width=3, label=None, font=None):
    draw.line([(x, y1), (x, y2)], fill=color, width=width)
    # Arrow head
    draw.polygon([(x - 6, y2 - 10), (x + 6, y2 - 10), (x, y2)], fill=color)
    if label and font:
        draw.text((x + 8, (y1 + y2) // 2 - 8), label, fill=color, font=font)

def draw_arrow_right(draw, x1, y, x2, color="#64748b", width=3, label=None, font=None):
    draw.line([(x1, y), (x2, y)], fill=color, width=width)
    draw.polygon([(x2 - 10, y - 6), (x2 - 10, y + 6), (x2, y)], fill=color)
    if label and font:
        draw.text(((x1 + x2) // 2 - 15, y - 18), label, fill=color, font=font)

def create_workflow_flowchart():
    os.makedirs("documents", exist_ok=True)
    img_width = 1600
    img_height = 1120
    img = Image.new("RGB", (img_width, img_height), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Fonts (fallback to default if ttf not accessible)
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 30)
        font_sub = ImageFont.truetype("arial.ttf", 16)
        font_stage = ImageFont.truetype("arialbd.ttf", 13)
        font_box_title = ImageFont.truetype("arialbd.ttf", 18)
        font_box_text = ImageFont.truetype("arial.ttf", 14)
        font_box_sub = ImageFont.truetype("arial.ttf", 12)
        font_arrow = ImageFont.truetype("arialbd.ttf", 12)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_stage = ImageFont.load_default()
        font_box_title = ImageFont.load_default()
        font_box_text = ImageFont.load_default()
        font_box_sub = ImageFont.load_default()
        font_arrow = ImageFont.load_default()

    # Top Header
    draw_rounded_rect(draw, [40, 30, 1560, 110], radius=12, fill="#0f172a", outline="#1e293b", width=2)
    draw.text((60, 42), "BIS-SpecAI: END-TO-END WORKFLOW & PIPELINE FLOWCHART", fill="#38bdf8", font=font_title)
    draw.text((60, 78), "Deterministic Architecture: Ingestion → NLP Parsing → Version Audit → Chunk-Aware Hybrid Retrieval → Graph Expansion → Tender Clause", fill="#cbd5e1", font=font_sub)

    # Stage 1: Ingestion
    b1_x1, b1_y1, b1_x2, b1_y2 = 460, 135, 1140, 215
    draw_rounded_rect(draw, [b1_x1, b1_y1, b1_x2, b1_y2], radius=10, fill="#ffffff", outline="#2563eb", width=2)
    draw_rounded_rect(draw, [b1_x1 + 16, b1_y1 + 10, b1_x1 + 110, b1_y1 + 30], radius=5, fill="#dbeafe")
    draw.text((b1_x1 + 24, b1_y1 + 13), "STAGE 1", fill="#1e40af", font=font_stage)
    draw.text((b1_x1 + 120, b1_y1 + 11), "Procurement Specification Ingestion", fill="#0f172a", font=font_box_title)
    draw.text((b1_x1 + 20, b1_y1 + 42), "• PyMuPDF C-bindings extract raw text streams from scanned/digital Tender NIT PDFs (<8ms)", fill="#334155", font=font_box_text)
    draw.text((b1_x1 + 20, b1_y1 + 62), "• Direct natural-language query input with UTF-8 normalization and minimum character thresholding", fill="#64748b", font=font_box_sub)

    draw_arrow_down(draw, 800, 215, 245, color="#2563eb", width=3)

    # Stage 2: NLP Extraction & Compound Tender Segmentation
    b2_x1, b2_y1, b2_x2, b2_y2 = 420, 245, 1180, 345
    draw_rounded_rect(draw, [b2_x1, b2_y1, b2_x2, b2_y2], radius=10, fill="#ffffff", outline="#0d9488", width=2)
    draw_rounded_rect(draw, [b2_x1 + 16, b2_y1 + 10, b2_x1 + 110, b2_y1 + 30], radius=5, fill="#ccfbf1")
    draw.text((b2_x1 + 24, b2_y1 + 13), "STAGE 2", fill="#0f766e", font=font_stage)
    draw.text((b2_x1 + 120, b2_y1 + 11), "Dynamic NLP Extraction & Compound Segmentation", fill="#0f172a", font=font_box_title)
    draw.text((b2_x1 + 20, b2_y1 + 40), "• Extracts 16 generic parameters: Voltage, Power, Phase, Ingress (IP55), Duty (S1), Efficiency (IE3/IE4)", fill="#334155", font=font_box_text)
    draw.text((b2_x1 + 20, b2_y1 + 62), "• Compound Tender Decomposer: Identifies multi-product clauses (e.g. Motor + Control Panel + PPE)", fill="#0f766e", font=font_box_text)
    draw.text((b2_x1 + 20, b2_y1 + 84), "• Derives grounded normalized semantic query without hallucinating unanchored synonyms", fill="#64748b", font=font_box_sub)

    # Split into parallel paths: Stage 3 (Version Audit) and Stage 4 (Retrieval)
    draw.line([(800, 345), (800, 365)], fill="#64748b", width=3)
    draw.line([(310, 365), (1290, 365)], fill="#64748b", width=3)
    draw.line([(310, 365), (310, 385)], fill="#64748b", width=3)
    draw.polygon([(304, 375), (316, 375), (310, 385)], fill="#64748b")
    draw.line([(1290, 365), (1290, 385)], fill="#64748b", width=3)
    draw.polygon([(1284, 375), (1296, 375), (1290, 385)], fill="#64748b")

    # Stage 3: Version & Obsolescence Auditor (Left)
    b3_x1, b3_y1, b3_x2, b3_y2 = 70, 385, 550, 525
    draw_rounded_rect(draw, [b3_x1, b3_y1, b3_x2, b3_y2], radius=10, fill="#ffffff", outline="#d97706", width=2)
    draw_rounded_rect(draw, [b3_x1 + 16, b3_y1 + 10, b3_x1 + 110, b3_y1 + 30], radius=5, fill="#fef3c7")
    draw.text((b3_x1 + 24, b3_y1 + 13), "STAGE 3", fill="#b45309", font=font_stage)
    draw.text((b3_x1 + 120, b3_y1 + 11), "Tender Version & Obsolescence Audit", fill="#0f172a", font=font_box_title)
    draw.text((b3_x1 + 20, b3_y1 + 42), "• Scans citations against supersession database", fill="#334155", font=font_box_text)
    draw.text((b3_x1 + 20, b3_y1 + 64), "• Flags obsolete codes (e.g. IS 325:1996, IS 8112)", fill="#b45309", font=font_box_text)
    draw.text((b3_x1 + 20, b3_y1 + 86), "• Injects high-priority replacement alerts & advice", fill="#334155", font=font_box_text)
    draw.text((b3_x1 + 20, b3_y1 + 108), "• Automatically promotes modern revision in ranking", fill="#64748b", font=font_box_sub)

    # Stage 4: Chunk-Aware Hybrid Retrieval Engine (Right)
    b4_x1, b4_y1, b4_x2, b4_y2 = 590, 385, 1530, 525
    draw_rounded_rect(draw, [b4_x1, b4_y1, b4_x2, b4_y2], radius=10, fill="#ffffff", outline="#7c3aed", width=2)
    draw_rounded_rect(draw, [b4_x1 + 16, b4_y1 + 10, b4_x1 + 110, b4_y1 + 30], radius=5, fill="#ede9fe")
    draw.text((b4_x1 + 24, b4_y1 + 13), "STAGE 4", fill="#6d28d9", font=font_stage)
    draw.text((b4_x1 + 120, b4_y1 + 11), "Chunk-Aware Hybrid Dual-Channel Retrieval Engine", fill="#0f172a", font=font_box_title)
    draw.text((b4_x1 + 20, b4_y1 + 40), "• Dense Semantic Embeddings: all-MiniLM-L6-v2 (384-dim) over 113 standards & 791 structured chunks", fill="#334155", font=font_box_text)
    draw.text((b4_x1 + 20, b4_y1 + 62), "• Structured Chunk Max-Pooling: Fuses full standard vector (50%) + max score across [scope, testing, safety] (50%)", fill="#6d28d9", font=font_box_text)
    draw.text((b4_x1 + 20, b4_y1 + 84), "• Lexical Channel: BM25 Okapi with exact terminology and rating code preservation (e.g. 'Fe 500D', 'IE3')", fill="#334155", font=font_box_text)
    draw.text((b4_x1 + 20, b4_y1 + 106), "• Sub-50ms CPU latency: Offline pre-computed vector caches (.npy and .npz arrays)", fill="#64748b", font=font_box_sub)

    # Merge Stage 3 & 4 into Stage 5
    draw.line([(310, 525), (310, 555)], fill="#64748b", width=3)
    draw.line([(1060, 525), (1060, 555)], fill="#64748b", width=3)
    draw.line([(310, 555), (1060, 555)], fill="#64748b", width=3)
    draw.line([(685, 555), (685, 575)], fill="#64748b", width=3)
    draw.polygon([(679, 565), (691, 565), (685, 575)], fill="#64748b")

    # Stage 5: Multi-Factor Reranker & Confidence Thresholding
    b5_x1, b5_y1, b5_x2, b5_y2 = 280, 575, 1320, 680
    draw_rounded_rect(draw, [b5_x1, b5_y1, b5_x2, b5_y2], radius=10, fill="#ffffff", outline="#059669", width=2)
    draw_rounded_rect(draw, [b5_x1 + 16, b5_y1 + 10, b5_x1 + 110, b5_y1 + 30], radius=5, fill="#d1fae5")
    draw.text((b5_x1 + 24, b5_y1 + 13), "STAGE 5", fill="#047857", font=font_stage)
    draw.text((b5_x1 + 120, b5_y1 + 11), "Multi-Factor Reranking & Confidence Threshold Gating", fill="#0f172a", font=font_box_title)
    draw.text((b5_x1 + 20, b5_y1 + 40), "• Multi-Factor Formula: Final Score = 0.35(Dense) + 0.25(BM25) + 0.20(Scope Coverage) + 0.10(Domain) + 0.10(Version)", fill="#047857", font=font_box_text)
    draw.text((b5_x1 + 20, b5_y1 + 62), "• Confidence Gate: Rejects out-of-catalog or hallucinated inputs (Score < 0.40) with transparent explanation", fill="#b45309", font=font_box_text)
    draw.text((b5_x1 + 20, b5_y1 + 84), "• Itemized Evidence Generator: Matches kW, V, IP ratings and active QCO statutory mandates", fill="#64748b", font=font_box_sub)

    draw_arrow_down(draw, 800, 680, 715, color="#059669", width=3)

    # Stage 6: Relationship Graph Engine
    b6_x1, b6_y1, b6_x2, b6_y2 = 340, 715, 1260, 815
    draw_rounded_rect(draw, [b6_x1, b6_y1, b6_x2, b6_y2], radius=10, fill="#ffffff", outline="#0284c7", width=2)
    draw_rounded_rect(draw, [b6_x1 + 16, b6_y1 + 10, b6_x1 + 110, b6_y1 + 30], radius=5, fill="#e0f2fe")
    draw.text((b6_x1 + 24, b6_y1 + 13), "STAGE 6", fill="#0369a1", font=font_stage)
    draw.text((b6_x1 + 120, b6_y1 + 11), "Focused Standards Relationship Graph Engine", fill="#0f172a", font=font_box_title)
    draw.text((b6_x1 + 20, b6_y1 + 40), "• Traverses 759 directed relationship edges: Normative References, Testing Standards, Safety Codes, Installation", fill="#334155", font=font_box_text)
    draw.text((b6_x1 + 20, b6_y1 + 62), "• React Flow DAG Construction: Auto-calculates topological coordinates with color-coded relation badges", fill="#0369a1", font=font_box_text)
    draw.text((b6_x1 + 20, b6_y1 + 84), "• Node Inspector: Deep-dives into scope, revision history, and full title for any connected node", fill="#64748b", font=font_box_sub)

    # Branch down into 3 final outputs
    draw.line([(800, 815), (800, 845)], fill="#64748b", width=3)
    draw.line([(250, 845), (1350, 845)], fill="#64748b", width=3)
    draw.line([(250, 845), (250, 870)], fill="#64748b", width=3)
    draw.polygon([(244, 860), (256, 860), (250, 870)], fill="#64748b")
    draw.line([(800, 845), (800, 870)], fill="#64748b", width=3)
    draw.polygon([(794, 860), (806, 860), (800, 870)], fill="#64748b")
    draw.line([(1350, 845), (1350, 870)], fill="#64748b", width=3)
    draw.polygon([(1344, 860), (1356, 860), (1350, 870)], fill="#64748b")

    # Output Card 1: Primary Standard & Evidence
    o1_x1, o1_y1, o1_x2, o1_y2 = 40, 870, 500, 1020
    draw_rounded_rect(draw, [o1_x1, o1_y1, o1_x2, o1_y2], radius=10, fill="#f0fdf4", outline="#16a34a", width=2)
    draw.text((o1_x1 + 16, o1_y1 + 14), "1. Primary Recommended Standard", fill="#15803d", font=font_box_title)
    draw.text((o1_x1 + 16, o1_y1 + 42), "• Top-Ranked Standard (e.g. IS 12615:2018)", fill="#0f172a", font=font_box_text)
    draw.text((o1_x1 + 16, o1_y1 + 64), "• Verified Parameter Match Checkpoints", fill="#334155", font=font_box_text)
    draw.text((o1_x1 + 16, o1_y1 + 86), "• Statutory BIS Scheme-I / CRS Mandate", fill="#334155", font=font_box_text)
    draw.text((o1_x1 + 16, o1_y1 + 108), "• Alternative Ranked Candidate Pool", fill="#64748b", font=font_box_sub)

    # Output Card 2: Interactive React Flow DAG
    o2_x1, o2_y1, o2_x2, o2_y2 = 540, 870, 1060, 1020
    draw_rounded_rect(draw, [o2_x1, o2_y1, o2_x2, o2_y2], radius=10, fill="#eff6ff", outline="#2563eb", width=2)
    draw.text((o2_x1 + 16, o2_y1 + 14), "2. Interactive React Flow DAG", fill="#1d4ed8", font=font_box_title)
    draw.text((o2_x1 + 16, o2_y1 + 42), "• Color-Coded Normative / Testing / Safety Nodes", fill="#0f172a", font=font_box_text)
    draw.text((o2_x1 + 16, o2_y1 + 64), "• Pan, Zoom, Interactive Graph Traversal", fill="#334155", font=font_box_text)
    draw.text((o2_x1 + 16, o2_y1 + 86), "• Slide-out Inspector Drawer for full clauses", fill="#334155", font=font_box_text)
    draw.text((o2_x1 + 16, o2_y1 + 108), "• Categorized Cross-Reference Tabs", fill="#64748b", font=font_box_sub)

    # Output Card 3: Tender Compliance Clause
    o3_x1, o3_y1, o3_x2, o3_y2 = 1100, 870, 1560, 1020
    draw_rounded_rect(draw, [o3_x1, o3_y1, o3_x2, o3_y2], radius=10, fill="#fdf4ff", outline="#a855f7", width=2)
    draw.text((o3_x1 + 16, o3_y1 + 14), "3. Tender Compliance Clause", fill="#7e22ce", font=font_box_title)
    draw.text((o3_x1 + 16, o3_y1 + 42), "• Grounded Compliance Clause for Tender NIT", fill="#0f172a", font=font_box_text)
    draw.text((o3_x1 + 16, o3_y1 + 64), "• Cites Mandatory Testing & Safety Standards", fill="#334155", font=font_box_text)
    draw.text((o3_x1 + 16, o3_y1 + 86), "• One-Click Clipboard Copy Modal", fill="#334155", font=font_box_text)
    draw.text((o3_x1 + 16, o3_y1 + 108), "• Eliminates Audit Objections & Legal Disputes", fill="#64748b", font=font_box_sub)

    # Footer note
    draw_rounded_rect(draw, [40, 1045, 1560, 1090], radius=8, fill="#0f172a")
    draw.text((60, 1058), "DETERMINISTIC LATENCY GUARANTEE: Sub-50ms CPU Execution  |  14/14 Pytest Test Cases Passing  |  SIH 2026 Problem Statement 26108", fill="#38bdf8", font=font_stage)

    flowchart_path = "documents/Workflow_Flowchart.png"
    img.save(flowchart_path, "PNG", quality=95)
    print(f"Flowchart generated: {flowchart_path}")
    return flowchart_path

if __name__ == "__main__":
    create_workflow_flowchart()
