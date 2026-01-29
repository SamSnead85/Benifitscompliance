"""
Audit Trail API Routes
Activity logging and history tracking
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()


class AuditEvent(BaseModel):
    id: str
    timestamp: str
    user_id: str
    user_name: str
    action: str  # created, updated, deleted, viewed, exported, etc.
    resource_type: str  # client, employee, form, report, etc.
    resource_id: str
    resource_name: Optional[str]
    details: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]


class AuditLogRequest(BaseModel):
    action: str
    resource_type: str
    resource_id: str
    resource_name: Optional[str] = None
    details: Optional[str] = None


# In-memory storage for demo
audit_log: List[AuditEvent] = []


def _seed_demo_data():
    """Seed demo audit events"""
    global audit_log
    if not audit_log:
        demo_events = [
            AuditEvent(
                id=str(uuid.uuid4()),
                timestamp=(datetime.now()).isoformat(),
                user_id="user-001",
                user_name="Sam Sweilem",
                action="generated",
                resource_type="report",
                resource_id="RPT-001",
                resource_name="1095-C Batch - Apex Manufacturing",
                details="Generated 2,340 forms",
                ip_address="192.168.1.1",
                user_agent="Mozilla/5.0"
            ),
            AuditEvent(
                id=str(uuid.uuid4()),
                timestamp=(datetime.now()).isoformat(),
                user_id="user-001",
                user_name="Sam Sweilem",
                action="updated",
                resource_type="client",
                resource_id="CLT-001",
                resource_name="Apex Manufacturing Corp",
                details="Updated safe harbor configuration",
                ip_address="192.168.1.1",
                user_agent="Mozilla/5.0"
            ),
            AuditEvent(
                id=str(uuid.uuid4()),
                timestamp=(datetime.now()).isoformat(),
                user_id="user-002",
                user_name="Jane Smith",
                action="approved",
                resource_type="form",
                resource_id="1095C-001",
                resource_name="1095-C for John Doe",
                details="Approved for filing",
                ip_address="192.168.1.2",
                user_agent="Mozilla/5.0"
            ),
        ]
        audit_log.extend(demo_events)


@router.get("/", response_model=List[AuditEvent])
async def get_audit_log(
    resource_type: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    limit: int = Query(50, le=500)
):
    """Get audit log entries with optional filters"""
    _seed_demo_data()
    
    results = audit_log.copy()
    
    if resource_type:
        results = [e for e in results if e.resource_type == resource_type]
    
    if action:
        results = [e for e in results if e.action == action]
    
    if user_id:
        results = [e for e in results if e.user_id == user_id]
    
    # Sort by timestamp descending
    results.sort(key=lambda e: e.timestamp, reverse=True)
    
    return results[:limit]


@router.post("/", response_model=AuditEvent)
async def log_event(request: AuditLogRequest):
    """Log a new audit event"""
    event = AuditEvent(
        id=str(uuid.uuid4()),
        timestamp=datetime.now().isoformat(),
        user_id="user-001",  # In production, get from auth context
        user_name="Current User",
        action=request.action,
        resource_type=request.resource_type,
        resource_id=request.resource_id,
        resource_name=request.resource_name,
        details=request.details,
        ip_address=None,
        user_agent=None
    )
    
    audit_log.append(event)
    
    return event


@router.get("/stats")
async def get_audit_stats():
    """Get audit log statistics"""
    _seed_demo_data()
    
    # Count by action
    action_counts = {}
    for event in audit_log:
        action_counts[event.action] = action_counts.get(event.action, 0) + 1
    
    # Count by resource type
    resource_counts = {}
    for event in audit_log:
        resource_counts[event.resource_type] = resource_counts.get(event.resource_type, 0) + 1
    
    return {
        "total_events": len(audit_log),
        "by_action": action_counts,
        "by_resource": resource_counts
    }


@router.get("/recent")
async def get_recent_activity(limit: int = Query(10, le=50)):
    """Get most recent activity for dashboard"""
    _seed_demo_data()
    
    results = sorted(audit_log, key=lambda e: e.timestamp, reverse=True)[:limit]
    
    return [{
        "id": e.id,
        "user": e.user_name,
        "action": e.action,
        "resource": f"{e.resource_type}: {e.resource_name or e.resource_id}",
        "timestamp": e.timestamp
    } for e in results]
