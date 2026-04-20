from datetime import datetime
from io import BytesIO
import re

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.api.schemas_export import ExportWorkbookRequest
from app.services.export_service import ExportService

router = APIRouter(prefix="/api/v1/generations/export", tags=["Exports"])

export_service = ExportService()


@router.post("")
def export_workbook(request: ExportWorkbookRequest) -> StreamingResponse:
    workbook_bytes = export_service.build_workbook(request)

    safe_feature_name = _sanitize_filename(request.feature_name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{safe_feature_name}_{timestamp}.xlsx"

    return StreamingResponse(
        BytesIO(workbook_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


def _sanitize_filename(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_-]+", "_", value.strip())
    return cleaned[:80] or "testgen_export"