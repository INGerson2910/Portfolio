from typing import List
from pydantic import BaseModel

from app.api.schemas_generation import TestCaseRow


class ExportWorkbookRequest(BaseModel):
    feature_name: str
    test_plan_summary: str
    assumptions: List[str]
    coverage_areas: List[str]
    warnings: List[str]
    test_cases: List[TestCaseRow]