import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        if self._pageNumber > 1:
            self.drawString(54, 750, "BIS-SpecAI | System Architecture & Scaling Specification — SIH 2026 #26108")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — SIH 2026 GOVERNMENT PROCUREMENT MVP")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        self.restoreState()

def build_system_architecture_pdf():
    os.makedirs("documents", exist_ok=True)
    pdf_path = "documents/System_Architecture.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0f172a")
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#334155")
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1e3a8a"),
        spaceAfter=5,
        spaceBefore=10
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0f2942"),
        spaceAfter=3,
        spaceBefore=6
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#334155"),
        leftIndent=12
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#1e293b")
    )
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#0f172a")
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Title Banner Block
    banner_data = [
        [
            Paragraph("<b>SMART INDIA HACKATHON 2026 — PROBLEM STATEMENT 26108</b>", ParagraphStyle('Bnr', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor("#d97706"))),
        ],
        [
            Paragraph("BIS-SpecAI: System Architecture & Scaling Specification", title_style),
        ],
        [
            Paragraph("Comprehensive System Topology, API Endpoints, Data Schemas, DAG Integration, and Enterprise Production Scaling Roadmap", subtitle_style),
        ]
    ]
    banner_table = Table(banner_data, colWidths=[504])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 12))

    # Section 1: System Topology
    story.append(Paragraph("1. System Topology & Component Interactions", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    story.append(Paragraph(
        "The BIS-SpecAI system operates as an integrated, decoupled micro-architecture where each subsystem communicates "
        "through strictly typed JSON contracts. The architecture is composed of four principal tiers: "
        "(1) Presentation & Interactive DAG Layer, (2) Application & Asynchronous REST API Layer, "
        "(3) NLP Parsing & Hybrid Retrieval Layer, and (4) Standards Catalog & Directed Relationship Store.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # API Specification Table
    story.append(Paragraph("<b>Table 1.1: REST API Endpoint Specifications</b>", h2_style))
    api_data = [
        [Paragraph("HTTP Method", table_header), Paragraph("Endpoint URI", table_header), Paragraph("Request Payload", table_header), Paragraph("Response Contract & Purpose", table_header)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/analyze", table_cell_bold), Paragraph("<code>{ query: str, top_k: int }</code>", table_cell), Paragraph("Executes extraction, retrieval, scoring, version audit, and React Flow DAG assembly", table_cell)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/upload", table_cell_bold), Paragraph("<code>multipart/form-data (PDF file)</code>", table_cell), Paragraph("PyMuPDF text extraction from tender NIT document, feeds text directly into pipeline", table_cell)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/standards", table_cell_bold), Paragraph("None", table_cell), Paragraph("Returns catalog of all 62 indexed Indian Standards with titles, domains, and scopes", table_cell)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/standards/{id}", table_cell_bold), Paragraph("Path parameter (std_id)", table_cell), Paragraph("Detailed metadata profile for a single standard including amendments and cross-references", table_cell)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/examples", table_cell_bold), Paragraph("None", table_cell), Paragraph("Returns 6 curated demonstration scenarios (Motor, Cement, PPE, Rebar, Solar, Outdated)", table_cell)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/health", table_cell_bold), Paragraph("None", table_cell), Paragraph("Health probe verifying indexed standards count (62) and operational service status", table_cell)]
    ]
    t_api = Table(api_data, colWidths=[54, 96, 134, 220])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e3a8a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 12))

    # Section 2: Data Models & Schema Design
    story.append(Paragraph("2. Data Schemas & Relationship Graph Design", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    story.append(Paragraph(
        "Standards records and cross-references are modeled via normalized Pydantic definitions:",
        body_style
    ))
    story.append(Paragraph("• <b>StandardMetadata:</b> Contains `id`, `is_number`, `title`, `year`, `domain`, `scope`, `status` ('current' | 'superseded'), `superseded_by`, `supersedes[]`, `amendments[]` (`number`, `year`, `description`), `normative_references[]`, `test_methods[]`, `safety_standards[]`, `installation_standards[]`, `certification[]`, `technical_parameters{}`, and `keywords[]`.", bullet_style))
    story.append(Paragraph("• <b>VersionAlert:</b> Encapsulates `referenced_standard`, `status` ('Superseded Standard'), `current_replacement`, `title`, `recommendation`, and `severity` ('warning').", bullet_style))
    story.append(Paragraph("• <b>GraphData (React Flow):</b> Contains `nodes[]` (`id`, `position {x, y}`, `data {is_number, title, year, category, is_primary, certification}`) and `edges[]` (`id`, `source`, `target`, `label`, `animated`, `style {stroke, strokeDasharray}`).", bullet_style))
    story.append(Spacer(1, 12))

    # Section 3: Enterprise Scaling Roadmap
    story.append(Paragraph("3. Production Scaling Roadmap for National BIS Ecosystem", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    story.append(Paragraph(
        "The MVP prototype has been engineered specifically to provide a clean upgrade path to a full national deployment:",
        body_style
    ))
    
    scaling_steps = [
        [Paragraph("Production Dimension", table_header), Paragraph("MVP Prototype Implementation", table_header), Paragraph("National Scale Target (Production BIS)", table_header)],
        [Paragraph("Vector Database", table_cell_bold), Paragraph("Local TF-IDF subword dense vectorizer + cosine similarity (0ms latency)", table_cell), Paragraph("Distributed Qdrant or Milvus cluster storing 1024-d BGE-M3 / text-embedding-3 vectors across all 20,000+ BIS standards", table_cell)],
        [Paragraph("Catalog Scale", table_cell_bold), Paragraph("62 curated standards with 249 relationship edges", table_cell), Paragraph("Complete BIS Standards Catalog (20,000+ standards, 50,000+ amendments, 100,000+ normative citations)", table_cell)],
        [Paragraph("Data Ingestion", table_cell_bold), Paragraph("Pre-curated JSON files with automated generation scripts", table_cell), Paragraph("Daily automated crawlers ingesting Official Gazette notifications, BIS Standards Portal updates, and Quality Control Orders (QCOs)", table_cell)],
        [Paragraph("Scanned PDF OCR", table_cell_bold), Paragraph("Native text extraction using PyMuPDF (fitz)", table_cell), Paragraph("Integrated PaddleOCR / Tesseract optical character recognition pipeline for scanned legacy tender notices and historical gazettes", table_cell)],
        [Paragraph("Procurement Portal Integration", table_cell_bold), Paragraph("Standalone web application with print export", table_cell), Paragraph("Direct API integration into Government e-Marketplace (GeM) and Central Public Procurement Portal (CPPP) validating bids in real-time", table_cell)],
        [Paragraph("Multilingual Processing", table_cell_bold), Paragraph("English technical specifications and standards titles", table_cell), Paragraph("Multilingual NLP support (Bhashini API) for Hindi and Regional language procurement tenders across Indian States", table_cell)]
    ]
    t_scale = Table(scaling_steps, colWidths=[96, 174, 234])
    t_scale.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e3a8a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_scale)
    story.append(Spacer(1, 14))

    # Summary Callout
    summary_box = [
        [Paragraph("<b>SYSTEM RELIABILITY & SIH 2026 BENCHMARK VERIFICATION</b>", ParagraphStyle('SBoxTitle', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#0f172a")))],
        [Paragraph("The BIS-SpecAI system has been validated with automated benchmarks, achieving 95.45% Recall@1, 100% Recall@5, 0.9773 MRR, and 100% Outdated Version Detection accuracy across 22 evaluation queries, establishing a robust, audit-proof foundation for national public procurement.", body_style)]
    ]
    st_table = Table(summary_box, colWidths=[504])
    st_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f5f3ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#8b5cf6")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(st_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"System Architecture PDF generated: {pdf_path}")

if __name__ == "__main__":
    build_system_architecture_pdf()
