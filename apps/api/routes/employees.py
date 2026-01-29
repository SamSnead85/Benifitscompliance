"""
Employees API Routes
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter()


class Employee(BaseModel):
    id: str
    client_id: str
    employee_id: str
    first_name: str
    last_name: str
    ssn_last_four: Optional[str]
    hire_date: Optional[str]
    termination_date: Optional[str]
    employment_status: str
    employment_type: str
    fte_status: str
    compliance_status: str
    data_quality_score: int


class EmployeeCreate(BaseModel):
    client_id: str
    employee_id: str
    first_name: str
    last_name: str
    ssn: Optional[str] = None
    hire_date: Optional[str] = None
    employment_type: str = "full_time"


# Demo data
employees_db: dict[str, Employee] = {}


@router.get("", response_model=List[Employee])
async def list_employees(
    client_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    offset: int = Query(0)
):
    """List employees with optional filtering"""
    results = list(employees_db.values())
    
    if client_id:
        results = [e for e in results if e.client_id == client_id]
    
    if status:
        results = [e for e in results if e.compliance_status == status]
    
    return results[offset:offset + limit]


@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    """Get a single employee by ID"""
    if employee_id not in employees_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employees_db[employee_id]


@router.post("", response_model=Employee)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    emp_id = str(uuid.uuid4())
    
    new_employee = Employee(
        id=emp_id,
        client_id=employee.client_id,
        employee_id=employee.employee_id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        ssn_last_four=employee.ssn[-4:] if employee.ssn else None,
        hire_date=employee.hire_date,
        termination_date=None,
        employment_status="active",
        employment_type=employee.employment_type,
        fte_status="pending",
        compliance_status="pending_review",
        data_quality_score=0
    )
    
    employees_db[emp_id] = new_employee
    return new_employee


@router.get("/client/{client_id}/summary")
async def get_client_employee_summary(client_id: str):
    """Get employee summary statistics for a client"""
    employees = [e for e in employees_db.values() if e.client_id == client_id]
    
    return {
        "total": len(employees),
        "active": sum(1 for e in employees if e.employment_status == "active"),
        "full_time": sum(1 for e in employees if e.employment_type == "full_time"),
        "compliant": sum(1 for e in employees if e.compliance_status == "compliant"),
        "at_risk": sum(1 for e in employees if e.compliance_status == "at_risk"),
        "non_compliant": sum(1 for e in employees if e.compliance_status == "non_compliant")
    }
