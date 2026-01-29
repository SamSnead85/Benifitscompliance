"""
Self-Insured Claims API Routes
Claims management, stop-loss tracking, and analytics for self-insured plans
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
import uuid

router = APIRouter(prefix="/self-insured", tags=["self-insured"])


# Enums
class ClaimStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    APPROVED = "approved"
    DENIED = "denied"
    APPEALED = "appealed"


class StopLossClaimStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    DENIED = "denied"
    REIMBURSED = "reimbursed"


class ClaimCategory(str, Enum):
    INPATIENT = "inpatient"
    OUTPATIENT = "outpatient"
    PRESCRIPTION = "prescription"
    SPECIALTY = "specialty"
    LAB = "lab"
    OTHER = "other"


# Models
class Claim(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    claim_date: date
    service_date: date
    category: ClaimCategory
    diagnosis_code: str
    procedure_code: Optional[str] = None
    provider: str
    billed_amount: float
    allowed_amount: float
    paid_amount: float
    member_responsibility: float
    status: ClaimStatus = ClaimStatus.PENDING


class StopLossPolicy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    policy_type: str  # specific or aggregate
    carrier: str
    policy_number: str
    effective_date: date
    renewal_date: date
    deductible: float
    max_liability: float
    annual_premium: float
    status: str  # active, expired, pending


class StopLossClaim(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    policy_id: str
    claim_date: date
    diagnosis: str
    total_claims: float
    amount_over_deductible: float
    reimbursed_amount: float = 0
    pending_amount: float = 0
    status: StopLossClaimStatus = StopLossClaimStatus.SUBMITTED


class ClaimsAnalytics(BaseModel):
    total_claims_ytd: float
    total_claims_count: int
    avg_claim_amount: float
    pmpm_cost: float
    claims_pending: int
    high_cost_claimants: int
    by_category: List[dict]
    monthly_trend: List[dict]


# Mock data
mock_claims: List[Claim] = []
mock_stop_loss_policies: List[StopLossPolicy] = [
    StopLossPolicy(
        id="sl-001",
        policy_type="specific",
        carrier="Sun Life",
        policy_number="SL-2026-00123",
        effective_date=date(2026, 1, 1),
        renewal_date=date(2026, 12, 31),
        deductible=175000,
        max_liability=2000000,
        annual_premium=245000,
        status="active"
    ),
    StopLossPolicy(
        id="sl-002",
        policy_type="aggregate",
        carrier="Sun Life",
        policy_number="SL-2026-00124",
        effective_date=date(2026, 1, 1),
        renewal_date=date(2026, 12, 31),
        deductible=4800000,
        max_liability=10000000,
        annual_premium=125000,
        status="active"
    )
]


# Claims Routes
@router.get("/claims", response_model=List[Claim])
async def list_claims(
    employee_id: Optional[str] = None,
    category: Optional[ClaimCategory] = None,
    status: Optional[ClaimStatus] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_amount: Optional[float] = None,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0)
):
    """List all claims with optional filters."""
    claims = mock_claims
    
    if employee_id:
        claims = [c for c in claims if c.employee_id == employee_id]
    if category:
        claims = [c for c in claims if c.category == category]
    if status:
        claims = [c for c in claims if c.status == status]
    if min_amount:
        claims = [c for c in claims if c.paid_amount >= min_amount]
    
    return claims[offset:offset + limit]


@router.get("/claims/analytics", response_model=ClaimsAnalytics)
async def get_claims_analytics(
    year: int = Query(default=2026),
    month: Optional[int] = None
):
    """Get comprehensive claims analytics."""
    return ClaimsAnalytics(
        total_claims_ytd=4200000,
        total_claims_count=2847,
        avg_claim_amount=1475,
        pmpm_cost=485,
        claims_pending=143,
        high_cost_claimants=8,
        by_category=[
            {"name": "Inpatient", "claims": 456, "amount": 1560000, "percent": 37.1},
            {"name": "Outpatient", "claims": 1234, "amount": 890000, "percent": 21.2},
            {"name": "Prescription", "claims": 2156, "amount": 720000, "percent": 17.1},
            {"name": "Specialty", "claims": 287, "amount": 580000, "percent": 13.8},
            {"name": "Lab", "claims": 892, "amount": 310000, "percent": 7.4},
            {"name": "Other", "claims": 422, "amount": 140000, "percent": 3.3},
        ],
        monthly_trend=[
            {"month": "Jun", "amount": 320000},
            {"month": "Jul", "amount": 380000},
            {"month": "Aug", "amount": 345000},
            {"month": "Sep", "amount": 410000},
            {"month": "Oct", "amount": 395000},
            {"month": "Nov", "amount": 425000},
            {"month": "Dec", "amount": 455000},
            {"month": "Jan", "amount": 490000},
        ]
    )


@router.get("/claims/high-cost")
async def get_high_cost_claimants(
    threshold: float = Query(default=100000),
    limit: int = Query(default=20)
):
    """Get high-cost claimants above threshold."""
    return [
        {"id": "CLM-001", "amount": 245000, "diagnosis": "Cardiovascular", "risk": "high"},
        {"id": "CLM-002", "amount": 189000, "diagnosis": "Oncology", "risk": "high"},
        {"id": "CLM-003", "amount": 156000, "diagnosis": "Orthopedic", "risk": "medium"},
        {"id": "CLM-004", "amount": 134000, "diagnosis": "Specialty Rx", "risk": "high"},
        {"id": "CLM-005", "amount": 98000, "diagnosis": "Chronic Care", "risk": "medium"},
    ]


@router.get("/claims/{claim_id}", response_model=Claim)
async def get_claim(claim_id: str):
    """Get claim details by ID."""
    claim = next((c for c in mock_claims if c.id == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


# Stop-Loss Routes
@router.get("/stop-loss/policies", response_model=List[StopLossPolicy])
async def list_stop_loss_policies():
    """List all stop-loss policies."""
    return mock_stop_loss_policies


@router.get("/stop-loss/policies/{policy_id}", response_model=StopLossPolicy)
async def get_stop_loss_policy(policy_id: str):
    """Get stop-loss policy details."""
    policy = next((p for p in mock_stop_loss_policies if p.id == policy_id), None)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.get("/stop-loss/claims")
async def list_stop_loss_claims(
    status: Optional[StopLossClaimStatus] = None,
    limit: int = Query(default=20)
):
    """List stop-loss claims."""
    return [
        {
            "id": "SLC-001",
            "employee_id": "EMP-1234",
            "claim_date": "2026-01-15",
            "diagnosis": "Cardiovascular Surgery",
            "total_claims": 285000,
            "reimbursed": 110000,
            "pending": 0,
            "status": "approved"
        },
        {
            "id": "SLC-002",
            "employee_id": "EMP-2567",
            "claim_date": "2026-01-22",
            "diagnosis": "Oncology Treatment",
            "total_claims": 240000,
            "reimbursed": 0,
            "pending": 65000,
            "status": "under_review"
        },
    ]


@router.post("/stop-loss/claims")
async def submit_stop_loss_claim(claim: StopLossClaim):
    """Submit a new stop-loss claim."""
    return {
        "claim_id": claim.id,
        "status": "submitted",
        "message": "Stop-loss claim submitted successfully"
    }


@router.get("/stop-loss/summary")
async def get_stop_loss_summary():
    """Get stop-loss summary metrics."""
    return {
        "total_reimbursed": 455000,
        "pending_review": 88000,
        "active_claims": 4,
        "utilization_rate": 23.5,
        "specific_deductible": 175000,
        "aggregate_attachment": 4800000,
        "aggregate_claims_ytd": 4200000
    }
