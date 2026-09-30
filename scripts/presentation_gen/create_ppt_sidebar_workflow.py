import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_card(draw, xy, radius, fill, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow_down(draw, x, y1, y2, color="#38bdf8", width=3):
    draw.line([(x, y1), (x, y2)], fill=color, width=width)
    draw.polygon([(x - 7, y2 - 9), (x + 7, y2 - 9), (x, y2 + 2)], fill=color)

def generate_ppt_sidebar():
    os.makedirs("documents", exist_ok=True)
    width = 680
    height = 1220
    img = Image.new("RGBA", (width, height), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    # Load high-quality system fonts
    try:
        font_header = ImageFont.truetype("segoeuib.ttf", 25)
        font_sub = ImageFont.truetype("segoeui.ttf", 13)
        font_step_num = ImageFont.truetype("segoeuib.ttf", 12)
        font_title = ImageFont.truetype("segoeuib.ttf", 17)
        font_desc = ImageFont.truetype("segoeui.ttf", 13)
        font_tag = ImageFont.truetype("segoeuib.ttf", 11)
    except Exception:
        try:
            font_header = ImageFont.truetype("arialbd.ttf", 25)
            font_sub = ImageFont.truetype("arial.ttf", 13)
            font_step_num = ImageFont.truetype("arialbd.ttf", 12)
            font_title = ImageFont.truetype("arialbd.ttf", 17)
            font_desc = ImageFont.truetype("arial.ttf", 13)
            font_tag = ImageFont.truetype("arialbd.ttf", 11)
        except Exception:
            font_header = font_sub = font_step_num = font_title = font_desc = font_tag = ImageFont.load_default()

    # Outer decorative slate border
    draw_rounded_card(draw, [15, 15, width - 15, height - 15], radius=16, fill="#0f172a", outline="#334155", width=2)

    # Header Card
    draw_rounded_card(draw, [28, 28, width - 28, 108], radius=12, fill="#1e293b", outline="#3b82f6", width=2)
    draw.text((45, 40), "BIS-SpecAI Pipeline", fill="#38bdf8", font=font_header)
    draw.text((45, 73), "End-to-End Recommendation Flow (SIH 2026)", fill="#94a3b8", font=font_sub)

    # 5 Clear Sequential Stages for PPT
    stages = [
        {
            "num": "STEP 1",
            "num_bg": "#2563eb",
            "title": "Tender & Requirement Input",
            "title_color": "#60a5fa",
            "lines": [
                "• Ingestion of Tender NIT PDFs (PyMuPDF) or text",
                "• Sub-8ms text stream parsing & character validation"
            ],
            "tag": "INPUT INGESTION",
            "border": "#2563eb"
        },
        {
            "num": "STEP 2",
            "num_bg": "#0d9488",
            "title": "NLP Parameter Extraction",
            "title_color": "#2dd4bf",
            "lines": [
                "• Extracts 16 technical parameters (kW, V, Duty, IP55)",
                "• Decomposes compound tenders into item groups"
            ],
            "tag": "GENERIC PARSING",
            "border": "#0d9488"
        },
        {
            "num": "STEP 3",
            "num_bg": "#d97706",
            "title": "Version & Obsolescence Audit",
            "title_color": "#fbbf24",
            "lines": [
                "• Detects superseded citations (IS 325, IS 8112)",
                "• Automatically promotes modern active replacements"
            ],
            "tag": "AUDIT PROTECTION",
            "border": "#d97706"
        },
        {
            "num": "STEP 4",
            "num_bg": "#7c3aed",
            "title": "Chunk-Aware Hybrid Retrieval",
            "title_color": "#c084fc",
            "lines": [
                "• Fuses BM25 Okapi lexical match + dense embeddings",
                "• Structured chunk max-pooling across [scope, testing]"
            ],
            "tag": "DUAL RETRIEVAL",
            "border": "#7c3aed"
        },
        {
            "num": "STEP 5",
            "num_bg": "#059669",
            "title": "Verified Output & Tender Clause",
            "title_color": "#34d399",
            "lines": [
                "• Primary IS with parameter evidence checklist",
                "• 759-edge React Flow DAG & 1-click tender clause"
            ],
            "tag": "OUTPUT & EXPORT",
            "border": "#059669"
        }
    ]

    card_y = 130
    card_h = 165
    gap = 42

    for i, s in enumerate(stages):
        top = card_y + i * (card_h + gap)
        bot = top + card_h
        left = 35
        right = width - 35

        # Card body
        draw_rounded_card(draw, [left, top, right, bot], radius=12, fill="#1e293b", outline=s["border"], width=2)

        # Stage Badge
        draw_rounded_card(draw, [left + 18, top + 14, left + 92, top + 36], radius=6, fill=s["num_bg"])
        draw.text((left + 26, top + 17), s["num"], fill="#ffffff", font=font_step_num)

        # Tag Category
        draw.text((left + 104, top + 18), s["tag"], fill="#64748b", font=font_tag)

        # Title
        draw.text((left + 18, top + 48), s["title"], fill=s["title_color"], font=font_title)

        # Bullet lines
        line_y = top + 84
        for line in s["lines"]:
            draw.text((left + 18, line_y), line, fill="#e2e8f0", font=font_desc)
            line_y += 24

        # Connecting Arrow to next stage
        if i < len(stages) - 1:
            draw_arrow_down(draw, width // 2, bot + 4, bot + gap - 4, color="#38bdf8", width=3)

    # Footer metrics badge
    draw_rounded_card(draw, [28, height - 62, width - 28, height - 24], radius=10, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((45, height - 48), "113 Standards Catalog  |  <50ms CPU Latency  |  14/14 Tests Passed", fill="#38bdf8", font=font_tag)

    out_png = "documents/Workflow_PPT_Sidebar.png"
    out_jpg = "documents/Workflow_PPT_Sidebar.jpg"
    img.convert("RGB").save(out_png, "PNG", quality=95)
    img.convert("RGB").save(out_jpg, "JPEG", quality=95)
    print(f"Refined PPT Sidebar Workflow saved: {out_png}")

if __name__ == "__main__":
    generate_ppt_sidebar()
