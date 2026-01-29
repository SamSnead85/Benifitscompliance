"""
Pipeline API Routes
Handles data upload, processing, and pipeline status
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from agents import connector_agent, normalizer_agent, compliance_agent

router = APIRouter()


# Request/Response Models
class PipelineStatus(BaseModel):
    pipeline_id: str
    client_id: str
    status: str  # "queued", "processing", "completed", "failed"
    stage: str
    records_total: int
    records_processed: int
    records_flagged: int
    started_at: Optional[str]
    completed_at: Optional[str]
    error: Optional[str]


class PipelineStageResult(BaseModel):
    stage: str
    status: str
    records_in: int
    records_out: int
    duration_ms: int
    transformations: List[Dict[str, Any]]


class UploadResponse(BaseModel):
    pipeline_id: str
    message: str
    records_detected: int
    schema: Dict[str, Any]


# In-memory storage for demo (use database in production)
pipelines: Dict[str, PipelineStatus] = {}
pipeline_results: Dict[str, List[PipelineStageResult]] = {}


@router.post("/upload/{client_id}", response_model=UploadResponse)
async def upload_data(
    client_id: str,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Upload a CSV file for processing through the AI Data Refinery pipeline.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    # Read file content
    content = await file.read()
    
    # Ingest via Connector Agent
    result = await connector_agent.ingest_csv(content, client_id, file.filename)
    
    if not result.success:
        raise HTTPException(status_code=400, detail=f"Ingestion failed: {result.errors}")
    
    # Detect schema
    sample_data = [r.raw_data for r in result.raw_records[:5]]
    schema = connector_agent.detect_csv_schema(sample_data)
    
    # Create pipeline
    pipeline_id = str(uuid.uuid4())
    
    pipelines[pipeline_id] = PipelineStatus(
        pipeline_id=pipeline_id,
        client_id=client_id,
        status="queued",
        stage="connector",
        records_total=result.records_ingested,
        records_processed=0,
        records_flagged=0,
        started_at=datetime.now().isoformat(),
        completed_at=None,
        error=None
    )
    
    pipeline_results[pipeline_id] = [
        PipelineStageResult(
            stage="connector",
            status="completed",
            records_in=result.records_ingested,
            records_out=result.records_ingested,
            duration_ms=result.duration_ms,
            transformations=[]
        )
    ]
    
    # Queue processing (in production, use Celery/Redis)
    if background_tasks:
        background_tasks.add_task(
            process_pipeline, 
            pipeline_id, 
            client_id, 
            [r.raw_data for r in result.raw_records]
        )
    
    return UploadResponse(
        pipeline_id=pipeline_id,
        message=f"Successfully uploaded {result.records_ingested} records",
        records_detected=result.records_ingested,
        schema=schema
    )


@router.get("/status/{pipeline_id}", response_model=PipelineStatus)
async def get_pipeline_status(pipeline_id: str):
    """Get the current status of a processing pipeline"""
    if pipeline_id not in pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    return pipelines[pipeline_id]


@router.get("/stages/{pipeline_id}", response_model=List[PipelineStageResult])
async def get_pipeline_stages(pipeline_id: str):
    """Get detailed results for each pipeline stage"""
    if pipeline_id not in pipeline_results:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    return pipeline_results[pipeline_id]


@router.post("/process/{pipeline_id}")
async def trigger_processing(pipeline_id: str, background_tasks: BackgroundTasks):
    """Manually trigger pipeline processing"""
    if pipeline_id not in pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    pipeline = pipelines[pipeline_id]
    if pipeline.status == "processing":
        raise HTTPException(status_code=400, detail="Pipeline already processing")
    
    pipelines[pipeline_id].status = "processing"
    
    return {"message": "Processing triggered", "pipeline_id": pipeline_id}


async def process_pipeline(pipeline_id: str, client_id: str, raw_records: List[Dict]):
    """Background task to process data through all pipeline stages"""
    try:
        # Update status
        pipelines[pipeline_id].status = "processing"
        
        # Stage 2: Normalization
        pipelines[pipeline_id].stage = "normalizer"
        norm_result = await normalizer_agent.normalize_batch(
            [{"raw_data": r} for r in raw_records],
            client_id
        )
        
        pipeline_results[pipeline_id].append(PipelineStageResult(
            stage="normalizer",
            status="completed",
            records_in=len(raw_records),
            records_out=norm_result.records_normalized,
            duration_ms=norm_result.duration_ms,
            transformations=[
                {
                    "field": t.field,
                    "source": t.source_value,
                    "target": t.normalized_value,
                    "type": t.transformation_type.value,
                    "confidence": t.confidence
                }
                for rec in norm_result.normalized_records[:10]
                for t in rec.transformations[:3]
            ]
        ))
        
        pipelines[pipeline_id].records_processed = norm_result.records_normalized
        pipelines[pipeline_id].records_flagged = norm_result.records_flagged
        
        # Stage 3: Compliance
        pipelines[pipeline_id].stage = "compliance"
        employee_dicts = [
            {
                "employee_id": r.employee_id or r.record_id,
                "first_name": r.first_name,
                "last_name": r.last_name,
                "hire_date": r.hire_date,
                "employment_type": r.employment_type,
                "employment_status": r.employment_status,
                "annual_salary": r.annual_salary,
                "hourly_rate": r.hourly_rate
            }
            for r in norm_result.normalized_records
        ]
        
        compliance_result = await compliance_agent.assess_compliance(employee_dicts, client_id)
        
        pipeline_results[pipeline_id].append(PipelineStageResult(
            stage="compliance",
            status="completed",
            records_in=norm_result.records_normalized,
            records_out=compliance_result.total_assessed,
            duration_ms=compliance_result.duration_ms,
            transformations=[
                {
                    "employee_id": a.employee_id,
                    "status": a.status.value,
                    "fte_status": a.fte_determination.status.value,
                    "line_14_code": a.line_14_code
                }
                for a in compliance_result.assessments[:10]
            ]
        ))
        
        # Stage 4: Reporter (placeholder)
        pipelines[pipeline_id].stage = "reporter"
        pipeline_results[pipeline_id].append(PipelineStageResult(
            stage="reporter",
            status="completed",
            records_in=compliance_result.total_assessed,
            records_out=compliance_result.compliant,
            duration_ms=50,
            transformations=[]
        ))
        
        # Complete
        pipelines[pipeline_id].status = "completed"
        pipelines[pipeline_id].completed_at = datetime.now().isoformat()
        
    except Exception as e:
        pipelines[pipeline_id].status = "failed"
        pipelines[pipeline_id].error = str(e)
