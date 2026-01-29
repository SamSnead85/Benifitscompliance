"""
Normalization Agent
Uses LLM (Claude) to map, validate, and enrich raw data into the canonical model.
"""

from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import logging
import json
import os

logger = logging.getLogger(__name__)


class TransformationType(str, Enum):
    MAPPING = "mapping"
    VALIDATION = "validation"
    ENRICHMENT = "enrichment"
    INFERENCE = "inference"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass
class DataTransformation:
    """Record of a single data transformation"""
    field: str
    source_value: Any
    normalized_value: Any
    transformation_type: TransformationType
    confidence: int  # 0-100
    reasoning: Optional[str] = None


@dataclass
class NormalizedRecord:
    """A record that has been normalized to the canonical model"""
    record_id: str
    client_id: str
    
    # Demographics
    ssn: Optional[str]
    first_name: Optional[str]
    middle_name: Optional[str]
    last_name: Optional[str]
    date_of_birth: Optional[str]
    
    # Contact
    address_line1: Optional[str]
    address_line2: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    
    # Employment
    employee_id: Optional[str]
    hire_date: Optional[str]
    termination_date: Optional[str]
    employment_status: Optional[str]
    employment_type: Optional[str]
    job_title: Optional[str]
    department: Optional[str]
    
    # Compensation
    annual_salary: Optional[float]
    hourly_rate: Optional[float]
    pay_frequency: Optional[str]
    
    # Metadata
    data_quality_score: int
    confidence_level: ConfidenceLevel
    transformations: List[DataTransformation]
    requires_review: bool
    review_reasons: List[str]


@dataclass
class NormalizationResult:
    """Result of normalizing a batch of records"""
    success: bool
    records_normalized: int
    records_flagged: int
    records_failed: int
    normalized_records: List[NormalizedRecord]
    errors: List[str]
    duration_ms: int


# Standard field mappings for common HRIS systems
COMMON_FIELD_MAPPINGS = {
    # Employee ID variations
    "employee id": "employee_id",
    "emp_id": "employee_id",
    "empid": "employee_id",
    "employee number": "employee_id",
    "emp #": "employee_id",
    "id": "employee_id",
    
    # Name fields
    "first name": "first_name",
    "firstname": "first_name",
    "fname": "first_name",
    "last name": "last_name",
    "lastname": "last_name",
    "lname": "last_name",
    "middle name": "middle_name",
    "middlename": "middle_name",
    "mi": "middle_name",
    
    # SSN
    "ssn": "ssn",
    "social security": "ssn",
    "social security number": "ssn",
    "ss#": "ssn",
    
    # Dates
    "date of birth": "date_of_birth",
    "dob": "date_of_birth",
    "birthdate": "date_of_birth",
    "birth date": "date_of_birth",
    "hire date": "hire_date",
    "hiredate": "hire_date",
    "start date": "hire_date",
    "hire_dt": "hire_date",
    "termination date": "termination_date",
    "term date": "termination_date",
    "end date": "termination_date",
    "term_dt": "termination_date",
    
    # Status
    "status": "employment_status",
    "emp status": "employment_status",
    "employee status": "employment_status",
    "emp_status": "employment_status",
    "employment type": "employment_type",
    "emp type": "employment_type",
    "employee type": "employment_type",
    "ft/pt": "employment_type",
    
    # Address
    "address": "address_line1",
    "address1": "address_line1",
    "street": "address_line1",
    "street address": "address_line1",
    "address2": "address_line2",
    "apt": "address_line2",
    "city": "city",
    "state": "state",
    "st": "state",
    "zip": "zip_code",
    "zipcode": "zip_code",
    "zip code": "zip_code",
    "postal code": "zip_code",
    
    # Contact
    "email": "email",
    "email address": "email",
    "phone": "phone",
    "phone number": "phone",
    "telephone": "phone",
    
    # Compensation
    "salary": "annual_salary",
    "annual salary": "annual_salary",
    "yearly salary": "annual_salary",
    "hourly rate": "hourly_rate",
    "hourly wage": "hourly_rate",
    "rate": "hourly_rate",
    "pay frequency": "pay_frequency",
    "pay period": "pay_frequency",
    
    # Position
    "job title": "job_title",
    "title": "job_title",
    "position": "job_title",
    "department": "department",
    "dept": "department",
}

