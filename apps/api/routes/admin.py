"""
Admin API Routes
Endpoints for platform administration, user management, and organization settings
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

router = APIRouter(prefix="/admin", tags=["Admin"])


# Enums
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"


# Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    send_invite: bool = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None


class User(UserBase):
    id: str
    status: UserStatus
    mfa_enabled: bool
    last_active: Optional[datetime]
    created_at: datetime


class OrganizationSettings(BaseModel):
    name: str
    ein: str
    address_street: str
    address_city: str
    address_state: str
    address_zip: str
    phone: str
    email: EmailStr
    website: Optional[str]
    fiscal_year_start: str
    measurement_method: str
    timezone: str
    logo_url: Optional[str]


class SystemMetric(BaseModel):
    name: str
    value: str
    status: str
    timestamp: datetime


class ActivityLog(BaseModel):
    id: str
    action: str
    organization: str
    user: str
    timestamp: datetime
    details: Optional[dict]


# Mock data
mock_users = [
    {
        "id": "user-001",
        "name": "Administrator",
        "email": "admin@synapse.io",
        "role": "super_admin",
        "status": "active",
        "mfa_enabled": True,
        "last_active": datetime.now(),
        "created_at": datetime(2024, 1, 1)
    }
]


# User Management Endpoints
@router.get("/users", response_model=List[User])
async def list_users(
    role: Optional[UserRole] = None,
    status: Optional[UserStatus] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List all users with optional filtering."""
    return mock_users


@router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user and optionally send invite."""
    new_user = {
        "id": f"user-{len(mock_users) + 1:03d}",
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": "pending" if user.send_invite else "active",
        "mfa_enabled": False,
        "last_active": None,
        "created_at": datetime.now()
    }
    return new_user


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user details by ID."""
    for user in mock_users:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")


@router.patch("/users/{user_id}", response_model=User)
async def update_user(user_id: str, updates: UserUpdate):
    """Update user details."""
    for user in mock_users:
        if user["id"] == user_id:
            if updates.name:
                user["name"] = updates.name
            if updates.role:
                user["role"] = updates.role
            if updates.status:
                user["status"] = updates.status
            return user
    raise HTTPException(status_code=404, detail="User not found")


@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete a user."""
    return {"message": "User deleted successfully"}


@router.post("/users/{user_id}/reset-password")
async def reset_user_password(user_id: str):
    """Send password reset email to user."""
    return {"message": "Password reset email sent"}


@router.post("/users/{user_id}/toggle-mfa")
async def toggle_mfa(user_id: str, enable: bool):
    """Enable or disable MFA for user."""
    return {"message": f"MFA {'enabled' if enable else 'disabled'} for user"}


@router.post("/users/invite")
async def invite_users(emails: List[EmailStr], role: UserRole = UserRole.VIEWER):
    """Bulk invite users by email."""
    return {
        "invited": len(emails),
        "message": f"Invitation emails sent to {len(emails)} users"
    }


# Organization Settings Endpoints
@router.get("/organization", response_model=OrganizationSettings)
async def get_organization_settings():
    """Get current organization settings."""
    return {
        "name": "Acme Healthcare Solutions",
        "ein": "12-3456789",
        "address_street": "123 Business Park Drive, Suite 400",
        "address_city": "San Francisco",
        "address_state": "CA",
        "address_zip": "94105",
        "phone": "(555) 123-4567",
        "email": "compliance@acmehealthcare.com",
        "website": "www.acmehealthcare.com",
        "fiscal_year_start": "01",
        "measurement_method": "look-back",
        "timezone": "America/Los_Angeles",
        "logo_url": None
    }


@router.put("/organization", response_model=OrganizationSettings)
async def update_organization_settings(settings: OrganizationSettings):
    """Update organization settings."""
    return settings


@router.post("/organization/logo")
async def upload_organization_logo():
    """Upload organization logo."""
    return {"logo_url": "/uploads/logo.png"}


# System Health Endpoints
@router.get("/system/metrics", response_model=List[SystemMetric])
async def get_system_metrics():
    """Get current system health metrics."""
    return [
        {"name": "API Response Time", "value": "45ms", "status": "good", "timestamp": datetime.now()},
        {"name": "Database Load", "value": "34%", "status": "good", "timestamp": datetime.now()},
        {"name": "Memory Usage", "value": "68%", "status": "warning", "timestamp": datetime.now()},
        {"name": "Storage Used", "value": "2.1TB / 5TB", "status": "good", "timestamp": datetime.now()},
        {"name": "Active Connections", "value": "1247", "status": "good", "timestamp": datetime.now()},
        {"name": "Queue Depth", "value": "12", "status": "good", "timestamp": datetime.now()},
    ]


@router.get("/system/activity", response_model=List[ActivityLog])
async def get_activity_log(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get recent system activity log."""
    return [
        {
            "id": "act-001",
            "action": "New organization registered",
            "organization": "Acme Healthcare",
            "user": "System",
            "timestamp": datetime.now(),
            "details": None
        }
    ]


@router.get("/system/stats")
async def get_system_stats():
    """Get aggregate system statistics."""
    return {
        "total_organizations": 847,
        "total_users": 12458,
        "forms_generated_today": 1523,
        "api_requests_today": 2400000,
        "active_sessions": 342,
        "pending_jobs": 12
    }
