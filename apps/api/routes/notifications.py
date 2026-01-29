"""
Notification System API Routes
Provides endpoints for managing alerts, notifications, and preferences.
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Models
class NotificationType(str, Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"
    SUCCESS = "success"

class NotificationChannel(str, Enum):
    IN_APP = "in_app"
    EMAIL = "email"
    SLACK = "slack"
    SMS = "sms"

class Notification(BaseModel):
    id: str
    type: NotificationType
    title: str
    message: str
    source: str
    timestamp: datetime
    read: bool
    dismissed: bool
    action_url: Optional[str] = None
    action_label: Optional[str] = None
    metadata: Optional[dict] = None

class NotificationCreate(BaseModel):
    type: NotificationType
    title: str
    message: str
    source: str
    action_url: Optional[str] = None
    action_label: Optional[str] = None
    channels: List[NotificationChannel] = [NotificationChannel.IN_APP]

class NotificationPreferences(BaseModel):
    user_id: str
    email_enabled: bool = True
    slack_enabled: bool = False
    sms_enabled: bool = False
    quiet_hours_start: Optional[int] = None  # Hour in 24h format
    quiet_hours_end: Optional[int] = None
    digest_enabled: bool = False
    digest_frequency: str = "daily"
    muted_sources: List[str] = []
    critical_only: bool = False

class NotificationListResponse(BaseModel):
    notifications: List[Notification]
    total: int
    unread_count: int

# Demo Data
DEMO_NOTIFICATIONS = [
    Notification(
        id="notif-001",
        type=NotificationType.CRITICAL,
        title="Filing Deadline Approaching",
        message="1095-C forms must be distributed to employees by January 31, 2026.",
        source="Compliance Engine",
        timestamp=datetime.now(),
        read=False,
        dismissed=False,
        action_url="/compliance",
        action_label="Review Forms"
    ),
    Notification(
        id="notif-002",
        type=NotificationType.WARNING,
        title="Affordability Threshold Alert",
        message="15 employees exceed the 9.12% safe harbor limit.",
        source="ACA Monitor",
        timestamp=datetime.now(),
        read=False,
        dismissed=False,
        action_url="/compliance/affordability"
    ),
    Notification(
        id="notif-003",
        type=NotificationType.INFO,
        title="HRIS Sync Complete",
        message="142 employee records updated from Gusto.",
        source="Integration Hub",
        timestamp=datetime.now(),
        read=True,
        dismissed=False
    ),
    Notification(
        id="notif-004",
        type=NotificationType.SUCCESS,
        title="Q4 Compliance Audit Complete",
        message="All employees passed verification with 99.2% data quality.",
        source="Compliance Engine",
        timestamp=datetime.now(),
        read=True,
        dismissed=False
    )
]

# Routes
@router.get("", response_model=NotificationListResponse)
async def list_notifications(
    type: Optional[NotificationType] = None,
    read: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100)
):
    """List notifications with optional filtering."""
    filtered = [n for n in DEMO_NOTIFICATIONS if not n.dismissed]
    
    if type:
        filtered = [n for n in filtered if n.type == type]
    if read is not None:
        filtered = [n for n in filtered if n.read == read]
    
    unread_count = len([n for n in DEMO_NOTIFICATIONS if not n.read and not n.dismissed])
    
    return NotificationListResponse(
        notifications=filtered[:limit],
        total=len(filtered),
        unread_count=unread_count
    )

@router.post("", response_model=Notification)
async def create_notification(notification: NotificationCreate):
    """Create a new notification."""
    new_notif = Notification(
        id=f"notif-{len(DEMO_NOTIFICATIONS) + 1:03d}",
        type=notification.type,
        title=notification.title,
        message=notification.message,
        source=notification.source,
        timestamp=datetime.now(),
        read=False,
        dismissed=False,
        action_url=notification.action_url,
        action_label=notification.action_label
    )
    return new_notif

@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a notification as read."""
    for notif in DEMO_NOTIFICATIONS:
        if notif.id == notification_id:
            notif.read = True
            return {"success": True, "id": notification_id}
    raise HTTPException(status_code=404, detail="Notification not found")

@router.patch("/read-all")
async def mark_all_read():
    """Mark all notifications as read."""
    for notif in DEMO_NOTIFICATIONS:
        notif.read = True
    return {"success": True, "count": len(DEMO_NOTIFICATIONS)}

@router.delete("/{notification_id}")
async def dismiss_notification(notification_id: str):
    """Dismiss a notification."""
    for notif in DEMO_NOTIFICATIONS:
        if notif.id == notification_id:
            notif.dismissed = True
            return {"success": True, "id": notification_id}
    raise HTTPException(status_code=404, detail="Notification not found")

@router.get("/preferences", response_model=NotificationPreferences)
async def get_notification_preferences(user_id: str = "current"):
    """Get notification preferences for a user."""
    return NotificationPreferences(
        user_id=user_id,
        email_enabled=True,
        slack_enabled=True,
        sms_enabled=False,
        quiet_hours_start=22,
        quiet_hours_end=7,
        digest_enabled=True,
        digest_frequency="daily"
    )

@router.put("/preferences", response_model=NotificationPreferences)
async def update_notification_preferences(preferences: NotificationPreferences):
    """Update notification preferences."""
    # In production, save to database
    return preferences

@router.get("/stats")
async def get_notification_stats():
    """Get notification statistics."""
    total = len(DEMO_NOTIFICATIONS)
    unread = len([n for n in DEMO_NOTIFICATIONS if not n.read])
    critical = len([n for n in DEMO_NOTIFICATIONS if n.type == NotificationType.CRITICAL])
    
    by_type = {}
    for t in NotificationType:
        by_type[t.value] = len([n for n in DEMO_NOTIFICATIONS if n.type == t])
    
    return {
        "total": total,
        "unread": unread,
        "critical_count": critical,
        "by_type": by_type
    }