# Status value mappings
STATUS_MAPPINGS = {
    # Active statuses
    "a": "active",
    "active": "active",
    "employed": "active",
    "current": "active",
    "1": "active",
    
    # Terminated statuses
    "t": "terminated",
    "term": "terminated",
    "terminated": "terminated",
    "separated": "terminated",
    "inactive": "terminated",
    "0": "terminated",
    
    # Leave statuses
    "l": "on_leave",
    "leave": "on_leave",
    "loa": "on_leave",
    "on leave": "on_leave",
    
    # Retired
    "r": "retired",
    "retired": "retired",
}

# Employment type mappings
EMPLOYMENT_TYPE_MAPPINGS = {
    "ft": "full_time",
    "f": "full_time",
    "full": "full_time",
    "full-time": "full_time",
    "full time": "full_time",
    "fulltime": "full_time",
    
    "pt": "part_time",
    "p": "part_time",
    "part": "part_time",
    "part-time": "part_time",
    "part time": "part_time",
    "parttime": "part_time",
    
    "v": "variable_hour",
    "var": "variable_hour",
    "variable": "variable_hour",
    "variable hour": "variable_hour",
    
    "s": "seasonal",
    "seasonal": "seasonal",
    "temp": "seasonal",
    "temporary": "seasonal",
}


