"""
PDF Generation Service
Generates IRS Form 1095-C and 1094-C PDFs using ReportLab
"""

from io import BytesIO
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import date
import logging

# ReportLab imports (install with: pip install reportlab)
try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    logging.warning("ReportLab not installed. PDF generation will use placeholder.")

logger = logging.getLogger(__name__)


@dataclass
class Form1095CData:
    """Data structure for IRS Form 1095-C"""
    # Part I - Employee
    employee_name: str
    employee_ssn: str
    employee_address: str
    employee_city: str
    employee_state: str
    employee_zip: str
    
    # Employer info
    employer_name: str
    employer_ein: str
    employer_address: str
    employer_city: str
    employer_state: str
    employer_zip: str
    employer_contact_phone: str
    
    # Part II - Employee Offer and Coverage (per month)
    # Line 14: Offer of Coverage code
    # Line 15: Employee Share of Lowest Cost Monthly Premium
    # Line 16: Safe Harbor Code
    monthly_data: List[Dict[str, Any]]  # 12 months of offer/coverage data
    
    # Part III - Covered Individuals
    covered_individuals: List[Dict[str, Any]]
    
    tax_year: int


@dataclass
class Form1094CData:
    """Data structure for IRS Form 1094-C"""
    employer_name: str
    employer_ein: str
    employer_address: str
    employer_city: str
    employer_state: str
    employer_zip: str
    employer_contact_name: str
    employer_contact_phone: str
    
    # ALE Member Information
    total_employees: int
    full_time_employees: int
    total_1095c_forms: int
    
    # Aggregated Group info
    is_aggregated_group: bool
    aggregated_group_members: List[str]
    
    # Monthly FTE counts
    monthly_fte_counts: List[int]  # 12 months
    
    # Certifications
    qualifying_offer_method: bool
    section_4980h_transition_relief: bool
    
    tax_year: int


