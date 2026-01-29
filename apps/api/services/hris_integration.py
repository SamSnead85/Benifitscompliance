"""
HRIS Integration Service
Provides unified interface for connecting to various HRIS providers.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, date
from pydantic import BaseModel
from enum import Enum
import json

class HRISProvider(str, Enum):
    GUSTO = "gusto"
    RIPPLING = "rippling"
    ADP = "adp"
    PAYLOCITY = "paylocity"
    UKG = "ukg"
    WORKDAY = "workday"
    BAMBOOHR = "bamboohr"

class ConnectionStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PENDING = "pending"
    ERROR = "error"

class SyncStatus(str, Enum):
    IDLE = "idle"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class HRISConnection(BaseModel):
    provider: HRISProvider
    status: ConnectionStatus
    connected_at: Optional[datetime] = None
    last_sync: Optional[datetime] = None
    sync_frequency: str = "daily"
    employee_count: int = 0
    error_message: Optional[str] = None

class SyncResult(BaseModel):
    sync_id: str
    provider: HRISProvider
    status: SyncStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    records_processed: int = 0
    records_created: int = 0
    records_updated: int = 0
    records_skipped: int = 0
    errors: List[dict] = []

class EmployeeRecord(BaseModel):
    external_id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    ssn_last_four: str
    date_of_birth: date
    hire_date: date
    termination_date: Optional[date] = None
    department: Optional[str] = None
    job_title: Optional[str] = None
    employment_type: str
    work_location: Optional[str] = None
    manager_id: Optional[str] = None
    compensation: Optional[float] = None
    hours_per_week: Optional[float] = None

class HRISIntegrationService:
    """Service for managing HRIS integrations and data sync."""
    
    def __init__(self):
        self.connections: Dict[HRISProvider, HRISConnection] = {}
        self.sync_history: List[SyncResult] = []
    
    async def connect(
        self,
        provider: HRISProvider,
        credentials: Dict[str, Any]
    ) -> HRISConnection:
        """Establish connection to HRIS provider."""
        # Provider-specific connection logic
        if provider == HRISProvider.GUSTO:
            return await self._connect_gusto(credentials)
        elif provider == HRISProvider.RIPPLING:
            return await self._connect_rippling(credentials)
        elif provider == HRISProvider.ADP:
            return await self._connect_adp(credentials)
        else:
            return await self._connect_generic(provider, credentials)
    
    async def _connect_gusto(self, credentials: Dict[str, Any]) -> HRISConnection:
        """Connect to Gusto via OAuth2."""
        # In production: Exchange OAuth code for access token
        connection = HRISConnection(
            provider=HRISProvider.GUSTO,
            status=ConnectionStatus.CONNECTED,
            connected_at=datetime.now(),
            sync_frequency="daily"
        )
        self.connections[HRISProvider.GUSTO] = connection
        return connection
    
    async def _connect_rippling(self, credentials: Dict[str, Any]) -> HRISConnection:
        """Connect to Rippling via API key."""
        # In production: Validate API key
        connection = HRISConnection(
            provider=HRISProvider.RIPPLING,
            status=ConnectionStatus.CONNECTED,
            connected_at=datetime.now(),
            sync_frequency="hourly"
        )
        self.connections[HRISProvider.RIPPLING] = connection
        return connection
    
    async def _connect_adp(self, credentials: Dict[str, Any]) -> HRISConnection:
        """Connect to ADP Workforce Now."""
        connection = HRISConnection(
            provider=HRISProvider.ADP,
            status=ConnectionStatus.CONNECTED,
            connected_at=datetime.now(),
            sync_frequency="daily"
        )
        self.connections[HRISProvider.ADP] = connection
        return connection
    
    async def _connect_generic(
        self,
        provider: HRISProvider,
        credentials: Dict[str, Any]
    ) -> HRISConnection:
        """Generic connection handler."""
        connection = HRISConnection(
            provider=provider,
            status=ConnectionStatus.CONNECTED,
            connected_at=datetime.now()
        )
        self.connections[provider] = connection
        return connection
    
    async def disconnect(self, provider: HRISProvider) -> bool:
        """Disconnect from HRIS provider."""
        if provider in self.connections:
            self.connections[provider].status = ConnectionStatus.DISCONNECTED
            return True
        return False
    
    async def sync_employees(
        self,
        provider: HRISProvider,
        full_sync: bool = False
    ) -> SyncResult:
        """Sync employee data from HRIS provider."""
        sync_id = f"sync-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        result = SyncResult(
            sync_id=sync_id,
            provider=provider,
            status=SyncStatus.IN_PROGRESS,
            started_at=datetime.now()
        )
        
        try:
            # In production: Fetch data from provider API
            if provider == HRISProvider.GUSTO:
                employees = await self._fetch_gusto_employees()
            elif provider == HRISProvider.RIPPLING:
                employees = await self._fetch_rippling_employees()
            else:
                employees = []
            
            for emp in employees:
                try:
                    # Process employee record
                    result.records_processed += 1
                    # In production: Upsert to database
                    result.records_created += 1
                except Exception as e:
                    result.errors.append({
                        "employee_id": emp.external_id,
                        "error": str(e)
                    })
            
            result.status = SyncStatus.COMPLETED
            result.completed_at = datetime.now()
            
            # Update connection
            if provider in self.connections:
                self.connections[provider].last_sync = datetime.now()
                self.connections[provider].employee_count = result.records_processed
            
        except Exception as e:
            result.status = SyncStatus.FAILED
            result.errors.append({"error": str(e)})
        
        self.sync_history.append(result)
        return result
    
    async def _fetch_gusto_employees(self) -> List[EmployeeRecord]:
        """Fetch employees from Gusto API."""
        # Demo data
        return [
            EmployeeRecord(
                external_id="gusto-001",
                first_name="John",
                last_name="Doe",
                email="john.doe@example.com",
                ssn_last_four="1234",
                date_of_birth=date(1985, 5, 15),
                hire_date=date(2020, 3, 1),
                department="Engineering",
                job_title="Software Engineer",
                employment_type="full_time",
                hours_per_week=40.0
            )
        ]
    
    async def _fetch_rippling_employees(self) -> List[EmployeeRecord]:
        """Fetch employees from Rippling API."""
        return []
    
    def get_connection_status(self, provider: HRISProvider) -> Optional[HRISConnection]:
        """Get current connection status for a provider."""
        return self.connections.get(provider)
    
    def get_all_connections(self) -> List[HRISConnection]:
        """Get all configured connections."""
        return list(self.connections.values())
    
    def get_sync_history(
        self,
        provider: Optional[HRISProvider] = None,
        limit: int = 10
    ) -> List[SyncResult]:
        """Get sync history, optionally filtered by provider."""
        history = self.sync_history
        if provider:
            history = [s for s in history if s.provider == provider]
        return sorted(history, key=lambda s: s.started_at, reverse=True)[:limit]
    
    async def validate_credentials(
        self,
        provider: HRISProvider,
        credentials: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate credentials without establishing full connection."""
        # In production: Test API credentials
        return {
            "valid": True,
            "provider": provider,
            "scopes": ["employees:read", "payroll:read"],
            "company_name": "Demo Company"
        }

# Singleton instance
hris_service = HRISIntegrationService()
