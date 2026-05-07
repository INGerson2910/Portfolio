import json
import re
from typing import Any

from app.api.schemas_generation import GenerationResponse, TestCaseRow


class ResultNormalizer:
    @staticmethod
    def normalize(raw_response: str) -> GenerationResponse:
        cleaned = ResultNormalizer._extract_json(raw_response)

        try:
            parsed: dict[str, Any] = json.loads(cleaned)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"Model response is not valid JSON. Raw response:\n{raw_response}"
            ) from exc

        normalized_cases: list[TestCaseRow] = []

        for index, item in enumerate(parsed.get("test_cases", []), start=1):
            description = str(item.get("description", "")).strip()
            steps = str(item.get("steps", "")).strip()
            raw_test_data = str(item.get("test_data", "")).strip()

            normalized_cases.append(
                TestCaseRow(
                    tc_id=str(item.get("tc_id", "")).strip() or f"TC-{index:03d}",
                    test_type=ResultNormalizer._normalize_test_type(item.get("test_type", "")),
                    description=description,
                    steps=ResultNormalizer._normalize_steps(steps, description),
                    test_data_format=ResultNormalizer._normalize_test_data_format(
                        raw_value=item.get("test_data_format", ""),
                        description=description,
                        steps=steps,
                        test_data=raw_test_data,
                    ),
                    test_data=ResultNormalizer._normalize_test_data(
                        raw_value=raw_test_data,
                        data_format=str(item.get("test_data_format", "")).strip().lower(),
                    ),
                    expected_result=str(item.get("expected_result", "")).strip(),
                    pre_conditions=str(item.get("pre_conditions", "")).strip(),
                    automatable=ResultNormalizer._normalize_automatable(item.get("automatable", "yes")),
                    pass_field=str(item.get("pass_field", "")).strip(),
                    actual_result=str(item.get("actual_result", "")).strip(),
                )
            )

        if not normalized_cases:
            raise ValueError(
                f"No generated test cases were returned by the model. Raw response:\n{raw_response}"
            )

        return GenerationResponse(
            feature_name=str(parsed.get("feature_name", "")).strip() or "Unnamed Feature",
            test_plan_summary=str(parsed.get("test_plan_summary", "")).strip(),
            assumptions=[str(x).strip() for x in parsed.get("assumptions", []) if str(x).strip()],
            coverage_areas=[str(x).strip() for x in parsed.get("coverage_areas", []) if str(x).strip()],
            warnings=[str(x).strip() for x in parsed.get("warnings", []) if str(x).strip()],
            test_cases=normalized_cases,
        )

    @staticmethod
    def _extract_json(raw_response: str) -> str:
        if raw_response is None:
            raise ValueError("Model response is empty (None).")

        text = raw_response.strip()
        if not text:
            raise ValueError("Model response is empty.")

        text = text.lstrip("\ufeff")
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE).strip()
        text = text.replace("```json", "```")
        text = re.sub(r"```+", "", text).strip()

        if text.startswith("{") and text.endswith("}"):
            return text

        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            candidate = text[start:end + 1].strip()
            json.loads(candidate)
            return candidate

        if "{" in text and "}" not in text:
            raise ValueError(
                f"Model returned a truncated JSON object. Increase max_tokens or reduce output size. Raw response:\n{raw_response}"
            )

        raise ValueError(
            f"No JSON object could be extracted from the model response. Raw response:\n{raw_response}"
        )

    @staticmethod
    def _normalize_test_type(raw_value: str) -> str:
        allowed_types = [
            "Functional",
            "Negative",
            "Boundary",
            "Security",
            "Integration",
            "API",
            "UI",
            "Performance",
            "Validation",
        ]

        value = str(raw_value).strip()
        if not value:
            return "Functional"

        for allowed in allowed_types:
            if allowed.lower() == value.lower():
                return allowed

        for allowed in allowed_types:
            if allowed.lower() in value.lower():
                return allowed

        return "Functional"

    @staticmethod
    def _normalize_automatable(raw_value: Any) -> str:
        value = str(raw_value).strip().lower()
        return "yes" if value in {"yes", "true", "y", "1"} else "no"

    @staticmethod
    def _normalize_test_data_format(raw_value: Any, description: str, steps: str, test_data: Any) -> str:
        allowed_formats = [
            "json_body",
            "query_params",
            "path_params",
            "headers",
            "form_fields",
            "ui_selection",
            "mixed",
            "none",
        ]

        value = str(raw_value).strip().lower()
        if value in allowed_formats:
            return value

        combined = f"{description} {steps} {test_data}".lower()

        if "authorization" in combined or "jwt" in combined or "token" in combined:
            if "body" in combined or "payload" in combined or "json" in combined:
                return "mixed"
            return "headers"

        if "/api/" in combined or "post request" in combined or "payload" in combined or "request body" in combined:
            return "json_body"

        if "registration screen" in combined or "enter" in combined or "fill" in combined:
            return "form_fields"

        return "form_fields"

    @staticmethod
    def _normalize_test_data(raw_value: Any, data_format: str) -> str:
        value = str(raw_value).strip()
        if data_format == "none":
            return "No input data required. Preconditions define the state."
        return value

    @staticmethod
    def _normalize_steps(steps: str, description: str) -> str:
        value = steps.strip()
        lowered = value.lower()

        if not value or "step one" in lowered or "step two" in lowered:
            return (
                f"1. Prepare the required state for: {description}\n"
                "2. Execute the main action for the scenario\n"
                "3. Observe the system response\n"
                "4. Verify the expected result"
            )

        return value