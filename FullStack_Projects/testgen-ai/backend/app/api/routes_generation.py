from fastapi import APIRouter, HTTPException

from app.api.schemas_generation import GenerationRequest, GenerationResponse
from app.services.generation_service import GenerationService

router = APIRouter(prefix="/api/v1/generations", tags=["Generations"])

generation_service = GenerationService()


@router.post("", response_model=GenerationResponse)
def generate_test_cases(request: GenerationRequest) -> GenerationResponse:
    try:
        return generation_service.generate(request)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Generation failed: {exc}") from exc