import io
from typing import Dict, Any, List
import pymupdf  # PyMuPDF modern import

class PDFParserService:
    def extract_text_from_pdf_bytes(self, pdf_bytes: bytes) -> str:
        """Extracts text from PDF bytes using PyMuPDF."""
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        text_pages = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            text_pages.append(page.get_text())
        doc.close()
        return "\n".join(text_pages).strip()
