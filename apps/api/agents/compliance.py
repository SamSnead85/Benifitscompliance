"""
Compliance Agent
Applies ACA rules to determine FTE status, affordability, and penalty risk.
"""

from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


# ACA Constants for 2026
ACA_CONSTANTS = {
    "affordability_threshold_2026": 0.0912,  # 9.12% for 2026
    "fte_hours_threshold": 130,  # Monthly hours for FTE
    "fte_weekly_threshold": 30,  # Weekly hours for FTE
    "ale_threshold": 50,  # Full-time equivalent employees for ALE status
    "lookback_period_standard": 12,  # Standard measurement period (months)
    "lookback_period_initial": 3,  # Initial measurement period minimum
}

# IRS Coverage Codes (Line 14)
COVERAGE_CODES = {
    "1A": "Qualifying offer (employee only)",
    "1B": "MEC providing MV, employee cost ≤ 9.5% mainland FPL",
    "1C": "Employee's lowest cost ≤ 9.5% Form W-2 wages",
    "1D": "Employee's lowest cost ≤ 9.5% rate of pay",
    "1E": "MEC providing MV to employee, dependents, but not spouse",
    "1F": "MEC providing MV to employee only",
    "1G": "Offer to employee who was not full-time",
    "1H": "No offer of coverage",
    "1I": "Qualifying offer transition relief 2015",
    "1J": "MEC providing MV, spouse and dependents",
    "1K": "MEC providing MV to employee, spouse, but not dependents",
    "1L": "ICHRA offered to employee only",
    "1M": "ICHRA offered to employee and dependents",
    "1N": "ICHRA offered to employee, spouse, and dependents",
    "1O": "ICHRA offered, spouse not offered",
    "1P": "Reserved",
    "1Q": "Reserved",
    "1R": "Reserved",
    "1S": "ICHRA offered, employee's share affordability unknown",
}

# IRS Safe Harbor Codes (Line 15)
SAFE_HARBOR_CODES = {
    "2A": "Employee not employed during month",
    "2B": "Employee not full-time during month",
    "2C": "Employee enrolled in coverage offered",
    "2D": "Employee in limited non-assessment period",
    "2E": "Multiemployer interim rule relief",
    "2F": "W-2 safe harbor",
    "2G": "Federal poverty line safe harbor",
    "2H": "Rate of pay safe harbor",
    "2I": "Non-calendar year transition relief",
}


class ComplianceStatus(str, Enum):
    COMPLIANT = "compliant"
    AT_RISK = "at_risk"
    NON_COMPLIANT = "non_compliant"
    PENDING_REVIEW = "pending_review"


