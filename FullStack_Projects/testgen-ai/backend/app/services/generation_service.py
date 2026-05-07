import re

from app.api.schemas_generation import GenerationRequest, GenerationResponse, TestCaseRow
from app.core.config import settings
from app.services.coverage_extractor import CoverageExtractor
from app.services.llama_client import LlamaClient
from app.services.prompt_builder import PromptBuilder
from app.services.result_normalizer import ResultNormalizer


class GenerationService:
    def __init__(self) -> None:
        self.prompt_builder = PromptBuilder()
        self.llama_client = LlamaClient()
        self.coverage_extractor = CoverageExtractor()

    def generate(self, request: GenerationRequest) -> GenerationResponse:
        text = request.requirement_text.strip()

        if len(text) > settings.max_input_chars:
            raise ValueError(
                f"Input exceeds maximum allowed size of {settings.max_input_chars} characters."
            )

        if not self._contains_acceptance_criteria(text):
            raise ValueError("No recognizable acceptance criteria were found in the document.")

        coverage = self.coverage_extractor.extract(
            requirement_text=text,
            generation_notes=request.generation_notes,
        )
        coverage_json = self.coverage_extractor.to_json_text(coverage)

        batch_specs = [
            {
                "label": "Batch 1 - Positive and validation coverage",
                "instruction": (
                    "Generate 2 to 3 high-value cases only for: successful registration, "
                    "required field validation, password length validation, invalid email format."
                ),
                "max_tokens": 700,
            },
            {
                "label": "Batch 2 - Negative and API coverage",
                "instruction": (
                    "Generate 2 to 3 high-value cases only for: duplicate email handling, "
                    "API status code validation, response body validation, no user creation on failure."
                ),
                "max_tokens": 700,
            },
            {
                "label": "Batch 3 - UI and security coverage",
                "instruction": (
                    "Generate 2 to 3 high-value cases only for: UI validation feedback, redirect behavior, "
                    "JWT token presence, safe error handling, and no internal detail exposure."
                ),
                "max_tokens": 700,
            },
        ]

        partial_results: list[GenerationResponse] = []

        for batch in batch_specs:
            system_prompt, user_prompt = self.prompt_builder.build_testcase_prompt(
                requirement_text=text,
                coverage_json=coverage_json,
                generation_notes=self._merge_notes(request.generation_notes, batch["instruction"]),
            )

            raw_response = self.llama_client.chat_text(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                max_tokens=batch["max_tokens"],
                temperature=0.1,
            )

            partial_results.append(ResultNormalizer.normalize(raw_response))

        merged = self._merge_generation_results(partial_results)
        merged = self._resequence_tc_ids(merged)

        return merged

    @staticmethod
    def _contains_acceptance_criteria(text: str) -> bool:
        patterns = [
            r"acceptance criteria",
            r"\bAC\b",
            r"\bgiven\b.*\bwhen\b.*\bthen\b",
            r"\bscenario\b",
            r"\bcriteria\b",
        ]
        lowered = text.lower()
        return any(re.search(pattern, lowered, re.DOTALL) for pattern in patterns)

    @staticmethod
    def _merge_notes(base_notes: str | None, batch_instruction: str) -> str:
        base = (base_notes or "").strip()
        if base:
            return f"{base}\n\n{batch_instruction}"
        return batch_instruction

    @staticmethod
    def _merge_generation_results(results: list[GenerationResponse]) -> GenerationResponse:
        if not results:
            raise ValueError("No generation results were produced.")

        feature_name = results[0].feature_name
        test_plan_summary = results[0].test_plan_summary

        assumptions: list[str] = []
        coverage_areas: list[str] = []
        warnings: list[str] = []
        test_cases: list[TestCaseRow] = []

        seen_case_keys: set[str] = set()

        for result in results:
            for item in result.assumptions:
                if item not in assumptions:
                    assumptions.append(item)

            for item in result.coverage_areas:
                if item not in coverage_areas:
                    coverage_areas.append(item)

            for item in result.warnings:
                if item not in warnings:
                    warnings.append(item)

            for tc in result.test_cases:
                case_key = (
                    tc.test_type.strip().lower(),
                    tc.description.strip().lower(),
                    tc.expected_result.strip().lower(),
                )
                if case_key not in seen_case_keys:
                    seen_case_keys.add(case_key)
                    test_cases.append(tc)

        return GenerationResponse(
            feature_name=feature_name,
            test_plan_summary=test_plan_summary,
            assumptions=assumptions,
            coverage_areas=coverage_areas,
            warnings=warnings,
            test_cases=test_cases,
        )

    @staticmethod
    def _resequence_tc_ids(result: GenerationResponse) -> GenerationResponse:
        resequenced_cases: list[TestCaseRow] = []

        for index, tc in enumerate(result.test_cases, start=1):
            resequenced_cases.append(
                TestCaseRow(
                    tc_id=f"TC-{index:03d}",
                    test_type=tc.test_type,
                    description=tc.description,
                    steps=tc.steps,
                    test_data_format=tc.test_data_format,
                    test_data=tc.test_data,
                    expected_result=tc.expected_result,
                    pre_conditions=tc.pre_conditions,
                    automatable=tc.automatable,
                    pass_field=tc.pass_field,
                    actual_result=tc.actual_result,
                )
            )

        return GenerationResponse(
            feature_name=result.feature_name,
            test_plan_summary=result.test_plan_summary,
            assumptions=result.assumptions,
            coverage_areas=result.coverage_areas,
            warnings=result.warnings,
            test_cases=resequenced_cases,
        )