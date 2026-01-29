"""
Forms API Routes
IRS Form 1094-C and 1095-C generation and management
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()


class Form1095C(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    client_id: str
    tax_year: int
    status: str  # draft, pending_review, approved, filed
    line_14_codes: List[str]  # 12 months
    line_15_codes: List[Optional[str]]  # 12 months
    line_16_codes: List[Optional[str]]  # 12 months
    generated_at: str
    approved_at: Optional[str]
    filed_at: Optional[str]


class Form1094C(BaseModel):
    id: str
    client_id: str
    client_name: str
    tax_year: int
    status: str
    total_1095c_forms: int
    ale_member: bool
    full_time_count: int
    total_employee_count: int
    generated_at: str


class FormGenerationRequest(BaseModel):
    client_id: str
    tax_year: int = 2026
    employee_ids: Optional[List[str]] = None


# Demo data
forms_1095c: dict[str, Form1095C] = {}
forms_1094c: dict[str, Form1094C] = {}


@router.get("/1095c", response_model=List[Form1095C])
async def list_1095c_forms(
    client_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    tax_year: int = Query(2026)
):
    """List all 1095-C forms"""
    results = list(forms_1095c.values())
    
    if client_id:
        results = [f for f in results if f.client_id == client_id]
    
    if status:
        results = [f for f in results if f.status == status]
    
    results = [f for f in results if f.tax_year == tax_year]
    
    return results


@router.get("/1095c/{form_id}", response_model=Form1095C)
async def get_1095c_form(form_id: str):
    """Get a single 1095-C form"""
    if form_id not in forms_1095c:
        raise HTTPException(status_code=404, detail="Form not found")
    return forms_1095c[form_id]


@router.post("/1095c/generate")
async def generate_1095c_forms(request: FormGenerationRequest):
    """Generate 1095-C forms for a client's employees"""
    # In production, this would:
    # 1. Fetch all employees for the client
    # 2. Get compliance assessments for each
    # 3. Generate PDF forms with correct IRS codes
    
    form_id = str(uuid.uuid4())
    
    # Demo: Create a sample form
    demo_form = Form1095C(
        id=form_id,
        employee_id="EMP-001",
        employee_name="John Smith",
        client_id=request.client_id,
        tax_year=request.tax_year,
        status="draft",
        line_14_codes=["1A"] * 12,  # Full year qualifying offer
        line_15_codes=[None] * 12,
        line_16_codes=[None] * 12,
        generated_at=datetime.now().isoformat(),
        approved_at=None,
        filed_at=None
    )
    
    forms_1095c[form_id] = demo_form
    
    return {
        "message": "Forms generated successfully",
        "forms_generated": 1,
        "form_ids": [form_id]
    }


@router.post("/1095c/{form_id}/approve")
async def approve_1095c_form(form_id: str):
    """Approve a 1095-C form for filing"""
    if form_id not in forms_1095c:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form = forms_1095c[form_id]
    form.status = "approved"
    form.approved_at = datetime.now().isoformat()
    
    return {"message": "Form approved", "form_id": form_id}


@router.get("/1095c/{form_id}/pdf")
async def download_1095c_pdf(form_id: str):
    """Download 1095-C form as PDF"""
    if form_id not in forms_1095c:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # In production, generate actual PDF
    # For now, return placeholder
    return Response(
        content=b"%PDF-1.4 placeholder",
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=1095c_{form_id}.pdf"}
    )


@router.get("/1094c", response_model=List[Form1094C])
async def list_1094c_forms(
    client_id: Optional[str] = Query(None),
    tax_year: int = Query(2026)
):
    """List all 1094-C forms"""
    results = list(forms_1094c.values())
    
    if client_id:
        results = [f for f in results if f.client_id == client_id]
    
    results = [f for f in results if f.tax_year == tax_year]
    
    return results


@router.post("/1094c/generate")
async def generate_1094c_form(request: FormGenerationRequest):
    """Generate 1094-C transmittal form for a client"""
    form_id = str(uuid.uuid4())
    
    demo_form = Form1094C(
        id=form_id,
        client_id=request.client_id,
        client_name="Apex Manufacturing Corp",
        tax_year=request.tax_year,
        status="draft",
        total_1095c_forms=2340,
        ale_member=True,
        full_time_count=2180,
        total_employee_count=2340,
        generated_at=datetime.now().isoformat()
    )
    
    forms_1094c[form_id] = demo_form
    
    return {
        "message": "Form 1094-C generated",
        "form_id": form_id
    }


@router.get("/stats/{client_id}")
async def get_form_stats(client_id: str, tax_year: int = 2026):
    """Get form generation statistics for a client"""
    forms_1095 = [f for f in forms_1095c.values() if f.client_id == client_id and f.tax_year == tax_year]
    
    return {
        "tax_year": tax_year,
        "form_1095c": {
            "total": len(forms_1095),
            "draft": sum(1 for f in forms_1095 if f.status == "draft"),
            "pending_review": sum(1 for f in forms_1095 if f.status == "pending_review"),
            "approved": sum(1 for f in forms_1095 if f.status == "approved"),
            "filed": sum(1 for f in forms_1095 if f.status == "filed")
        },
        "form_1094c": {
            "generated": any(f.client_id == client_id for f in forms_1094c.values())
        }
    }
