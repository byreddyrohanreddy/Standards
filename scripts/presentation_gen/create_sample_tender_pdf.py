import pymupdf

def create_sample_tender_pdf(output_path="sample_tender_document.pdf"):
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842) # A4 size

    # Clean text layout
    header_rect = pymupdf.Rect(50, 40, 545, 90)
    page.insert_textbox(
        header_rect,
        "GOVERNMENT OF INDIA\nCENTRAL PUBLIC WORKS & WATER SUPPLY DEPARTMENT\nNOTICE INVITING TENDER (NIT)",
        fontsize=13,
        fontname="helv",
        align=pymupdf.TEXT_ALIGN_CENTER
    )

    tender_meta = (
        "Tender Ref: CPWD/WSD/2026/EL-049\n"
        "Date of Issuance: 14-September-2026\n"
        "Item: Pumping Machinery and Auxiliary Motor Electrification Works"
    )
    page.insert_textbox(pymupdf.Rect(50, 100, 545, 150), tender_meta, fontsize=10, fontname="helv")

    specs_text = """SECTION IV: TECHNICAL SPECIFICATIONS & STANDARDS OF WORK

1. SCOPE OF SUPPLY:
The contractor shall supply, install, test and commission Three-Phase Squirrel Cage Induction Motors for raw water pumping station duty.

2. TECHNICAL SPECIFICATIONS:
- Motor Capacity: 15 kW (20 HP continuous S1 duty)
- Electrical System: 415 V ± 10%, 50 Hz ± 5%, 3-Phase AC supply
- Operating Speed: 1440 RPM (4 Pole)
- Enclosure & Ingress Protection: Totally Enclosed Fan Cooled (TEFC) with minimum IP55 protection suitable for humid pumphouse conditions.
- Energy Efficiency: The motor must conform to Premium Energy Efficiency Class (IE3) in accordance with applicable Indian Standards.
- Insulation: Class F insulation with temperature rise limited to Class B limits.

3. GOVERNING CODES & STANDARDS:
- Induction motor performance and energy efficiency must strictly conform to IS 12615.
- Note for bidders: Tender specification originally referred to legacy standard IS 325:1996 which has been audited.
- Testing for efficiency and losses shall be conducted in accordance with IS 15999 (Part 2/Sec 1).
- Degrees of protection by integral enclosure design shall conform to IS/IEC 60034-5.
- Terminal markings and phase rotation shall comply with IS/IEC 60034-8.
- Earthing pit and body earthing shall be provided as per Code of Practice IS 3043:2018.

4. CERTIFICATION REQUIREMENTS:
- The equipment must carry mandatory BIS Scheme-I (ISI Mark) under the Electrical Motors Quality Control Order (QCO).
- Manufacturer test certificate for routine tests and type tests must be submitted along with delivery."""

    page.insert_textbox(pymupdf.Rect(50, 160, 545, 780), specs_text, fontsize=9.5, fontname="helv")

    doc.save(output_path)
    doc.close()
    print(f"Sample tender PDF generated: {output_path}")

if __name__ == "__main__":
    create_sample_tender_pdf()
