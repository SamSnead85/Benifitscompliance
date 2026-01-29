"""
Webhook System API Routes
Provides endpoints for managing webhooks for external integrations.
"""

from fastapi import APIRouter, Query, HTTPException, Header
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum
import hashlib
import hmac
import secrets

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

# Models
class WebhookEvent(str, Enum):
    EMPLOYEE_CREATED = "employee.created"
    EMPLOYEE_UPDATED = "employee.updated"
    EMPLOYEE_TERMINATED = "employee.terminated"
    COMPLIANCE_STATUS_CHANGED = "compliance.status_changed"
    FORM_GENERATED = "form.generated"
    FORM_APPROVED = "form.approved"
    ALERT_TRIGGERED = "alert.triggered"
    SYNC_COMPLETED = "sync.completed"

class WebhookStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    FAILED = "failed"

class Webhook(BaseModel):
    id: str
    url: str
    events: List[WebhookEvent]
    status: WebhookStatus
    secret: str
    created_at: datetime
    last_triggered: Optional[datetime] = None
    failure_count: int = 0
    description: Optional[str] = None

class WebhookCreate(BaseModel):
    url: str
    events: List[WebhookEvent]
    description: Optional[str] = None

class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    events: Optional[List[WebhookEvent]] = None
    status: Optional[WebhookStatus] = None
    description: Optional[str] = None

class WebhookDelivery(BaseModel):
    id: str
    webhook_id: str
    event: WebhookEvent
    payload: dict
    status_code: Optional[int] = None
    response_body: Optional[str] = None
    delivered_at: datetime
    success: bool
    retry_count: int = 0

class WebhookListResponse(BaseModel):
    webhooks: List[Webhook]
    total: int

# Demo Data
DEMO_WEBHOOKS = [
    Webhook(
        id="wh-001",
        url="https://api.example.com/synapse/webhook",
        events=[WebhookEvent.EMPLOYEE_CREATED, WebhookEvent.EMPLOYEE_UPDATED],
        status=WebhookStatus.ACTIVE,
        secret="whsec_" + secrets.token_hex(16),
        created_at=datetime.now(),
        last_triggered=datetime.now(),
        failure_count=0,
        description="HR System Integration"
    ),
    Webhook(
        id="wh-002",
        url="https://slack.example.com/webhook",
        events=[WebhookEvent.ALERT_TRIGGERED, WebhookEvent.COMPLIANCE_STATUS_CHANGED],
        status=WebhookStatus.ACTIVE,
        secret="whsec_" + secrets.token_hex(16),
        created_at=datetime.now(),
        description="Slack Notifications"
    )
]

DEMO_DELIVERIES = [
    WebhookDelivery(
        id="del-001",
        webhook_id="wh-001",
        event=WebhookEvent.EMPLOYEE_CREATED,
        payload={"employee_id": "EMP-001", "name": "John Smith"},
        status_code=200,
        response_body='{"received": true}',
        delivered_at=datetime.now(),
        success=True
    )
]

# Routes
@router.get("", response_model=WebhookListResponse)
async def list_webhooks():
    """List all configured webhooks."""
    return WebhookListResponse(
        webhooks=DEMO_WEBHOOKS,
        total=len(DEMO_WEBHOOKS)
    )

@router.get("/{webhook_id}", response_model=Webhook)
async def get_webhook(webhook_id: str):
    """Get a specific webhook by ID."""
    for wh in DEMO_WEBHOOKS:
        if wh.id == webhook_id:
            return wh
    raise HTTPException(status_code=404, detail="Webhook not found")

@router.post("", response_model=Webhook)
async def create_webhook(webhook: WebhookCreate):
    """Create a new webhook."""
    new_webhook = Webhook(
        id=f"wh-{len(DEMO_WEBHOOKS) + 1:03d}",
        url=webhook.url,
        events=webhook.events,
        status=WebhookStatus.ACTIVE,
        secret="whsec_" + secrets.token_hex(16),
        created_at=datetime.now(),
        description=webhook.description
    )
    return new_webhook

@router.patch("/{webhook_id}", response_model=Webhook)
async def update_webhook(webhook_id: str, update: WebhookUpdate):
    """Update a webhook configuration."""
    for wh in DEMO_WEBHOOKS:
        if wh.id == webhook_id:
            # In production, update in database
            return wh
    raise HTTPException(status_code=404, detail="Webhook not found")

@router.delete("/{webhook_id}")
async def delete_webhook(webhook_id: str):
    """Delete a webhook."""
    for wh in DEMO_WEBHOOKS:
        if wh.id == webhook_id:
            return {"success": True, "id": webhook_id}
    raise HTTPException(status_code=404, detail="Webhook not found")

@router.post("/{webhook_id}/test")
async def test_webhook(webhook_id: str):
    """Send a test event to a webhook."""
    for wh in DEMO_WEBHOOKS:
        if wh.id == webhook_id:
            # In production, send actual test request
            return {
                "success": True,
                "webhook_id": webhook_id,
                "test_event": "ping",
                "response_status": 200,
                "latency_ms": 145
            }
    raise HTTPException(status_code=404, detail="Webhook not found")

@router.post("/{webhook_id}/rotate-secret")
async def rotate_webhook_secret(webhook_id: str):
    """Generate a new secret for a webhook."""
    for wh in DEMO_WEBHOOKS:
        if wh.id == webhook_id:
            new_secret = "whsec_" + secrets.token_hex(16)
            # In production, update in database
            return {
                "success": True,
                "webhook_id": webhook_id,
                "new_secret": new_secret
            }
    raise HTTPException(status_code=404, detail="Webhook not found")

@router.get("/{webhook_id}/deliveries", response_model=List[WebhookDelivery])
async def get_webhook_deliveries(
    webhook_id: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get recent deliveries for a webhook."""
    deliveries = [d for d in DEMO_DELIVERIES if d.webhook_id == webhook_id]
    return deliveries[:limit]

@router.post("/{webhook_id}/deliveries/{delivery_id}/retry")
async def retry_delivery(webhook_id: str, delivery_id: str):
    """Retry a failed webhook delivery."""
    return {
        "success": True,
        "webhook_id": webhook_id,
        "delivery_id": delivery_id,
        "retry_queued": True
    }

@router.get("/events/available")
async def list_available_events():
    """List all available webhook events."""
    return {
        "events": [
            {"event": e.value, "description": _get_event_description(e)}
            for e in WebhookEvent
        ]
    }

def _get_event_description(event: WebhookEvent) -> str:
    descriptions = {
        WebhookEvent.EMPLOYEE_CREATED: "Triggered when a new employee is added",
        WebhookEvent.EMPLOYEE_UPDATED: "Triggered when employee data is modified",
        WebhookEvent.EMPLOYEE_TERMINATED: "Triggered when an employee is terminated",
        WebhookEvent.COMPLIANCE_STATUS_CHANGED: "Triggered when compliance status changes",
        WebhookEvent.FORM_GENERATED: "Triggered when a new form is generated",
        WebhookEvent.FORM_APPROVED: "Triggered when a form is approved",
        WebhookEvent.ALERT_TRIGGERED: "Triggered when a new alert is created",
        WebhookEvent.SYNC_COMPLETED: "Triggered when HRIS sync completes"
    }
    return descriptions.get(event, "")
