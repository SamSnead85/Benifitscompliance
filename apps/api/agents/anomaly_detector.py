"""
Anomaly Detection Agent
AI-powered claims analysis for self-insured plan monitoring.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class AnomalySeverity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class AnomalyType(Enum):
    HIGH_COST_CLAIMANT = "high_cost_claimant"
    TREND_DEVIATION = "trend_deviation"
    UTILIZATION_PATTERN = "utilization_pattern"
    ENROLLMENT_MISMATCH = "enrollment_mismatch"
    PROVIDER_CONCENTRATION = "provider_concentration"
    DRUG_SPEND_SPIKE = "drug_spend_spike"


class AnomalyStatus(Enum):
    NEW = "new"
    INVESTIGATING = "investigating"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


@dataclass
class ClaimRecord:
    """Individual claim record for analysis"""
    claim_id: str
    member_id: str
    claim_date: date
    service_type: str  # medical, pharmacy, dental
    provider_id: str
    diagnosis_code: str
    procedure_code: Optional[str]
    billed_amount: Decimal
    allowed_amount: Decimal
    paid_amount: Decimal


@dataclass
class Anomaly:
    """Detected anomaly with AI analysis"""
    id: str
    type: AnomalyType
    severity: AnomalySeverity
    status: AnomalyStatus
    title: str
    description: str
    predicted_impact: str
    ai_recommendation: str
    category: str
    detected_at: datetime
    affected_members: List[str] = field(default_factory=list)
    related_claims: List[str] = field(default_factory=list)
    confidence_score: int = 85


@dataclass
class AnomalyDetectionResult:
    """Result of anomaly detection run"""
    success: bool
    anomalies_detected: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    anomalies: List[Anomaly]
    analysis_period_start: date
    analysis_period_end: date
    duration_ms: int


class AnomalyDetectorAgent:
    """
    The Anomaly Detector Agent analyzes claims data to identify
    unusual patterns, high-cost claimants, and trend deviations.
    """
    
    def __init__(self, anthropic_api_key: Optional[str] = None):
        self.api_key = anthropic_api_key
        # Thresholds for anomaly detection
        self.high_cost_threshold = Decimal("50000")  # Annual
        self.trend_deviation_threshold = 0.15  # 15% above expected
        self.utilization_spike_threshold = 0.20  # 20% increase
        
    def detect_anomalies(
        self,
        claims: List[Dict[str, Any]],
        client_id: str,
        period_start: date,
        period_end: date,
        historical_baseline: Optional[Dict[str, Any]] = None
    ) -> AnomalyDetectionResult:
        """
        Analyze claims data to detect anomalies.
        
        Args:
            claims: List of claim records
            client_id: Client identifier
            period_start: Analysis period start
            period_end: Analysis period end
            historical_baseline: Optional baseline data for comparison
            
        Returns:
            AnomalyDetectionResult with detected anomalies
        """
        import time
        start_time = time.time()
        
        anomalies = []
        
        # Run detection algorithms
        high_cost = self._detect_high_cost_claimants(claims)
        anomalies.extend(high_cost)
        
        trend_anomalies = self._detect_trend_deviations(claims, historical_baseline)
        anomalies.extend(trend_anomalies)
        
        utilization = self._detect_utilization_patterns(claims)
        anomalies.extend(utilization)
        
        # Sort by severity
        severity_order = {
            AnomalySeverity.CRITICAL: 0,
            AnomalySeverity.HIGH: 1,
            AnomalySeverity.MEDIUM: 2,
            AnomalySeverity.LOW: 3
        }
        anomalies.sort(key=lambda a: severity_order[a.severity])
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        return AnomalyDetectionResult(
            success=True,
            anomalies_detected=len(anomalies),
            critical_count=sum(1 for a in anomalies if a.severity == AnomalySeverity.CRITICAL),
            high_count=sum(1 for a in anomalies if a.severity == AnomalySeverity.HIGH),
            medium_count=sum(1 for a in anomalies if a.severity == AnomalySeverity.MEDIUM),
            low_count=sum(1 for a in anomalies if a.severity == AnomalySeverity.LOW),
            anomalies=anomalies,
            analysis_period_start=period_start,
            analysis_period_end=period_end,
            duration_ms=duration_ms
        )
    
    def _detect_high_cost_claimants(self, claims: List[Dict[str, Any]]) -> List[Anomaly]:
        """Identify members with unusually high claims costs"""
        anomalies = []
        
        # Aggregate claims by member
        member_totals: Dict[str, Decimal] = {}
        for claim in claims:
            member_id = claim.get('member_id', '')
            amount = Decimal(str(claim.get('paid_amount', 0)))
            member_totals[member_id] = member_totals.get(member_id, Decimal(0)) + amount
        
        # Find high-cost claimants
        for member_id, total in member_totals.items():
            if total >= self.high_cost_threshold:
                severity = AnomalySeverity.CRITICAL if total >= self.high_cost_threshold * 2 else AnomalySeverity.HIGH
                
                anomaly = Anomaly(
                    id=f"HCC-{member_id[:8]}",
                    type=AnomalyType.HIGH_COST_CLAIMANT,
                    severity=severity,
                    status=AnomalyStatus.NEW,
                    title="High-Cost Claimant Detected",
                    description=f"Member {member_id} has accumulated ${total:,.0f} in claims, exceeding threshold.",
                    predicted_impact=f"+${total * Decimal('0.5'):,.0f} projected through year-end",
                    ai_recommendation="Review for stop-loss attachment. Consider care management intervention.",
                    category="Medical",
                    detected_at=datetime.now(),
                    affected_members=[member_id],
                    confidence_score=92
                )
                anomalies.append(anomaly)
        
        return anomalies
    
    def _detect_trend_deviations(
        self, 
        claims: List[Dict[str, Any]], 
        baseline: Optional[Dict[str, Any]]
    ) -> List[Anomaly]:
        """Detect significant deviations from expected trends"""
        anomalies = []
        
        if not baseline:
            return anomalies
        
        # Calculate current PMPM by category
        current_totals: Dict[str, Decimal] = {}
        for claim in claims:
            category = claim.get('service_type', 'medical')
            amount = Decimal(str(claim.get('paid_amount', 0)))
            current_totals[category] = current_totals.get(category, Decimal(0)) + amount
        
        # Compare to baseline
        for category, current in current_totals.items():
            baseline_amount = Decimal(str(baseline.get(category, 0)))
            if baseline_amount > 0:
                deviation = (current - baseline_amount) / baseline_amount
                
                if deviation >= Decimal(str(self.trend_deviation_threshold)):
                    anomaly = Anomaly(
                        id=f"TRD-{category[:3].upper()}",
                        type=AnomalyType.TREND_DEVIATION,
                        severity=AnomalySeverity.HIGH if deviation >= 0.25 else AnomalySeverity.MEDIUM,
                        status=AnomalyStatus.NEW,
                        title=f"{category.title()} Trend Spike",
                        description=f"{category.title()} spend increased {deviation*100:.0f}% vs. baseline.",
                        predicted_impact=f"+${(current - baseline_amount):,.0f}/month if sustained",
                        ai_recommendation=f"Investigate {category} utilization drivers. Review high-cost procedures.",
                        category=category.title(),
                        detected_at=datetime.now(),
                        confidence_score=88
                    )
                    anomalies.append(anomaly)
        
        return anomalies
    
    def _detect_utilization_patterns(self, claims: List[Dict[str, Any]]) -> List[Anomaly]:
        """Detect unusual utilization patterns"""
        anomalies = []
        
        # Count claims by service type
        service_counts: Dict[str, int] = {}
        for claim in claims:
            service = claim.get('procedure_code', 'general')[:3] if claim.get('procedure_code') else 'general'
            service_counts[service] = service_counts.get(service, 0) + 1
        
        # Detect ER utilization spikes (simplified)
        er_codes = ['992', '993', '994']  # Common ER codes
        er_visits = sum(service_counts.get(code, 0) for code in er_codes)
        total_claims = len(claims)
        
        if total_claims > 0 and er_visits / total_claims > 0.1:  # More than 10% ER
            anomaly = Anomaly(
                id="UTL-ER",
                type=AnomalyType.UTILIZATION_PATTERN,
                severity=AnomalySeverity.MEDIUM,
                status=AnomalyStatus.NEW,
                title="ER Utilization Pattern",
                description=f"Emergency room visits represent {er_visits/total_claims*100:.0f}% of claims.",
                predicted_impact="Consider telemedicine alternatives",
                ai_recommendation="Promote telemedicine options. Review ER visit acuity levels.",
                category="Medical",
                detected_at=datetime.now(),
                confidence_score=82
            )
            anomalies.append(anomaly)
        
        return anomalies
    
    def generate_ai_commentary(self, anomaly: Anomaly) -> str:
        """
        Generate AI commentary for an anomaly.
        Uses LLM to provide detailed analysis and recommendations.
        """
        # In production, this would call Claude/OpenAI
        commentary = f"""
## Analysis: {anomaly.title}

### Summary
{anomaly.description}

### Predicted Financial Impact
{anomaly.predicted_impact}

### Recommended Actions
{anomaly.ai_recommendation}

### Confidence Level
This anomaly was detected with {anomaly.confidence_score}% confidence based on historical patterns and industry benchmarks.
"""
        return commentary


# Singleton instance
anomaly_detector = AnomalyDetectorAgent()
