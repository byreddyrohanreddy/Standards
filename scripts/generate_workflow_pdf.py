import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image as RLImage
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
            self.drawString(54, 750, "BIS-SpecAI | End-to-End Workflow Architecture — SIH 2026 #26108")
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

def build_workflow_pdf():
    os.makedirs("documents", exist_ok=True)
    pdf_path = "documents/Workflow_Architecture.pdf"
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
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a")
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
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
            Paragraph("BIS-SpecAI: End-to-End Workflow & Pipeline Architecture", title_style),
        ],
        [
            Paragraph("Detailed Lifecycle of Procurement Requirement Ingestion, Dynamic NLP Extraction, Version Auditing, Hybrid Retrieval, Explainability, and Graph Traversal", subtitle_style),
        ]
    ]
    banner_table = Table(banner_data, colWidths=[504])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # START OF PDF: Visual Pipeline Flowchart
    flowchart_path = "documents/Workflow_Flowchart.png"
    if os.path.exists(flowchart_path):
        story.append(Paragraph("<b>EXECUTIVE WORKFLOW & PIPELINE FLOWCHART</b>", h2_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
        # 504 pt width, aspect ratio 1120 / 1600 * 504 = 352.8 pt height
        story.append(RLImage(flowchart_path, width=504, height=353))
        story.append(Spacer(1, 6))
        story.append(Paragraph(
            "<i>Figure 1: Complete deterministic dataflow of BIS-SpecAI from procurement tender specification to verified primary Indian Standard, multi-chunk dense retrieval, version alerts, relationship DAG traversal, and tender compliance clause generation.</i>",
            ParagraphStyle('FigCap', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, leading=10.5, textColor=colors.HexColor("#64748b"))
        ))
        story.append(Spacer(1, 10))
        # Flowchart occupies page 1; detailed tables and narrative begin on page 2
        story.append(PageBreak())

    # Section 1: End-to-End Workflow Lifecycle (Begins on Page 2)
    story.append(Paragraph("1. End-to-End Recommendation Pipeline Workflow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    story.append(Paragraph(
        "The core intelligence of BIS-SpecAI is executed across an 8-stage synchronous workflow. "
        "Every incoming tender specification or user query traverses this lifecycle in sub-50 milliseconds, "
        "transforming unstructured technical prose into structured, verified, and explainable Indian Standards recommendations.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Stage Matrix Table
    workflow_stages = [
        [Paragraph("Stage", table_header), Paragraph("Pipeline Phase", table_header), Paragraph("Input / Output", table_header), Paragraph("Key Algorithmic Operation", table_header)],
        [Paragraph("Stage 1", table_cell_bold), Paragraph("Specification Ingestion", table_cell_bold), Paragraph("Text prompt or Tender PDF", table_cell), Paragraph("PyMuPDF C-bindings extract raw text stream; validates minimum length (<8ms)", table_cell)],
        [Paragraph("Stage 2", table_cell_bold), Paragraph("NLP & Multi-Req Segmenter", table_cell_bold), Paragraph("Raw text → ExtractedRequirements", table_cell), Paragraph("Extracts 16 parameters (kW, V, Duty, IP, Safety); segments compound tenders into independent groups", table_cell)],
        [Paragraph("Stage 3", table_cell_bold), Paragraph("Version & Obsolescence Audit", table_cell_bold), Paragraph("Citations → VersionAlert[]", table_cell), Paragraph("Identifies obsolete citations (IS 325, IS 8112) and automatically promotes active replacements", table_cell)],
        [Paragraph("Stage 4", table_cell_bold), Paragraph("Chunk-Aware Hybrid Retrieval", table_cell_bold), Paragraph("Query → Candidate Pool", table_cell), Paragraph("BM25 Okapi lexical scoring + all-MiniLM-L6-v2 dense embeddings with structured chunk max-pooling", table_cell)],
        [Paragraph("Stage 5", table_cell_bold), Paragraph("Multi-Factor Reranking & Gate", table_cell_bold), Paragraph("Candidates → Ranked Top-K", table_cell), Paragraph("Final Score = 0.35(Dense) + 0.25(BM25) + 0.20(Scope) + 0.10(Domain) + 0.10(Ver); rejects score < 0.40", table_cell)],
        [Paragraph("Stage 6", table_cell_bold), Paragraph("Explainability & Evidence", table_cell_bold), Paragraph("Scores → Evidence Checklist", table_cell), Paragraph("Itemizes matched parameters (kW, V, IP55, S1), active edition, and statutory QCO mandate", table_cell)],
        [Paragraph("Stage 7", table_cell_bold), Paragraph("Graph Traversal", table_cell_bold), Paragraph("Primary Std → Categorized DAG", table_cell), Paragraph("Traverses 759 relationship edges across 113 standards into Normative, Testing, Safety & Installation tabs", table_cell)],
        [Paragraph("Stage 8", table_cell_bold), Paragraph("UI, Graph & Tender Clause", table_cell_bold), Paragraph("GraphData → React Flow / Clause", table_cell), Paragraph("Renders React Flow DAG, node inspector drawer, and generates tender compliance clause", table_cell)]
    ]
    t_stages = Table(workflow_stages, colWidths=[44, 96, 124, 240])
    t_stages.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e3a8a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_stages)
    story.append(Spacer(1, 12))

    # Section 2: Detailed Workflow Stages
    story.append(Paragraph("2. Deep-Dive: Stage-by-Stage Processing Logic", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    
    story.append(Paragraph("<b>2.1 Stage 1 & 2: Tender Parsing & Dynamic NLP Understanding</b>", h2_style))
    story.append(Paragraph(
        "When an NIT PDF is uploaded (e.g. `sample_tender_document.pdf`), `PDFParserService` uses PyMuPDF's zero-copy "
        "memory stream to extract text blocks in under 8 ms. `nlp_extractor.py` scans the text using deterministic regex patterns: "
        "electrical power (`(\\d+)\\s*(kw|hp|kva)`), voltages (`(\\d+)\\s*(v|kv)`), frequencies (`(\\d+)\\s*hz`), phase counts, "
        "ingress protection (`ip\\s*\\d{2}`), and civil grades (`m-?\\d{2}`, `fe\\s*\\d{3}`). This guarantees accurate structured extraction "
        "without dependency on third-party cloud APIs.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>2.2 Stage 3: Version Detection & Supersession Audit Workflow</b>", h2_style))
    story.append(Paragraph(
        "The `VersionAuditor` operates a two-tier verification mechanism: (1) Exact match against obsolete standard codes "
        "in `superseded_map`, and (2) Base number analysis (e.g. checking whether `IS 325` without year has been superseded by `IS 12615:2018`). "
        "If an obsolete standard is identified, an alert is injected with the exact modern standard number, the superseding year, "
        "and a tailored recommendation for tender officers. Crucially, the engine automatically promotes the modern replacement to the top of the candidate pool.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>2.3 Stage 4 & 5: Hybrid Dual-Channel Retrieval & Multi-Factor Scoring</b>", h2_style))
    story.append(Paragraph(
        "Lexical search alone suffers from synonym blindness (e.g., 'squirrel cage' vs 'line operated'), while vector search alone "
        "can blur precise numerical ratings (e.g., 415 V vs 11 kV). BIS-SpecAI solves this via dual-channel fusion:",
        body_style
    ))
    story.append(Paragraph("• <b>Lexical Channel (BM25):</b> Matches specific technical keywords, exact IS numbers, and part designations.", bullet_style))
    story.append(Paragraph("• <b>Dense Semantic Channel:</b> Sentence-Transformers (all-MiniLM-L6-v2, 384-dim) over 113 standards and 791 structured chunks with chunk max-pooling.", bullet_style))
    story.append(Paragraph("• <b>Coverage Reranker:</b> Verifies that extracted numerical parameters (kW, V, IP55) are within the standard's scope.", bullet_style))
    story.append(Paragraph("• <b>Status Calibrator:</b> Assigns high confidence (1.0) to active standards while penalizing obsolete ones (0.4) unless explicitly requested.", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>2.4 Stage 6 & 7: Explainability Generation & Graph Traversal</b>", h2_style))
    story.append(Paragraph(
        "Instead of generic AI hallucinations, the explainability checklist is grounded in retrieved factual evidence: "
        "citing the exact power match, voltage coverage, active edition year, and Quality Control Order (QCO) compliance. "
        "`StandardsGraphService` then executes a breadth-first traversal of the 759 relationship edges across 113 authentic standards in `relationships.json`, "
        "categorizing nodes into Normative References, Test Methods, Safety Codes, Installation Guidelines, and Superseded Editions.",
        body_style
    ))
    story.append(Spacer(1, 12))

    # Section 3: Trace of Concrete User Scenarios
    story.append(Paragraph("3. End-to-End Concrete Execution Trace", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3a8a"), spaceAfter=6))
    
    trace_data = [
        [Paragraph("Execution Step", table_header), Paragraph("Induction Motor Scenario", table_header), Paragraph("Legacy Tender Audit Scenario", table_header)],
        [Paragraph("1. Raw Input Query", table_cell_bold), Paragraph("15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP55 protection requirements.", table_cell), Paragraph("Supply of three-phase squirrel cage induction motor as per IS 325:1996 and 43G cement conforming to IS 8112:1989.", table_cell)],
        [Paragraph("2. NLP Extracted Data", table_cell_bold), Paragraph("Product: Three-Phase AC Induction Motor<br/>Ratings: 15 kW, 415 V, 50 Hz, 3-Phase, IP55<br/>Application: Industrial Operation", table_cell), Paragraph("Product: Electric Motor & Cement<br/>Citations Detected: IS 325:1996, IS 8112:1989<br/>Domain: Multi-sector", table_cell)],
        [Paragraph("3. Version Audit Alert", table_cell_bold), Paragraph("None (Standard specification conforms to current norms)", table_cell), Paragraph("<b>Alert 1:</b> IS 325:1996 Superseded by IS 12615:2018<br/><b>Alert 2:</b> IS 8112:1989 Superseded by IS 269:2015", table_cell)],
        [Paragraph("4. Primary Recommendation", table_cell_bold), Paragraph("<b>IS 12615:2018</b> (Line Operated AC Motors - Energy Efficient IE Code)", table_cell), Paragraph("<b>IS 12615:2018</b> (Promoted Active Replacement) & <b>IS 269:2015</b>", table_cell)],
        [Paragraph("5. AI Relevance Score", table_cell_bold), Paragraph("<b>82.4%</b> AI relevance score", table_cell), Paragraph("<b>77.3%</b> AI relevance score (Replacement boost)", table_cell)],
        [Paragraph("6. Explainability Checklist", table_cell_bold), Paragraph("✓ Power: 15 kW covered<br/>✓ Voltage: 415 V addressed<br/>✓ Frequency: 50 Hz covered<br/>✓ Active 2018 Edition<br/>✓ Mandatory Scheme-I ISI Mark", table_cell), Paragraph("✓ Promoted modern replacement for IS 325:1996<br/>✓ Mandatory under Electrical Motors QCO<br/>✓ Eliminates procurement tender audit dispute risk", table_cell)],
        [Paragraph("7. Traversed Graph Nodes", table_cell_bold), Paragraph("• Normative: IS/IEC 60034-1, 60034-5, 60034-8<br/>• Testing: IS 15999 (Part 2/Sec 1)<br/>• Safety: IS 3043 (Earthing)<br/>• Installation: IS 900", table_cell), Paragraph("• Superseded: IS 325:1996<br/>• Active Modern: IS 12615:2018<br/>• Normative Test: IS 15999<br/>• Safety: IS/IEC 60034-5", table_cell)]
    ]
    t_trace = Table(trace_data, colWidths=[90, 207, 207])
    t_trace.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e3a8a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_trace)
    story.append(Spacer(1, 14))

    # Summary Callout
    summary_box = [
        [Paragraph("<b>WORKFLOW DETERMINISM & REPRODUCIBILITY</b>", ParagraphStyle('WBoxTitle', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#0f172a")))],
        [Paragraph("Every stage of the BIS-SpecAI workflow produces deterministic, inspectable JSON outputs. The entire process requires no probabilistic hallucination, operates entirely offline on local compute, and delivers verifiable compliance with statutory BIS Quality Control Orders.", body_style)]
    ]
    st_table = Table(summary_box, colWidths=[504])
    st_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ecfdf5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10b981")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(st_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Workflow PDF generated: {pdf_path}")

if __name__ == "__main__":
    build_workflow_pdf()
