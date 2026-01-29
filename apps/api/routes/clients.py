"""
Clients API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()


class Client(BaseModel):
    id: str
    name: str
    ein: str
    employees: int
    fte_count: int
    status: str
    data_quality: int
    last_sync: str
    sync_status: str
    open_risks: int
    created_at: str


class ClientCreate(BaseModel):
    name: str
    ein: str


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    ein: Optional[str] = None


# Demo data
clients_db: dict[str, Client] = {
    "1": Client(
        id="1",
        name="Apex Manufacturing Corp",
        ein="12-3456789",
        employees=2340,
        fte_count=2180,
        status="compliant",
        data_quality=98,
        last_sync="2024-01-27T10:00:00Z",
        sync_status="connected",
        open_risks=0,
        created_at="2024-01-01T00:00:00Z"
    ),
    "2": Client(
        id="2",
        name="Horizon Healthcare Systems",
        ein="98-7654321",
        employees=1820,
        fte_count=1650,
        status="at_risk",
        data_quality=87,
        last_sync="2024-01-27T08:00:00Z",
        sync_status="connected",
        open_risks=3,
        created_at="2024-01-05T00:00:00Z"
    ),
}


@router.get("", response_model=List[Client])
async def list_clients():
    """List all clients"""
    return list(clients_db.values())


@router.get("/{client_id}", response_model=Client)
async def get_client(client_id: str):
    """Get a single client by ID"""
    if client_id not in clients_db:
        raise HTTPException(status_code=404, detail="Client not found")
    return clients_db[client_id]


@router.post("", response_model=Client)
async def create_client(client: ClientCreate):
    """Create a new client"""
    client_id = str(uuid.uuid4())
    new_client = Client(
        id=client_id,
        name=client.name,
        ein=client.ein,
        employees=0,
        fte_count=0,
        status="pending_review",
        data_quality=0,
        last_sync="",
        sync_status="disconnected",
        open_risks=0,
        created_at=datetime.now().isoformat()
    )
    clients_db[client_id] = new_client
    return new_client


@router.patch("/{client_id}", response_model=Client)
async def update_client(client_id: str, update: ClientUpdate):
    """Update a client"""
    if client_id not in clients_db:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client = clients_db[client_id]
    if update.name:
        client.name = update.name
    if update.ein:
        client.ein = update.ein
    
    return client


@router.delete("/{client_id}")
async def delete_client(client_id: str):
    """Delete a client"""
    if client_id not in clients_db:
        raise HTTPException(status_code=404, detail="Client not found")
    
    del clients_db[client_id]
    return {"message": "Client deleted"}


@router.post("/{client_id}/sync")
async def sync_client(client_id: str):
    """Trigger a data sync for a client"""
    if client_id not in clients_db:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client = clients_db[client_id]
    client.last_sync = datetime.now().isoformat()
    client.sync_status = "syncing"
    
    return {"message": "Sync initiated", "client_id": client_id}