class FTEStatus(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    VARIABLE_HOUR = "variable_hour"
    UNDETERMINED = "undetermined"


class PenaltyType(str, Enum):
    NONE = "none"
    SECTION_4980H_A = "4980h_a"  # No offer of coverage
    SECTION_4980H_B = "4980h_b"  # Unaffordable/inadequate coverage


@dataclass
class MonthlyHours:
    """Hours worked in a specific month"""
    year: int
    month: int
    hours: float
    source: str = "payroll"


@dataclass
class FTEDetermination:
    """Result of FTE status determination"""
    employee_id: str
    status: FTEStatus
    average_monthly_hours: float
    measurement_period_start: str
    measurement_period_end: str
    method: str  # "look_back" or "monthly"
    confidence: int
    reasoning: str
    is_new_hire: bool = False


@dataclass
class AffordabilityCalculation:
    """Result of affordability test"""
    employee_id: str
    is_affordable: bool
    employee_contribution: Decimal
    household_income: Optional[Decimal]
    safe_harbor_used: str  # "W2", "FPL", "rate_of_pay"
    affordability_percentage: Decimal
    threshold: Decimal
    
    # For rate of pay safe harbor
    hourly_rate: Optional[Decimal] = None
    monthly_hours_assumed: int = 130


@dataclass
class PenaltyRisk:
    """Assessment of potential ACA penalty exposure"""
    employee_id: str
    penalty_type: PenaltyType
    potential_penalty_amount: Decimal
    months_at_risk: List[int]
    reason: str
    mitigation_options: List[str]


@dataclass
class ComplianceAssessment:
    """Complete compliance assessment for an employee"""
    employee_id: str
    client_id: str
    assessment_date: str
    status: ComplianceStatus
    
    # Determinations
    fte_determination: FTEDetermination
    affordability: Optional[AffordabilityCalculation]
    
    # IRS Form Codes
    line_14_code: str  # Offer of Coverage
    line_15_code: Optional[str]  # Safe Harbor/Other
    line_16_code: Optional[str]  # Reserved
    
    # Risk
    penalty_risk: Optional[PenaltyRisk]
    
    # Recommendations
    issues: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


@dataclass
class ComplianceResult:
    """Result of compliance check for a batch of employees"""
    success: bool
    total_assessed: int
    compliant: int
    at_risk: int
    non_compliant: int
    assessments: List[ComplianceAssessment]
    aggregate_penalty_exposure: Decimal
    duration_ms: int


class ComplianceAgent:
    """
    The Compliance Agent applies ACA rules to determine eligibility,
    affordability, and penalty risk for each employee.
    """
    
    def __init__(self, tax_year: int = 2026):
        self.tax_year = tax_year
        self.affordability_threshold = Decimal(str(ACA_CONSTANTS["affordability_threshold_2026"]))
        self.fte_hours_threshold = ACA_CONSTANTS["fte_hours_threshold"]
    
    async def assess_compliance(
        self,
        employees: List[Dict[str, Any]],
        client_id: str,
        coverage_data: Optional[Dict[str, Any]] = None
    ) -> ComplianceResult:
        """
        Assess ACA compliance for a batch of employees.
        
        Args:
            employees: List of normalized employee records
            client_id: Client ID
            coverage_data: Optional coverage/enrollment data
            
        Returns:
            ComplianceResult with assessments for each employee
        """
        start_time = datetime.now()
        assessments: List[ComplianceAssessment] = []
        total_penalty = Decimal("0")
        
        for emp in employees:
            assessment = await self._assess_employee(emp, client_id, coverage_data)
            assessments.append(assessment)
            
            if assessment.penalty_risk:
                total_penalty += assessment.penalty_risk.potential_penalty_amount
        
        # Count by status
        compliant = sum(1 for a in assessments if a.status == ComplianceStatus.COMPLIANT)
        at_risk = sum(1 for a in assessments if a.status == ComplianceStatus.AT_RISK)
        non_compliant = sum(1 for a in assessments if a.status == ComplianceStatus.NON_COMPLIANT)
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        
        return ComplianceResult(
            success=True,
            total_assessed=len(assessments),
            compliant=compliant,
            at_risk=at_risk,
            non_compliant=non_compliant,
            assessments=assessments,
            aggregate_penalty_exposure=total_penalty,
            duration_ms=int(duration)
        )
    
    async def _assess_employee(
        self,
        employee: Dict[str, Any],
        client_id: str,
        coverage_data: Optional[Dict[str, Any]]
    ) -> ComplianceAssessment:
        """Assess a single employee's compliance status"""
        employee_id = employee.get("employee_id", employee.get("record_id", "unknown"))
        
        # Step 1: Determine FTE status
        fte = self._determine_fte_status(employee)
        
        # Step 2: Determine coverage offer code
        line_14, line_15 = self._determine_coverage_codes(employee, fte, coverage_data)
        
        # Step 3: Calculate affordability (if applicable)
        affordability = None
        if fte.status == FTEStatus.FULL_TIME:
            affordability = self._calculate_affordability(employee, coverage_data)
        
        # Step 4: Assess penalty risk
        penalty_risk = self._assess_penalty_risk(employee, fte, affordability, line_14)
        
        # Step 5: Determine overall status
        status = self._determine_overall_status(fte, affordability, penalty_risk)
        
        # Step 6: Generate recommendations
        issues, recommendations = self._generate_recommendations(fte, affordability, penalty_risk)
        
        return ComplianceAssessment(
            employee_id=employee_id,
            client_id=client_id,
            assessment_date=datetime.now().strftime("%Y-%m-%d"),
            status=status,
            fte_determination=fte,
            affordability=affordability,
            line_14_code=line_14,
            line_15_code=line_15,
            line_16_code=None,
            penalty_risk=penalty_risk,
            issues=issues,
            recommendations=recommendations
        )
    
    def _determine_fte_status(self, employee: Dict[str, Any]) -> FTEDetermination:
        """Determine if employee is full-time under ACA"""
        employee_id = employee.get("employee_id", "unknown")
        hours_data = employee.get("hours_worked", [])
        employment_type = employee.get("employment_type", "").lower()
        hire_date = employee.get("hire_date")
        
        # Check if new hire
        is_new_hire = False
        if hire_date:
            try:
                hire = datetime.strptime(hire_date, "%Y-%m-%d").date()
                days_employed = (date.today() - hire).days
                is_new_hire = days_employed < 365
            except ValueError:
                pass
        
        # If explicit employment type mapping exists
        if employment_type in ["full_time", "ft"]:
            return FTEDetermination(
                employee_id=employee_id,
                status=FTEStatus.FULL_TIME,
                average_monthly_hours=130,
                measurement_period_start="",
                measurement_period_end="",
                method="classification",
                confidence=95,
                reasoning="Classified as full-time by employer",
                is_new_hire=is_new_hire
            )
        
        if employment_type in ["part_time", "pt"]:
            return FTEDetermination(
                employee_id=employee_id,
                status=FTEStatus.PART_TIME,
                average_monthly_hours=60,
                measurement_period_start="",
                measurement_period_end="",
                method="classification",
                confidence=90,
                reasoning="Classified as part-time by employer",
                is_new_hire=is_new_hire
            )
        
        # Use look-back measurement if hours data available
        if hours_data:
            total_hours = sum(h.get("hours", 0) for h in hours_data)
            months = len(hours_data)
            avg_monthly = total_hours / months if months > 0 else 0
            
            if avg_monthly >= self.fte_hours_threshold:
                status = FTEStatus.FULL_TIME
                confidence = min(95, 70 + (months * 2))
            elif avg_monthly < 60:
                status = FTEStatus.PART_TIME
                confidence = 85
            else:
                status = FTEStatus.VARIABLE_HOUR
                confidence = 70
            
            return FTEDetermination(
                employee_id=employee_id,
                status=status,
                average_monthly_hours=round(avg_monthly, 1),
                measurement_period_start=hours_data[0].get("period", ""),
                measurement_period_end=hours_data[-1].get("period", "") if hours_data else "",
                method="look_back",
                confidence=confidence,
                reasoning=f"Based on {months}-month look-back average of {avg_monthly:.1f} hours/month",
                is_new_hire=is_new_hire
            )
        
        # Undetermined if no data
        return FTEDetermination(
            employee_id=employee_id,
            status=FTEStatus.UNDETERMINED,
            average_monthly_hours=0,
            measurement_period_start="",
            measurement_period_end="",
            method="none",
            confidence=0,
            reasoning="Insufficient data to determine FTE status",
            is_new_hire=is_new_hire
        )
    
    def _determine_coverage_codes(
        self,
        employee: Dict[str, Any],
        fte: FTEDetermination,
        coverage_data: Optional[Dict[str, Any]]
    ) -> Tuple[str, Optional[str]]:
        """Determine IRS Line 14 and 15 codes"""
        
        # If not full-time, code 1G
        if fte.status != FTEStatus.FULL_TIME:
            return "1G", "2B"
        
        # Check coverage offer
        if coverage_data:
            offer = coverage_data.get("offer_made", False)
            enrolled = coverage_data.get("enrolled", False)
            covers_dependents = coverage_data.get("covers_dependents", False)
            covers_spouse = coverage_data.get("covers_spouse", False)
            
            if not offer:
                return "1H", None  # No offer
            
            if enrolled:
                # Determine based on who is covered
                if covers_spouse and covers_dependents:
                    line_14 = "1J"
                elif covers_dependents:
                    line_14 = "1E"
                elif covers_spouse:
                    line_14 = "1K"
                else:
                    line_14 = "1F"
                
                return line_14, "2C"  # Enrolled
            else:
                # Offer made but not enrolled
                return "1E", None
        
        # Default: Assume qualifying offer (need more data)
        return "1A", None
    
    def _calculate_affordability(
        self,
        employee: Dict[str, Any],
        coverage_data: Optional[Dict[str, Any]]
    ) -> AffordabilityCalculation:
        """Calculate if coverage is affordable under ACA safe harbors"""
        employee_id = employee.get("employee_id", "unknown")
        
        # Get employee cost
        employee_contribution = Decimal("0")
        if coverage_data:
            monthly_premium = coverage_data.get("employee_monthly_premium", 0)
            employee_contribution = Decimal(str(monthly_premium))
        
        # Get compensation data
        annual_salary = employee.get("annual_salary")
        hourly_rate = employee.get("hourly_rate")
        
        # Use rate of pay safe harbor as default
        if hourly_rate:
            hourly = Decimal(str(hourly_rate))
            assumed_monthly_wage = hourly * 130  # FTE hours
            affordability_pct = (employee_contribution / assumed_monthly_wage) if assumed_monthly_wage > 0 else Decimal("0")
            
            return AffordabilityCalculation(
                employee_id=employee_id,
                is_affordable=affordability_pct <= self.affordability_threshold,
                employee_contribution=employee_contribution,
                household_income=None,
                safe_harbor_used="rate_of_pay",
                affordability_percentage=affordability_pct,
                threshold=self.affordability_threshold,
                hourly_rate=hourly,
                monthly_hours_assumed=130
            )
        
        # W-2 safe harbor
        if annual_salary:
            annual = Decimal(str(annual_salary))
            monthly_wage = annual / 12
            affordability_pct = (employee_contribution / monthly_wage) if monthly_wage > 0 else Decimal("0")
            
            return AffordabilityCalculation(
                employee_id=employee_id,
                is_affordable=affordability_pct <= self.affordability_threshold,
                employee_contribution=employee_contribution,
                household_income=annual,
                safe_harbor_used="W2",
                affordability_percentage=affordability_pct,
                threshold=self.affordability_threshold
            )
        
        # Cannot determine
        return AffordabilityCalculation(
            employee_id=employee_id,
            is_affordable=True,  # Assume affordable if no data
            employee_contribution=employee_contribution,
            household_income=None,
            safe_harbor_used="unknown",
            affordability_percentage=Decimal("0"),
            threshold=self.affordability_threshold
        )
    
    def _assess_penalty_risk(
        self,
        employee: Dict[str, Any],
        fte: FTEDetermination,
        affordability: Optional[AffordabilityCalculation],
        line_14_code: str
    ) -> Optional[PenaltyRisk]:
        """Assess potential penalty exposure"""
        employee_id = employee.get("employee_id", "unknown")
        
        # No penalty if not full-time
        if fte.status != FTEStatus.FULL_TIME:
            return None
        
        # Check for 4980H(a) - no offer penalty
        if line_14_code == "1H":
            return PenaltyRisk(
                employee_id=employee_id,
                penalty_type=PenaltyType.SECTION_4980H_A,
                potential_penalty_amount=Decimal("2880"),  # 2026 penalty per FTE
                months_at_risk=list(range(1, 13)),
                reason="No coverage offered to full-time employee",
                mitigation_options=[
                    "Extend coverage offer immediately",
                    "Review classification - may be part-time"
                ]
            )
        
        # Check for 4980H(b) - affordability penalty
        if affordability and not affordability.is_affordable:
            return PenaltyRisk(
                employee_id=employee_id,
                penalty_type=PenaltyType.SECTION_4980H_B,
                potential_penalty_amount=Decimal("4320"),  # 2026 penalty per employee
                months_at_risk=list(range(1, 13)),
                reason=f"Coverage exceeds {self.affordability_threshold * 100:.2f}% affordability threshold",
                mitigation_options=[
                    "Reduce employee premium contribution",
                    "Offer lower-cost plan option"
                ]
            )
        
        return None
    
    def _determine_overall_status(
        self,
        fte: FTEDetermination,
        affordability: Optional[AffordabilityCalculation],
        penalty_risk: Optional[PenaltyRisk]
    ) -> ComplianceStatus:
        """Determine overall compliance status"""
        # Undetermined FTE = pending review
        if fte.status == FTEStatus.UNDETERMINED:
            return ComplianceStatus.PENDING_REVIEW
        
        # Non-FTE = compliant (no ACA obligation)
        if fte.status in [FTEStatus.PART_TIME, FTEStatus.VARIABLE_HOUR]:
            return ComplianceStatus.COMPLIANT
        
        # Has penalty risk = non-compliant or at-risk
        if penalty_risk:
            if penalty_risk.penalty_type == PenaltyType.SECTION_4980H_A:
                return ComplianceStatus.NON_COMPLIANT
            else:
                return ComplianceStatus.AT_RISK
        
        return ComplianceStatus.COMPLIANT
    
    def _generate_recommendations(
        self,
        fte: FTEDetermination,
        affordability: Optional[AffordabilityCalculation],
        penalty_risk: Optional[PenaltyRisk]
    ) -> Tuple[List[str], List[str]]:
        """Generate issues and recommendations"""
        issues = []
        recommendations = []
        
        if fte.status == FTEStatus.UNDETERMINED:
            issues.append("FTE status cannot be determined - insufficient hours data")
            recommendations.append("Collect 3-12 months of hours data for look-back measurement")
        
        if fte.confidence < 80:
            issues.append(f"Low confidence ({fte.confidence}%) in FTE determination")
            recommendations.append("Review hours tracking process for accuracy")
        
        if affordability and not affordability.is_affordable:
            issues.append("Coverage fails affordability test")
            recommendations.append("Consider offering lower-cost plan tier")
        
        if penalty_risk:
            issues.extend(penalty_risk.mitigation_options)
        
        return issues, recommendations


# Singleton instance
compliance_agent = ComplianceAgent()