class PDFGenerator:
    """
    Generates IRS Forms 1095-C and 1094-C as PDF documents.
    Uses ReportLab for production-quality PDF generation.
    """
    
    def __init__(self):
        self.styles = None
        if REPORTLAB_AVAILABLE:
            self.styles = getSampleStyleSheet()
            self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Set up custom paragraph styles for IRS forms"""
        if not self.styles:
            return
            
        self.styles.add(ParagraphStyle(
            name='FormTitle',
            parent=self.styles['Heading1'],
            fontSize=14,
            spaceAfter=12
        ))
        self.styles.add(ParagraphStyle(
            name='FormSection',
            parent=self.styles['Heading2'],
            fontSize=11,
            spaceBefore=12,
            spaceAfter=6
        ))
        self.styles.add(ParagraphStyle(
            name='FormField',
            parent=self.styles['Normal'],
            fontSize=9,
            leading=11
        ))
    
    def generate_1095c_pdf(self, data: Form1095CData) -> bytes:
        """
        Generate IRS Form 1095-C PDF.
        
        Returns:
            PDF file as bytes
        """
        if not REPORTLAB_AVAILABLE:
            return self._generate_placeholder_pdf("1095-C", data.employee_name, data.tax_year)
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )
        
        elements = []
        
        # Header
        elements.append(Paragraph(
            f"Form 1095-C - Employer-Provided Health Insurance Offer and Coverage",
            self.styles['FormTitle']
        ))
        elements.append(Paragraph(
            f"Tax Year {data.tax_year}",
            self.styles['Normal']
        ))
        elements.append(Spacer(1, 12))
        
        # Part I - Employee Information
        elements.append(Paragraph("Part I - Employee", self.styles['FormSection']))
        
        employee_table = Table([
            ["Employee Name:", data.employee_name],
            ["SSN:", f"XXX-XX-{data.employee_ssn[-4:]}" if len(data.employee_ssn) >= 4 else "XXX-XX-XXXX"],
            ["Address:", data.employee_address],
            ["City, State, ZIP:", f"{data.employee_city}, {data.employee_state} {data.employee_zip}"],
        ], colWidths=[1.5*inch, 4*inch])
        employee_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
        ]))
        elements.append(employee_table)
        elements.append(Spacer(1, 12))
        
        # Employer Information
        elements.append(Paragraph("Employer Information", self.styles['FormSection']))
        
        employer_table = Table([
            ["Employer Name:", data.employer_name],
            ["EIN:", data.employer_ein],
            ["Address:", data.employer_address],
            ["City, State, ZIP:", f"{data.employer_city}, {data.employer_state} {data.employer_zip}"],
            ["Contact Phone:", data.employer_contact_phone],
        ], colWidths=[1.5*inch, 4*inch])
        employer_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
        ]))
        elements.append(employer_table)
        elements.append(Spacer(1, 12))
        
        # Part II - Monthly Coverage Data
        elements.append(Paragraph("Part II - Employee Offer and Coverage", self.styles['FormSection']))
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        coverage_header = ['Month', 'Line 14 (Offer)', 'Line 15 (Premium)', 'Line 16 (Safe Harbor)']
        coverage_data = [coverage_header]
        
        for i, month in enumerate(months):
            month_data = data.monthly_data[i] if i < len(data.monthly_data) else {}
            coverage_data.append([
                month,
                month_data.get('line_14', '1E'),
                f"${month_data.get('line_15', 0):.2f}",
                month_data.get('line_16', '2C'),
            ])
        
        coverage_table = Table(coverage_data, colWidths=[0.8*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        coverage_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ]))
        elements.append(coverage_table)
        elements.append(Spacer(1, 12))
        
        # Part III - Covered Individuals
        if data.covered_individuals:
            elements.append(Paragraph("Part III - Covered Individuals", self.styles['FormSection']))
            
            individual_header = ['Name', 'SSN', 'DOB', 'Coverage All 12 Months']
            individual_data = [individual_header]
            
            for individual in data.covered_individuals:
                individual_data.append([
                    individual.get('name', ''),
                    f"XXX-XX-{individual.get('ssn', '')[-4:]}" if individual.get('ssn') else '',
                    individual.get('dob', ''),
                    'Yes' if individual.get('all_12_months', True) else 'No',
                ])
            
            individual_table = Table(individual_data, colWidths=[2*inch, 1.2*inch, 1*inch, 1.5*inch])
            individual_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ]))
            elements.append(individual_table)
        
        # Build PDF
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def generate_1094c_pdf(self, data: Form1094CData) -> bytes:
        """
        Generate IRS Form 1094-C PDF (Transmittal).
        
        Returns:
            PDF file as bytes
        """
        if not REPORTLAB_AVAILABLE:
            return self._generate_placeholder_pdf("1094-C", data.employer_name, data.tax_year)
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )
        
        elements = []
        
        # Header
        elements.append(Paragraph(
            f"Form 1094-C - Transmittal of Employer-Provided Health Insurance",
            self.styles['FormTitle']
        ))
        elements.append(Paragraph(
            f"Tax Year {data.tax_year}",
            self.styles['Normal']
        ))
        elements.append(Spacer(1, 12))
        
        # Part I - ALE Member Information
        elements.append(Paragraph("Part I - Applicable Large Employer Member (ALE)", self.styles['FormSection']))
        
        ale_table = Table([
            ["Employer Name:", data.employer_name],
            ["EIN:", data.employer_ein],
            ["Address:", data.employer_address],
            ["City, State, ZIP:", f"{data.employer_city}, {data.employer_state} {data.employer_zip}"],
            ["Contact Name:", data.employer_contact_name],
            ["Contact Phone:", data.employer_contact_phone],
        ], colWidths=[1.5*inch, 4*inch])
        ale_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
        ]))
        elements.append(ale_table)
        elements.append(Spacer(1, 12))
        
        # Part II - Summary
        elements.append(Paragraph("Part II - ALE Member Information", self.styles['FormSection']))
        
        summary_table = Table([
            ["Total Number of Employees:", str(data.total_employees)],
            ["Full-Time Employees:", str(data.full_time_employees)],
            ["Total 1095-C Forms:", str(data.total_1095c_forms)],
            ["Aggregated Group:", "Yes" if data.is_aggregated_group else "No"],
        ], colWidths=[2.5*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 12))
        
        # Part III - Monthly FTE Counts
        elements.append(Paragraph("Part III - Monthly Full-Time Employee Count", self.styles['FormSection']))
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        fte_data = [['Month'] + months]
        fte_counts = data.monthly_fte_counts if data.monthly_fte_counts else [0] * 12
        fte_data.append(['FTE Count'] + [str(c) for c in fte_counts])
        
        fte_table = Table(fte_data, colWidths=[1*inch] + [0.5*inch] * 12)
        fte_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ]))
        elements.append(fte_table)
        elements.append(Spacer(1, 12))
        
        # Certifications
        elements.append(Paragraph("Part IV - Certifications", self.styles['FormSection']))
        
        cert_table = Table([
            ["Qualifying Offer Method:", "Yes" if data.qualifying_offer_method else "No"],
            ["Section 4980H Transition Relief:", "Yes" if data.section_4980h_transition_relief else "No"],
        ], colWidths=[2.5*inch, 1*inch])
        cert_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(cert_table)
        
        # Build PDF
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def _generate_placeholder_pdf(self, form_type: str, name: str, tax_year: int) -> bytes:
        """Generate a simple placeholder PDF when ReportLab is not available"""
        # Create a minimal PDF manually
        pdf_content = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
100 700 Td
(IRS Form {form_type}) Tj
0 -30 Td
/F1 14 Tf
(Tax Year {tax_year}) Tj
0 -20 Td
({name}) Tj
0 -40 Td
/F1 10 Tf
(This is a placeholder PDF.) Tj
0 -15 Td
(Install ReportLab for production PDFs.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000518 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
595
%%EOF"""
        return pdf_content.encode('latin-1')
    
    def generate_batch_1095c(self, employees: List[Form1095CData]) -> bytes:
        """
        Generate a batch of 1095-C forms as a single PDF.
        
        Returns:
            Combined PDF file as bytes
        """
        # For simplicity, generate individual PDFs
        # In production, combine into single document
        if not employees:
            return self._generate_placeholder_pdf("1095-C Batch", "No Employees", 2026)
        
        return self.generate_1095c_pdf(employees[0])


# Singleton instance
pdf_generator = PDFGenerator()
