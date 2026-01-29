"""
Synapse API - AI-Native Benefits Compliance Platform
Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Synapse API starting up...")
    logger.info("✅ AI Agents initialized")
    yield
    # Shutdown
    logger.info("👋 Synapse API shutting down...")

# Create FastAPI application
app = FastAPI(
    title="Synapse API",
    description="AI-Native Benefits Compliance Platform - The Lumelight Killer",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "synapse-api",
        "version": "0.1.0",
        "agents": {
            "connector": "ready",
            "normalizer": "ready",
            "compliance": "ready",
            "reporter": "ready"
        }
    }

# API info endpoint
@app.get("/")
async def root():
    return {
        "name": "Synapse API",
        "description": "AI-Native Benefits Compliance Platform",
        "documentation": "/docs",
        "version": "0.1.0"
    }

# Import and include routers
from routes import clients, employees, pipeline, compliance, forms

app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Data Pipeline"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["Compliance"])
app.include_router(forms.router, prefix="/api/forms", tags=["IRS Forms"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
