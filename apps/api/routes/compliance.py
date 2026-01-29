"""
Compliance API Routes
ACA compliance management, safe harbor, and penalty risk assessment
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
import uuid

router = APIRouter(prefix="/compliance", tags=["compliance"])


# Enums
class SafeHarborCode(str, Enum):
    W2 = "2F"  # W-2 Safe Harbor
    FPL = "2G"  # Federal Poverty Line
    RATE_OF_PAY = "2H"  # Rate of Pay


class OfferCode(str, Enum):
    QUALIFYING_OFFER = "1A"
    MEC_MV_EMP_ONLY = "1B"
    MEC_MV_EMP_DEP = "1C"
    MEC_MV_EMP_SPOUSE = "1D"
    MEC_MV_ALL = "1E"
    MEC_NO_MV = "1F"
    NO_OFFER = "1H"


class MeasurementPeriod(str, Enum):
    STANDARD = "standard"
    INITIAL = "initial"
    LOOKBACK = "lookback"


# Models
class ComplianceScore(BaseModel):
    overall_score: float
    coverage_offers_score: float
    affordability_score: float
    waiting_period_score: float
    minimum_value_score: float
    employees_compliant: int
    employees_total: int
    at_risk_employees: int


class PenaltyRisk(BaseModel):
    penalty_4980h_a: float  # "A" penalty - no offer
    penalty_4980h_b: float  # "B" penalty - unaffordable
    total_exposure: float
    affected_employees_a: int
    affected_employees_b: int
    risk_level: str


class EmployeeCompliance(BaseModel):
    employee_id: str
    name: str
    fte_status: str  # full_time, variable, part_time
    measurement_period: MeasurementPeriod
    avg_weekly_hours: float
    coverage_offered: bool
    coverage_enrolled: bool
    offer_code: OfferCode
    safe_harbor: Optional[SafeHarborCode] = None
    is_affordable: bool
    compliance_issues: List[str] = []


class AffordabilityAnalysis(BaseModel):
    safe_harbor_method: SafeHarborCode
    employee_contribution: float
    affordability_threshold: float
    is_affordable: bool
    margin: float


# Routes
@router.get("/score", response_model=ComplianceScore)
async def get_compliance_score():
    """Get overall compliance score and breakdown."""
    return ComplianceScore(
        overall_score=96.8,
        coverage_offers_score=98.2,
        affordability_score=94.5,
        waiting_period_score=99.1,
        minimum_value_score=97.8,
        employees_compliant=4371,
        employees_total=4521,
        at_risk_employees=8
    )


@router.get("/penalty-risk", response_model=PenaltyRisk)
async def get_penalty_risk(tax_year: int = Query(default=2025)):
    """Calculate potential ACA penalty exposure."""
    return PenaltyRisk(
        penalty_4980h_a=0,
        penalty_4980h_b=45600,
        total_exposure=45600,
        affected_employees_a=0,
        affected_employees_b=12,
        risk_level="low"
    )


@router.get("/employees", response_model=List[EmployeeCompliance])
async def list_employee_compliance(
    fte_status: Optional[str] = None,
    has_issues: Optional[bool] = None,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0)
):
    """List employee compliance status."""
    employees = [
        EmployeeCompliance(
            employee_id=f"EMP-{1000 + i}",
            name=f"Employee {i}",
            fte_status="full_time",
            measurement_period=MeasurementPeriod.STANDARD,
            avg_weekly_hours=38.5,
            coverage_offered=True,
            coverage_enrolled=True,
            offer_code=OfferCode.MEC_MV_ALL,
            safe_harbor=SafeHarborCode.W2,
            is_affordable=True,
            compliance_issues=[]
        )
        for i in range(10)
    ]
    
    # Add some with issues
    employees.append(EmployeeCompliance(
        employee_id="EMP-1999",
        name="At Risk Employee",
        fte_status="full_time",
        measurement_period=MeasurementPeriod.INITIAL,
        avg_weekly_hours=32.5,
        coverage_offered=True,
        coverage_enrolled=False,
        offer_code=OfferCode.MEC_MV_EMP_ONLY,
        safe_harbor=None,
        is_affordable=False,
        compliance_issues=["Declined coverage", "Affordability not met"]
    ))
    
    return employees[offset:offset + limit]


@router.get("/employees/{employee_id}", response_model=EmployeeCompliance)
async def get_employee_compliance(employee_id: str):
    """Get compliance details for a specific employee."""
    return EmployeeCompliance(
        employee_id=employee_id,
        name="Sarah J. Mitchell",
        fte_status="full_time",
        measurement_period=MeasurementPeriod.STANDARD,
        avg_weekly_hours=40.0,
        coverage_offered=True,
        coverage_enrolled=True,
        offer_code=OfferCode.MEC_MV_ALL,
        safe_harbor=SafeHarborCode.W2,
        is_affordable=True,
        compliance_issues=[]
    )


@router.get("/affordability/{employee_id}", response_model=AffordabilityAnalysis)
async def analyze_affordability(
    employee_id: str,
    safe_harbor: SafeHarborCode = Query(default=SafeHarborCode.W2)
):
    """Analyze affordability for an employee."""
    return AffordabilityAnalysis(
        safe_harbor_method=safe_harbor,
        employee_contribution=185.50,
        affordability_threshold=465.00,
        is_affordable=True,
        margin=279.50
    )


@router.get("/measurement-periods")
async def get_measurement_periods(tax_year: int = Query(default=2025)):
    """Get measurement period configuration."""
    return {
        "standard_measurement": {
            "start": f"{tax_year - 1}-10-15",
            "end": f"{tax_year}-10-14",
            "stability_start": f"{tax_year}-01-01",
            "stability_end": f"{tax_year}-12-31"
        },
        "initial_measurement": {
            "length_months": 12,
            "admin_period_days": 90
        }
    }


@router.get("/safe-harbor/analysis")
async def analyze_safe_harbors():
    """Analyze safe harbor usage across organization."""
    return {
        "w2_safe_harbor": {
            "employees": 2845,
            "percentage": 63.0,
            "avg_contribution": 185.50
        },
        "rate_of_pay": {
            "employees": 1234,
            "percentage": 27.3,
            "avg_contribution": 198.00
        },
        "fpl": {
            "employees": 442,
            "percentage": 9.8,
            "avg_contribution": 145.00
        },
        "recommendation": {
            "switch_to_rate_of_pay": 156,
            "estimated_risk_reduction": "34%",
            "rationale": "Better audit protection for variable hour employees"
        }
    }


@router.get("/coverage-gaps")
async def get_coverage_gaps():
    """Identify employees with coverage gaps."""
    return [
        {
            "employee_id": "EMP-1234",
            "name": "John Smith",
            "gap_months": ["Jan", "Feb"],
            "reason": "Waiting period",
            "risk_level": "low"
        },
        {
            "employee_id": "EMP-2567",
            "name": "Jane Doe",
            "gap_months": ["Mar"],
            "reason": "Declined coverage",
            "risk_level": "medium"
        }
    ]


@router.post("/bulk-update-codes")
async def bulk_update_codes(
    employee_ids: List[str],
    offer_code: Optional[OfferCode] = None,
    safe_harbor: Optional[SafeHarborCode] = None
):
    """Bulk update offer or safe harbor codes."""
    return {
        "updated": len(employee_ids),
        "message": f"Updated codes for {len(employee_ids)} employees"
    }
