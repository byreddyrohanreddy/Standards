import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_card(draw, xy, radius, fill, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow_down(draw, x, y1, y2, color="#38bdf8", width=3):
    draw.line([(x, y1), (x, y2)], fill=color, width=width)
    draw.polygon([(x - 8, y2 - 10), (x + 8, y2 - 10), (x, y2 + 2)], fill=color)

def generate_wide_ppt_sidebars():
    os.makedirs("documents", exist_ok=True)
    # Width 960, Height 1080 -> Fits the PPT right column perfectly
    width = 960
    height = 1080

    stages = [
        {
            "num": "STEP 1",
            "tag": "INPUT INGESTION",
            "title": "Tender & Requirement Ingestion",
            "desc": "Direct natural language text or scanned/digital Tender NIT PDFs parsed via PyMuPDF in <8ms.",
            "color_dark": "#60a5fa",
            "bg_dark": "#2563eb",
            "border_dark": "#3b82f6",
            "color_light": "#1d4ed8",
            "bg_light": "#dbeafe",
            "border_light": "#2563eb"
        },
        {
            "num": "STEP 2",
            "tag": "GENERIC PARSING",
            "title": "NLP Parameter Extraction & Segmentation",
            "desc": "Extracts 16 technical parameters (kW, Volts, Duty S1, IP55, Safety). Decomposes compound tenders.",
            "color_dark": "#2dd4bf",
            "bg_dark": "#0d9488",
            "border_dark": "#14b8a6",
            "color_light": "#0f766e",
            "bg_light": "#ccfbf1",
            "border_light": "#0d9488"
        },
        {
            "num": "STEP 3",
            "tag": "AUDIT PROTECTION",
            "title": "Version & Obsolescence Auditor",
            "desc": "Flags obsolete standards (e.g. IS 325:1996, IS 8112:1989) and automatically promotes modern active replacements.",
            "color_dark": "#fbbf24",
            "bg_dark": "#d97706",
            "border_dark": "#f59e0b",
            "color_light": "#b45309",
            "bg_light": "#fef3c7",
            "border_light": "#d97706"
        },
        {
            "num": "STEP 4",
            "tag": "DUAL RETRIEVAL",
            "title": "Chunk-Aware Hybrid Retrieval Engine",
            "desc": "Fuses BM25 Okapi lexical scoring + dense all-MiniLM-L6-v2 embeddings with structured chunk max-pooling.",
            "color_dark": "#c084fc",
            "bg_dark": "#7c3aed",
            "border_dark": "#8b5cf6",
            "color_light": "#6d28d9",
            "bg_light": "#ede9fe",
            "border_light": "#7c3aed"
        },
        {
            "num": "STEP 5",
            "tag": "OUTPUT & EXPORT",
            "title": "Verified Output & Tender Compliance Clause",
            "desc": "Primary recommended standard with verified evidence checklist, 759-edge React Flow DAG, and 1-click tender clause.",
            "color_dark": "#34d399",
            "bg_dark": "#059669",
            "border_dark": "#10b981",
            "color_light": "#047857",
            "bg_light": "#d1fae5",
            "border_light": "#059669"
        }
    ]

    # Fonts
    try:
        font_header = ImageFont.truetype("segoeuib.ttf", 26)
        font_sub = ImageFont.truetype("segoeui.ttf", 15)
        font_step_num = ImageFont.truetype("segoeuib.ttf", 14)
        font_tag = ImageFont.truetype("segoeuib.ttf", 13)
        font_title = ImageFont.truetype("segoeuib.ttf", 20)
        font_desc = ImageFont.truetype("segoeui.ttf", 16)
        font_footer = ImageFont.truetype("segoeuib.ttf", 13)
    except Exception:
        try:
            font_header = ImageFont.truetype("arialbd.ttf", 26)
            font_sub = ImageFont.truetype("arial.ttf", 15)
            font_step_num = ImageFont.truetype("arialbd.ttf", 14)
            font_tag = ImageFont.truetype("arialbd.ttf", 13)
            font_title = ImageFont.truetype("arialbd.ttf", 20)
            font_desc = ImageFont.truetype("arial.ttf", 16)
            font_footer = ImageFont.truetype("arialbd.ttf", 13)
        except Exception:
            font_header = font_sub = font_step_num = font_tag = font_title = font_desc = font_footer = ImageFont.load_default()

    # ==========================================
    # 1. DARK THEME (Sleek Tech Contrast)
    # ==========================================
    img_dark = Image.new("RGBA", (width, height), (15, 23, 42, 255))
    draw_dark = ImageDraw.Draw(img_dark)

    # Outer border
    draw_rounded_card(draw_dark, [12, 12, width - 12, height - 12], radius=16, fill="#0f172a", outline="#334155", width=2)

    # Top Header
    draw_rounded_card(draw_dark, [26, 24, width - 26, 96], radius=12, fill="#1e293b", outline="#3b82f6", width=2)
    draw_dark.text((46, 36), "BIS-SpecAI Architecture Workflow", fill="#38bdf8", font=font_header)
    draw_dark.text((46, 68), "Deterministic Multi-Domain Pipeline (SIH 2026 Problem Statement 26108)", fill="#94a3b8", font=font_sub)

    card_y = 114
    card_h = 145
    gap = 38

    for i, s in enumerate(stages):
        top = card_y + i * (card_h + gap)
        bot = top + card_h
        left = 32
        right = width - 32

        # Card container
        draw_rounded_card(draw_dark, [left, top, right, bot], radius=12, fill="#1e293b", outline=s["border_dark"], width=2)

        # Step Pill
        draw_rounded_card(draw_dark, [left + 20, top + 14, left + 104, top + 40], radius=6, fill=s["bg_dark"])
        draw_dark.text((left + 30, top + 18), s["num"], fill="#ffffff", font=font_step_num)

        # Stage Tag
        draw_dark.text((left + 118, top + 19), s["tag"], fill="#64748b", font=font_tag)

        # Title
        draw_dark.text((left + 20, top + 52), s["title"], fill=s["color_dark"], font=font_title)

        # Description
        draw_dark.text((left + 20, top + 88), s["desc"], fill="#e2e8f0", font=font_desc)

        # Arrow down
        if i < len(stages) - 1:
            draw_arrow_down(draw_dark, width // 2, bot + 4, bot + gap - 4, color="#38bdf8", width=3)

    # Footer
    draw_rounded_card(draw_dark, [26, height - 54, width - 26, height - 18], radius=8, fill="#0b1120", outline="#1e293b", width=1)
    draw_dark.text((44, height - 42), "113 Authentic Standards Catalog  |  Sub-50ms CPU Execution  |  14/14 Automated Tests Passed", fill="#38bdf8", font=font_footer)

    out_dark_png = "documents/Workflow_PPT_RightSide.png"
    img_dark.convert("RGB").save(out_dark_png, "PNG", quality=95)
    print(f"Saved: {out_dark_png}")

    # ==========================================
    # 2. LIGHT THEME (Matches White Slide Background)
    # ==========================================
    img_light = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw_light = ImageDraw.Draw(img_light)

    # Outer border
    draw_rounded_card(draw_light, [12, 12, width - 12, height - 12], radius=16, fill="#ffffff", outline="#cbd5e1", width=2)

    # Top Header
    draw_rounded_card(draw_light, [26, 24, width - 26, 96], radius=12, fill="#f8fafc", outline="#2563eb", width=2)
    draw_light.text((46, 36), "BIS-SpecAI Architecture Workflow", fill="#1e3a8a", font=font_header)
    draw_light.text((46, 68), "Deterministic Multi-Domain Pipeline (SIH 2026 Problem Statement 26108)", fill="#475569", font=font_sub)

    for i, s in enumerate(stages):
        top = card_y + i * (card_h + gap)
        bot = top + card_h
        left = 32
        right = width - 32

        # Card container
        draw_rounded_card(draw_light, [left, top, right, bot], radius=12, fill="#f8fafc", outline=s["border_light"], width=2)

        # Step Pill
        draw_rounded_card(draw_light, [left + 20, top + 14, left + 104, top + 40], radius=6, fill=s["border_light"])
        draw_light.text((left + 30, top + 18), s["num"], fill="#ffffff", font=font_step_num)

        # Stage Tag
        draw_light.text((left + 118, top + 19), s["tag"], fill="#64748b", font=font_tag)

        # Title
        draw_light.text((left + 20, top + 52), s["title"], fill=s["color_light"], font=font_title)

        # Description
        draw_light.text((left + 20, top + 88), s["desc"], fill="#1e293b", font=font_desc)

        # Arrow down
        if i < len(stages) - 1:
            draw_arrow_down(draw_light, width // 2, bot + 4, bot + gap - 4, color="#2563eb", width=3)

    # Footer
    draw_rounded_card(draw_light, [26, height - 54, width - 26, height - 18], radius=8, fill="#f1f5f9", outline="#e2e8f0", width=1)
    draw_light.text((44, height - 42), "113 Authentic Standards Catalog  |  Sub-50ms CPU Execution  |  14/14 Automated Tests Passed", fill="#1e3a8a", font=font_footer)

    out_light_png = "documents/Workflow_PPT_RightSide_Light.png"
    img_light.convert("RGB").save(out_light_png, "PNG", quality=95)
    print(f"Saved: {out_light_png}")

if __name__ == "__main__":
    generate_wide_ppt_sidebars()
