"""
Integrations API Routes
HRIS connections, webhooks, and third-party integrations
"""

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

router = APIRouter(prefix="/integrations", tags=["integrations"])


# Enums
class IntegrationProvider(str, Enum):
    GUSTO = "gusto"
    RIPPLING = "rippling"
    ADP = "adp"
    PAYLOCITY = "paylocity"
    BAMBOO = "bamboo"
    WORKDAY = "workday"
    UKG = "ukg"
    CUSTOM_API = "custom_api"
    SFTP = "sftp"


class ConnectionStatus(str, Enum):
    ACTIVE = "active"
    ERROR = "error"
    SYNCING = "syncing"
    DISCONNECTED = "disconnected"
    PENDING_AUTH = "pending_auth"


class SyncStatus(str, Enum):
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"
    IN_PROGRESS = "in_progress"


# Models
class IntegrationConnection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    provider: IntegrationProvider
    name: str
    status: ConnectionStatus = ConnectionStatus.PENDING_AUTH
    last_sync: Optional[datetime] = None
    next_sync: Optional[datetime] = None
    employees_synced: int = 0
    data_quality_score: float = 0.0
    features: List[str] = []
    config: dict = {}
    created_at: datetime = Field(default_factory=datetime.now)


class SyncHistory(BaseModel):
    id: str
    connection_id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: SyncStatus
    records_processed: int = 0
    records_created: int = 0
    records_updated: int = 0
    records_skipped: int = 0
    errors: List[dict] = []


class ConnectionRequest(BaseModel):
    provider: IntegrationProvider
    name: str
    auth_type: str  # oauth, api_key, sftp
    credentials: dict = {}


class WebhookConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    url: str
    events: List[str]
    secret: Optional[str] = None
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.now)


# Mock data
mock_connections: List[IntegrationConnection] = [
    IntegrationConnection(
        id="conn-001",
        provider=IntegrationProvider.GUSTO,
        name="Gusto Payroll",
        status=ConnectionStatus.ACTIVE,
        last_sync=datetime.now(),
        employees_synced=2145,
        data_quality_score=98.2,
        features=["Employee Data", "Hours", "Compensation", "Benefits"]
    ),
    IntegrationConnection(
        id="conn-002",
        provider=IntegrationProvider.RIPPLING,
        name="Rippling HR",
        status=ConnectionStatus.ACTIVE,
        last_sync=datetime.now(),
        employees_synced=1876,
        data_quality_score=95.4,
        features=["Employee Data", "Onboarding", "Benefits"]
    ),
]

mock_webhooks: List[WebhookConfig] = []


# Routes
@router.get("/connections", response_model=List[IntegrationConnection])
async def list_connections():
    """List all integration connections."""
    return mock_connections


@router.post("/connections", response_model=IntegrationConnection)
async def create_connection(request: ConnectionRequest):
    """Create a new integration connection."""
    connection = IntegrationConnection(
        provider=request.provider,
        name=request.name,
        status=ConnectionStatus.PENDING_AUTH,
        config={"auth_type": request.auth_type}
    )
    mock_connections.append(connection)
    return connection


@router.get("/connections/{connection_id}", response_model=IntegrationConnection)
async def get_connection(connection_id: str):
    """Get connection details."""
    conn = next((c for c in mock_connections if c.id == connection_id), None)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    return conn


@router.delete("/connections/{connection_id}")
async def delete_connection(connection_id: str):
    """Delete an integration connection."""
    global mock_connections
    mock_connections = [c for c in mock_connections if c.id != connection_id]
    return {"message": "Connection deleted successfully"}


@router.post("/connections/{connection_id}/sync")
async def trigger_sync(connection_id: str, background_tasks: BackgroundTasks):
    """Trigger a manual sync for a connection."""
    conn = next((c for c in mock_connections if c.id == connection_id), None)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    return {
        "sync_id": f"sync-{uuid.uuid4().hex[:8]}",
        "connection_id": connection_id,
        "status": "in_progress",
        "message": "Sync started"
    }


@router.get("/connections/{connection_id}/sync-history", response_model=List[SyncHistory])
async def get_sync_history(
    connection_id: str,
    limit: int = Query(default=10, le=50)
):
    """Get sync history for a connection."""
    return [
        SyncHistory(
            id=f"sync-{i}",
            connection_id=connection_id,
            started_at=datetime.now(),
            completed_at=datetime.now(),
            status=SyncStatus.SUCCESS,
            records_processed=2145,
            records_created=12,
            records_updated=87,
            records_skipped=3
        )
        for i in range(min(limit, 5))
    ]


@router.post("/connections/{connection_id}/test")
async def test_connection(connection_id: str):
    """Test an integration connection."""
    conn = next((c for c in mock_connections if c.id == connection_id), None)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    return {
        "success": True,
        "message": "Connection test successful",
        "latency_ms": 145,
        "scopes_verified": ["employees:read", "payroll:read"]
    }


# OAuth endpoints
@router.get("/oauth/{provider}/authorize")
async def get_oauth_url(provider: IntegrationProvider, redirect_uri: str):
    """Get OAuth authorization URL."""
    return {
        "authorization_url": f"https://api.{provider.value}.com/oauth/authorize",
        "state": uuid.uuid4().hex
    }


@router.post("/oauth/{provider}/callback")
async def oauth_callback(
    provider: IntegrationProvider,
    code: str,
    state: str
):
    """Handle OAuth callback."""
    return {
        "success": True,
        "connection_id": f"conn-{uuid.uuid4().hex[:8]}",
        "message": "OAuth authorization successful"
    }


# Webhooks
@router.get("/webhooks", response_model=List[WebhookConfig])
async def list_webhooks():
    """List all configured webhooks."""
    return mock_webhooks


@router.post("/webhooks", response_model=WebhookConfig)
async def create_webhook(webhook: WebhookConfig):
    """Create a new webhook configuration."""
    mock_webhooks.append(webhook)
    return webhook


@router.delete("/webhooks/{webhook_id}")
async def delete_webhook(webhook_id: str):
    """Delete a webhook."""
    global mock_webhooks
    mock_webhooks = [w for w in mock_webhooks if w.id != webhook_id]
    return {"message": "Webhook deleted successfully"}


# Data mapping
@router.get("/connections/{connection_id}/field-mapping")
async def get_field_mapping(connection_id: str):
    """Get field mapping configuration."""
    return {
        "mappings": [
            {"source": "employee_id", "target": "external_id", "transform": None},
            {"source": "first_name", "target": "first_name", "transform": "title_case"},
            {"source": "last_name", "target": "last_name", "transform": "title_case"},
            {"source": "hire_date", "target": "hire_date", "transform": "date_format"},
            {"source": "hours_worked", "target": "weekly_hours", "transform": "numeric"},
        ]
    }


@router.put("/connections/{connection_id}/field-mapping")
async def update_field_mapping(connection_id: str, mappings: List[dict]):
    """Update field mapping configuration."""
    return {"message": "Field mapping updated successfully"}
