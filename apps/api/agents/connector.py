"""
Connector Agent
Handles data ingestion from HRIS, payroll, and benefits systems.
Supports API integrations (Gusto, Rippling) and file uploads (CSV, SFTP).
"""

import io
import csv
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class DataSourceType(str, Enum):
    API_GUSTO = "api_gusto"
    API_RIPPLING = "api_rippling"
    API_ADP = "api_adp"
    SFTP = "sftp"
    MANUAL_UPLOAD = "manual_upload"


@dataclass
class RawRecord:
    """Raw record from source system before normalization"""
    source_type: DataSourceType
    source_id: str
    raw_data: Dict[str, Any]
    ingested_at: datetime
    client_id: str


@dataclass
class IngestionResult:
    """Result of a data ingestion operation"""
    success: bool
    records_ingested: int
    records_failed: int
    errors: List[str]
    raw_records: List[RawRecord]
    duration_ms: int


class ConnectorAgent:
    """
    The Connector Agent handles all data ingestion from external systems.
    It supports multiple data sources and normalizes them into raw records
    for processing by the Normalization Agent.
    """
    
    def __init__(self):
        self.supported_sources = [
            DataSourceType.API_GUSTO,
            DataSourceType.API_RIPPLING,
            DataSourceType.SFTP,
            DataSourceType.MANUAL_UPLOAD
        ]
    
    async def ingest_csv(
        self, 
        file_content: bytes, 
        client_id: str,
        filename: str = "upload.csv"
    ) -> IngestionResult:
        """
        Ingest data from a CSV file upload.
        
        Args:
            file_content: Raw bytes of the CSV file
            client_id: ID of the client this data belongs to
            filename: Original filename for reference
            
        Returns:
            IngestionResult with raw records ready for normalization
        """
        start_time = datetime.now()
        raw_records: List[RawRecord] = []
        errors: List[str] = []
        
        try:
            # Decode and parse CSV
            text_content = file_content.decode('utf-8-sig')  # Handle BOM
            reader = csv.DictReader(io.StringIO(text_content))
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is 1)
                try:
                    # Clean empty values
                    cleaned_row = {k.strip(): v.strip() if v else None for k, v in row.items()}
                    
                    # Generate a source ID
                    source_id = f"csv_{filename}_{row_num}"
                    
                    raw_record = RawRecord(
                        source_type=DataSourceType.MANUAL_UPLOAD,
                        source_id=source_id,
                        raw_data=cleaned_row,
                        ingested_at=datetime.now(),
                        client_id=client_id
                    )
                    raw_records.append(raw_record)
                    
                except Exception as e:
                    errors.append(f"Row {row_num}: {str(e)}")
            
            duration = (datetime.now() - start_time).total_seconds() * 1000
            
            logger.info(f"CSV ingestion complete: {len(raw_records)} records, {len(errors)} errors")
            
            return IngestionResult(
                success=len(errors) == 0,
                records_ingested=len(raw_records),
                records_failed=len(errors),
                errors=errors,
                raw_records=raw_records,
                duration_ms=int(duration)
            )
            
        except Exception as e:
            logger.error(f"CSV ingestion failed: {str(e)}")
            return IngestionResult(
                success=False,
                records_ingested=0,
                records_failed=1,
                errors=[str(e)],
                raw_records=[],
                duration_ms=0
            )
    
    async def ingest_from_gusto(
        self, 
        client_id: str,
        access_token: str,
        company_id: str
    ) -> IngestionResult:
        """
        Ingest employee data from Gusto API.
        
        Args:
            client_id: Internal client ID
            access_token: OAuth access token for Gusto API
            company_id: Gusto company ID
            
        Returns:
            IngestionResult with raw records
        """
        # TODO: Implement Gusto API integration
        # This would use the Gusto API to fetch:
        # - Employees
        # - Hours worked
        # - Benefits enrollments
        
        logger.info(f"Gusto ingestion requested for client {client_id}")
        
        # Placeholder implementation
        return IngestionResult(
            success=True,
            records_ingested=0,
            records_failed=0,
            errors=["Gusto integration not yet implemented"],
            raw_records=[],
            duration_ms=0
        )
    
    async def ingest_from_rippling(
        self, 
        client_id: str,
        api_key: str
    ) -> IngestionResult:
        """
        Ingest employee data from Rippling API.
        
        Args:
            client_id: Internal client ID
            api_key: Rippling API key
            
        Returns:
            IngestionResult with raw records
        """
        # TODO: Implement Rippling API integration
        
        logger.info(f"Rippling ingestion requested for client {client_id}")
        
        return IngestionResult(
            success=True,
            records_ingested=0,
            records_failed=0,
            errors=["Rippling integration not yet implemented"],
            raw_records=[],
            duration_ms=0
        )
    
    async def ingest_from_sftp(
        self,
        client_id: str,
        host: str,
        username: str,
        password: str,
        path: str
    ) -> IngestionResult:
        """
        Ingest data from an SFTP server.
        
        Args:
            client_id: Internal client ID
            host: SFTP server hostname
            username: SFTP username
            password: SFTP password
            path: Path to the file(s) on the server
            
        Returns:
            IngestionResult with raw records
        """
        # TODO: Implement SFTP file retrieval
        # This would:
        # 1. Connect to SFTP server
        # 2. Download files from specified path
        # 3. Parse each file (CSV, Excel, etc.)
        # 4. Return aggregated raw records
        
        logger.info(f"SFTP ingestion requested for client {client_id}")
        
        return IngestionResult(
            success=True,
            records_ingested=0,
            records_failed=0,
            errors=["SFTP integration not yet implemented"],
            raw_records=[],
            duration_ms=0
        )
    
    def detect_csv_schema(self, sample_rows: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze sample rows to detect the schema and field types.
        
        Args:
            sample_rows: First N rows of the CSV
            
        Returns:
            Schema definition with field names and inferred types
        """
        if not sample_rows:
            return {"fields": []}
        
        fields = []
        first_row = sample_rows[0]
        
        for field_name, value in first_row.items():
            field_info = {
                "name": field_name,
                "type": self._infer_type(value),
                "nullable": any(row.get(field_name) in [None, ""] for row in sample_rows),
                "sample_values": [row.get(field_name) for row in sample_rows[:5]]
            }
            fields.append(field_info)
        
        return {"fields": fields, "row_count": len(sample_rows)}
    
    def _infer_type(self, value: Any) -> str:
        """Infer the data type of a value"""
        if value is None or value == "":
            return "unknown"
        
        value_str = str(value).strip()
        
        # Check for date patterns
        date_patterns = [
            r"\d{4}-\d{2}-\d{2}",  # ISO 8601
            r"\d{1,2}/\d{1,2}/\d{4}",  # MM/DD/YYYY
            r"\d{1,2}-\d{1,2}-\d{4}"  # MM-DD-YYYY
        ]
        import re
        for pattern in date_patterns:
            if re.match(pattern, value_str):
                return "date"
        
        # Check for number
        try:
            float(value_str.replace(",", "").replace("$", ""))
            return "number"
        except ValueError:
            pass
        
        # Check for boolean
        if value_str.lower() in ["true", "false", "yes", "no", "y", "n", "1", "0"]:
            return "boolean"
        
        return "string"


# Singleton instance
connector_agent = ConnectorAgent()
