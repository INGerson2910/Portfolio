from __future__ import annotations

import re

from app.api.schemas_generation import GenerationResponse
from app.core.config import settings


class TestcaseValidator:
    @staticmethod
    def validate(suite: GenerationResponse) -> list[str]:
        errors: list[str] = []

        cases = suite.test_cases
        if len(cases) < settings.min_test_cases:
            errors.append(
                f"Too few test cases were generated. Minimum expected: {settings.min_test_cases}. Actual: {len(cases)}."
            )

        expected_statuses = {"201", "400", "409"}
        found_statuses = set()

        has_api = False
        has_ui = False
        has_security = False

        for tc in cases:
            desc = tc.description.lower()
            steps = tc.steps.lower()
            data = tc.test_data.lower()
            expected = tc.expected_result.lower()

            for status in expected_statuses:
                if status in expected:
                    found_statuses.add(status)

            if tc.test_type == "API" or "/api/" in steps or "post request" in steps:
                has_api = True

            if tc.test_type == "UI" or "registration screen" in steps or "open the registration" in steps:
                has_ui = True

            if tc.test_type == "Security":
                has_security = True

            if not tc.pre_conditions.strip():
                errors.append(f"{tc.tc_id}: pre_conditions is empty.")

            if "successful" in desc or "valid data" in desc:
                if "shorterthan8" in data or "password=invalid" in data:
                    errors.append(f"{tc.tc_id}: success case contains clearly invalid password data.")

            if "duplicate email" in desc:
                if "shorterthan8" in data or "password=invalid" in data:
                    errors.append(f"{tc.tc_id}: duplicate-email case mixes duplicate-email with invalid password.")

            if "invalid email" in desc:
                if re.search(r"email\s*=\s*[\w\.-]+@[\w\.-]+\.\w+", data):
                    errors.append(f"{tc.tc_id}: invalid-email case appears to use a valid email value.")

            if "shorter than 8" in desc or "minimum policy" in desc or "invalid password length" in desc:
                if not TestcaseValidator._contains_short_password(data):
                    errors.append(f"{tc.tc_id}: short-password case does not contain a truly below-minimum password.")

        for required in expected_statuses:
            if required not in found_statuses:
                errors.append(f"Missing coverage for HTTP status {required}.")

        if not has_api:
            errors.append("No API test case detected in the suite.")

        if not has_ui:
            errors.append("No UI test case detected in the suite.")

        if not has_security:
            errors.append("No Security test case detected in the suite.")

        return errors

    @staticmethod
    def _contains_short_password(test_data: str) -> bool:
        match = re.search(r'password\s*=\s*([^\n\r]+)', test_data, re.IGNORECASE)
        if not match:
            json_match = re.search(r'"password"\s*:\s*"([^"]+)"', test_data, re.IGNORECASE)
            if not json_match:
                return False
            password_value = json_match.group(1).strip()
            return len(password_value) < 8

        password_value = match.group(1).strip()
        return len(password_value) < 8