class NormalizerAgent:
    """
    The Normalization Agent transforms raw data into the canonical model.
    Uses a combination of deterministic rules and LLM for complex mappings.
    """
    
    def __init__(self, anthropic_api_key: Optional[str] = None):
        self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        self.use_llm = bool(self.api_key)
        
        if not self.use_llm:
            logger.warning("No Anthropic API key - using rule-based normalization only")
    
    async def normalize_batch(
        self,
        raw_records: List[Dict[str, Any]],
        client_id: str,
        schema_hints: Optional[Dict[str, str]] = None
    ) -> NormalizationResult:
        """
        Normalize a batch of raw records to the canonical model.
        
        Args:
            raw_records: List of raw data dictionaries
            client_id: Client ID for these records
            schema_hints: Optional mapping hints from previous runs
            
        Returns:
            NormalizationResult with normalized records and metadata
        """
        start_time = datetime.now()
        normalized_records: List[NormalizedRecord] = []
        errors: List[str] = []
        flagged_count = 0
        
        for i, raw in enumerate(raw_records):
            try:
                record, transformations = await self._normalize_record(
                    raw_data=raw.get("raw_data", raw),
                    record_id=raw.get("source_id", f"record_{i}"),
                    client_id=client_id,
                    schema_hints=schema_hints
                )
                
                if record.requires_review:
                    flagged_count += 1
                
                normalized_records.append(record)
                
            except Exception as e:
                errors.append(f"Record {i}: {str(e)}")
                logger.error(f"Normalization failed for record {i}: {e}")
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        
        return NormalizationResult(
            success=len(errors) == 0,
            records_normalized=len(normalized_records),
            records_flagged=flagged_count,
            records_failed=len(errors),
            normalized_records=normalized_records,
            errors=errors,
            duration_ms=int(duration)
        )
    
    async def _normalize_record(
        self,
        raw_data: Dict[str, Any],
        record_id: str,
        client_id: str,
        schema_hints: Optional[Dict[str, str]] = None
    ) -> Tuple[NormalizedRecord, List[DataTransformation]]:
        """Normalize a single record"""
        transformations: List[DataTransformation] = []
        review_reasons: List[str] = []
        
        # Step 1: Map fields to canonical names
        mapped_data = self._map_fields(raw_data, schema_hints)
        
        # Step 2: Validate and clean values
        cleaned_data = {}
        for field, value in mapped_data.items():
            clean_value, transform = self._validate_field(field, value)
            cleaned_data[field] = clean_value
            if transform:
                transformations.append(transform)
        
        # Step 3: Infer missing values
        inferred_data, infer_transforms = self._infer_missing(cleaned_data)
        transformations.extend(infer_transforms)
        
        # Check for low confidence transforms
        low_confidence = [t for t in transformations if t.confidence < 80]
        if low_confidence:
            review_reasons.extend([
                f"Low confidence ({t.confidence}%) on field '{t.field}'"
                for t in low_confidence
            ])
        
        # Calculate data quality score
        quality_score = self._calculate_quality_score(inferred_data, transformations)
        
        # Determine confidence level
        avg_confidence = sum(t.confidence for t in transformations) / len(transformations) if transformations else 100
        if avg_confidence >= 90:
            confidence_level = ConfidenceLevel.HIGH
        elif avg_confidence >= 70:
            confidence_level = ConfidenceLevel.MEDIUM
        else:
            confidence_level = ConfidenceLevel.LOW
        
        record = NormalizedRecord(
            record_id=record_id,
            client_id=client_id,
            ssn=inferred_data.get("ssn"),
            first_name=inferred_data.get("first_name"),
            middle_name=inferred_data.get("middle_name"),
            last_name=inferred_data.get("last_name"),
            date_of_birth=inferred_data.get("date_of_birth"),
            address_line1=inferred_data.get("address_line1"),
            address_line2=inferred_data.get("address_line2"),
            city=inferred_data.get("city"),
            state=inferred_data.get("state"),
            zip_code=inferred_data.get("zip_code"),
            email=inferred_data.get("email"),
            phone=inferred_data.get("phone"),
            employee_id=inferred_data.get("employee_id"),
            hire_date=inferred_data.get("hire_date"),
            termination_date=inferred_data.get("termination_date"),
            employment_status=inferred_data.get("employment_status"),
            employment_type=inferred_data.get("employment_type"),
            job_title=inferred_data.get("job_title"),
            department=inferred_data.get("department"),
            annual_salary=inferred_data.get("annual_salary"),
            hourly_rate=inferred_data.get("hourly_rate"),
            pay_frequency=inferred_data.get("pay_frequency"),
            data_quality_score=quality_score,
            confidence_level=confidence_level,
            transformations=transformations,
            requires_review=len(review_reasons) > 0 or confidence_level == ConfidenceLevel.LOW,
            review_reasons=review_reasons
        )
        
        return record, transformations
    
    def _map_fields(
        self,
        raw_data: Dict[str, Any],
        schema_hints: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Map raw field names to canonical field names"""
        mapped = {}
        hints = schema_hints or {}
        
        for raw_field, value in raw_data.items():
            # Normalize field name for lookup
            normalized_name = raw_field.lower().strip()
            
            # Check hints first
            if normalized_name in hints:
                canonical_name = hints[normalized_name]
            # Then check common mappings
            elif normalized_name in COMMON_FIELD_MAPPINGS:
                canonical_name = COMMON_FIELD_MAPPINGS[normalized_name]
            else:
                # Keep original if no mapping found
                canonical_name = normalized_name.replace(" ", "_")
            
            mapped[canonical_name] = value
        
        return mapped
    
    def _validate_field(
        self,
        field: str,
        value: Any
    ) -> Tuple[Any, Optional[DataTransformation]]:
        """Validate and clean a field value"""
        if value is None or value == "":
            return None, None
        
        original = value
        transform = None
        
        # Date fields
        if field in ["hire_date", "termination_date", "date_of_birth"]:
            normalized = self._normalize_date(str(value))
            if normalized != str(value):
                transform = DataTransformation(
                    field=field,
                    source_value=value,
                    normalized_value=normalized,
                    transformation_type=TransformationType.VALIDATION,
                    confidence=95 if normalized else 50,
                    reasoning="Date format standardization to ISO 8601"
                )
            return normalized, transform
        
        # Status field
        if field == "employment_status":
            normalized = STATUS_MAPPINGS.get(str(value).lower().strip(), str(value).lower())
            transform = DataTransformation(
                field=field,
                source_value=value,
                normalized_value=normalized,
                transformation_type=TransformationType.MAPPING,
                confidence=100 if normalized in ["active", "terminated", "on_leave", "retired"] else 70
            )
            return normalized, transform
        
        # Employment type
        if field == "employment_type":
            normalized = EMPLOYMENT_TYPE_MAPPINGS.get(str(value).lower().strip(), str(value).lower())
            transform = DataTransformation(
                field=field,
                source_value=value,
                normalized_value=normalized,
                transformation_type=TransformationType.MAPPING,
                confidence=100 if normalized in ["full_time", "part_time", "variable_hour", "seasonal"] else 70
            )
            return normalized, transform
        
        # State abbreviation
        if field == "state":
            normalized = str(value).upper().strip()[:2] if value else None
            return normalized, None
        
        # SSN cleaning
        if field == "ssn":
            # Remove dashes and spaces
            normalized = "".join(c for c in str(value) if c.isdigit())
            if len(normalized) == 9:
                transform = DataTransformation(
                    field=field,
                    source_value=value,
                    normalized_value=normalized,
                    transformation_type=TransformationType.VALIDATION,
                    confidence=100
                )
            return normalized if len(normalized) == 9 else None, transform
        
        # Numeric fields
        if field in ["annual_salary", "hourly_rate"]:
            try:
                # Remove currency symbols and commas
                clean = str(value).replace("$", "").replace(",", "").strip()
                normalized = float(clean)
                return normalized, None
            except ValueError:
                return None, None
        
        return value, None
    
    def _normalize_date(self, value: str) -> Optional[str]:
        """Convert various date formats to ISO 8601 (YYYY-MM-DD)"""
        import re
        from datetime import datetime as dt
        
        value = value.strip()
        
        # Already ISO format
        if re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            return value
        
        # Common formats to try
        formats = [
            "%m/%d/%Y",    # 12/31/2024
            "%m-%d-%Y",    # 12-31-2024
            "%m/%d/%y",    # 12/31/24
            "%Y%m%d",      # 20241231
            "%d-%b-%Y",    # 31-Dec-2024
            "%B %d, %Y",   # December 31, 2024
        ]
        
        for fmt in formats:
            try:
                parsed = dt.strptime(value, fmt)
                return parsed.strftime("%Y-%m-%d")
            except ValueError:
                continue
        
        return None
    
    def _infer_missing(
        self,
        data: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], List[DataTransformation]]:
        """Infer missing values based on available data"""
        transforms: List[DataTransformation] = []
        
        # Infer employment status from termination date
        if not data.get("employment_status"):
            if data.get("termination_date"):
                data["employment_status"] = "terminated"
                transforms.append(DataTransformation(
                    field="employment_status",
                    source_value=None,
                    normalized_value="terminated",
                    transformation_type=TransformationType.INFERENCE,
                    confidence=95,
                    reasoning="Inferred from presence of termination_date"
                ))
            elif data.get("hire_date"):
                data["employment_status"] = "active"
                transforms.append(DataTransformation(
                    field="employment_status",
                    source_value=None,
                    normalized_value="active",
                    transformation_type=TransformationType.INFERENCE,
                    confidence=85,
                    reasoning="Inferred as active (has hire_date, no termination_date)"
                ))
        
        return data, transforms
    
    def _calculate_quality_score(
        self,
        data: Dict[str, Any],
        transformations: List[DataTransformation]
    ) -> int:
        """Calculate a data quality score (0-100)"""
        required_fields = ["first_name", "last_name", "hire_date", "employment_status"]
        optional_fields = ["ssn", "date_of_birth", "email", "employee_id", "employment_type"]
        
        # Base score for required fields
        required_present = sum(1 for f in required_fields if data.get(f))
        required_score = (required_present / len(required_fields)) * 60
        
        # Bonus for optional fields
        optional_present = sum(1 for f in optional_fields if data.get(f))
        optional_score = (optional_present / len(optional_fields)) * 25
        
        # Transformations confidence factor
        if transformations:
            avg_confidence = sum(t.confidence for t in transformations) / len(transformations)
            confidence_score = (avg_confidence / 100) * 15
        else:
            confidence_score = 15
        
        return min(100, int(required_score + optional_score + confidence_score))


# Singleton instance
normalizer_agent = NormalizerAgent()
