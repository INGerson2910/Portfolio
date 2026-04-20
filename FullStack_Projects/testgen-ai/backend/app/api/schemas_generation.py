from typing import List, Optional
from pydantic import BaseModel, Field


class GenerationRequest(BaseModel):
    requirement_text: str = Field(..., min_length=20)
    prompt_preset: Optional[str] = Field(default="standard_exhaustive")
    generation_notes: Optional[str] = None


class TestCaseRow(BaseModel):
    tc_id: str
    test_type: str
    description: str
    steps: str
    test_data_format: str
    test_data: str
    expected_result: str
    pre_conditions: str
    automatable: str
    pass_field: str = ""
    actual_result: str = ""


class GenerationResponse(BaseModel):
    feature_name: str
    test_plan_summary: str
    assumptions: List[str]
    coverage_areas: List[str]
    warnings: List[str]
    test_cases: List[TestCaseRow]