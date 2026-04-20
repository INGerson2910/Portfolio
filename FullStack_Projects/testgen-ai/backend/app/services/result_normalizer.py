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
                f"Model response is not valid JSON: {exc}\nRaw response: {raw_response}"
            ) from exc

        normalized_cases = []
        for item in parsed.get("test_cases", []):
            description = str(item.get("description", "")).strip()
            steps = str(item.get("steps", "")).strip()

            normalized_format = ResultNormalizer._normalize_test_data_format(
                raw_value=item.get("test_data_format", ""),
                description=description,
                steps=steps,
                test_data=item.get("test_data", ""),
            )

            normalized_test_data = ResultNormalizer._normalize_test_data(
                raw_value=item.get("test_data", ""),
                description=description,
                steps=steps,
                data_format=normalized_format,
            )

            normalized_cases.append(
                TestCaseRow(
                    tc_id=str(item.get("tc_id", "")).strip() or "TC-UNKNOWN",
                    test_type=ResultNormalizer._normalize_test_type(item.get("test_type", "")),
                    description=description,
                    steps=ResultNormalizer._normalize_steps(steps, description),
                    test_data_format=normalized_format,
                    test_data=normalized_test_data,
                    expected_result=str(item.get("expected_result", "")).strip(),
                    pre_conditions=str(item.get("pre_conditions", "")).strip(),
                    automatable=str(item.get("automatable", "no")).strip().lower(),
                    pass_field=str(item.get("pass_field", "")).strip(),
                    actual_result=str(item.get("actual_result", "")).strip(),
                )
            )

        if not normalized_cases:
            raise ValueError("No generated test cases were returned by the model.")

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
        raw_response = raw_response.strip()

        if raw_response.startswith("{") and raw_response.endswith("}"):
            return raw_response

        match = re.search(r"\{.*\}", raw_response, re.DOTALL)
        if match:
            return match.group(0)

        raise ValueError("No JSON object could be extracted from the model response.")

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

        parts = [part.strip() for part in re.split(r"[|,/;]+", value) if part.strip()]

        for part in parts:
            for allowed in allowed_types:
                if part.lower() == allowed.lower():
                    return allowed

        for allowed in allowed_types:
            if allowed.lower() in value.lower():
                return allowed

        return "Functional"

    @staticmethod
    def _normalize_test_data_format(
        raw_value: Any,
        description: str,
        steps: str,
        test_data: Any,
    ) -> str:
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

        if value:
            parts = [part.strip() for part in re.split(r"[|,/;]+", value) if part.strip()]
            for part in parts:
                for allowed in allowed_formats:
                    if part == allowed.lower():
                        return allowed

        combined = f"{description} {steps} {test_data}".lower()

        if "authorization" in combined or "jwt" in combined or "token" in combined:
            if "body" in combined or "payload" in combined or "json" in combined:
                return "mixed"
            return "headers"

        if re.search(r"\bpost\b|\bput\b|\bpatch\b|\brequest body\b|\bpayload\b|\bjson\b", combined):
            return "json_body"

        if re.search(r"\bquery\b|\bfilter\b|\bsort\b|\bsearch\b|\bget\b", combined):
            return "query_params"

        if re.search(r"\bpath param\b|\bpath parameter\b|\bresource id\b|\bid in url\b", combined):
            return "path_params"

        if re.search(r"\bform\b|\benter\b|\bfill\b|\binput\b", combined):
            return "form_fields"

        if re.search(r"\bselect\b|\bdropdown\b|\bcombobox\b|\bcheckbox\b|\bradio\b", combined):
            return "ui_selection"

        if re.search(r"\bno input\b|\bbackground refresh\b|\bscheduled\b", combined):
            return "none"

        return "form_fields"

    @staticmethod
    def _normalize_test_data(
        raw_value: Any,
        description: str,
        steps: str,
        data_format: str,
    ) -> str:
        value = str(raw_value).strip()

        banned_values = {
            "",
            "n/a",
            "na",
            "none",
            "null",
            "valid data",
            "invalid data",
            "sample data",
            "dummy data",
            "test data",
        }

        if value.lower() in banned_values or len(value) < 8:
            return ResultNormalizer._build_fallback_test_data(description, steps, data_format)

        if data_format == "none":
            return "No input data required. Preconditions define the state."

        return value

    @staticmethod
    def _normalize_steps(steps: str, description: str) -> str:
        value = steps.strip()
        lowered = value.lower()

        if "step one" in lowered or "step two" in lowered or value in {"", "1. step one\n2. step two"}:
            return (
                f"1. Prepare the required state for: {description}\n"
                f"2. Execute the main action for the scenario\n"
                f"3. Observe the system response\n"
                f"4. Verify the expected result"
            )

        return value

    @staticmethod
    def _build_fallback_test_data(description: str, steps: str, data_format: str) -> str:
        text = f"{description} {steps}".lower()

        if data_format == "none":
            return "No input data required. Preconditions define the state."

        if data_format == "headers":
            if "expired" in text:
                return "Authorization: Bearer expired.jwt.token"
            if "invalid" in text or "malformed" in text:
                return "Authorization: Bearer invalid.jwt.token"
            if "missing" in text:
                return "Authorization header omitted"
            return "Authorization: Bearer valid.jwt.token"

        if data_format == "json_body":
            if "phone" in text and "name" in text:
                if "invalid" in text and "phone" in text:
                    return '{\n  "name": "John Doe",\n  "phone_number": "123456789"\n}'
                if "empty" in text:
                    return '{\n  "name": "",\n  "phone_number": ""\n}'
                return '{\n  "name": "John Doe",\n  "phone_number": "+1234567890"\n}'
            if "rate" in text or "price" in text:
                if "invalid" in text:
                    return '{\n  "min_rate": -100,\n  "max_rate": 200\n}'
                if "boundary" in text:
                    return '{\n  "min_rate": 0,\n  "max_rate": 200\n}'
                return '{\n  "min_rate": 100,\n  "max_rate": 200\n}'
            return '{\n  "sample_field": "sample_value"\n}'

        if data_format == "query_params":
            if "city" in text:
                if "invalid" in text:
                    return "city=invalid-city-name"
                if "empty" in text:
                    return "city="
                return "city=Mexico City"
            if "rate" in text or "price" in text or "sort" in text:
                if "invalid" in text:
                    return "sort=price_asc\nminRate=-100\nmaxRate=200"
                if "boundary" in text:
                    return "sort=price_asc\nminRate=0\nmaxRate=200"
                return "sort=price_asc\nminRate=100\nmaxRate=200"
            return "param1=value1"

        if data_format == "path_params":
            if "invalid" in text and "id" in text:
                return "userId=invalid-id"
            return "userId=12345"

        if data_format == "form_fields":
            if "login" in text:
                if "invalid" in text:
                    return "username=valid_user@example.com\npassword=WrongPass123!"
                return "username=valid_user@example.com\npassword=ValidPass123!"
            if "phone" in text and "name" in text:
                if "invalid" in text and "phone" in text:
                    return "name=John Doe\nphone_number=123456789"
                if "empty" in text:
                    return "name=\nphone_number="
                return "name=John Doe\nphone_number=+1234567890"
            return "field1=value1\nfield2=value2"

        if data_format == "ui_selection":
            if "sort" in text or "price" in text:
                return "Sort option=Lowest price\nMin rate=100\nMax rate=200"
            if "destination" in text or "city" in text:
                return "Destination=Mexico City"
            return "Selection=Default option"

        if data_format == "mixed":
            if "jwt" in text or "token" in text:
                return (
                    "Headers:\nAuthorization: Bearer valid.jwt.token\n\n"
                    'Body:\n{\n  "name": "John Doe",\n  "phone_number": "+1234567890"\n}'
                )
            return "Headers:\nHeader1=value1\n\nBody:\n{\n  \"sample_field\": \"sample_value\"\n}"

        return "Execute with realistic input values derived from the requirement."