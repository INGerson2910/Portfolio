import json
from typing import Any

from app.services.llama_client import LlamaClient
from app.services.prompt_builder import PromptBuilder


class CoverageExtractor:
    def __init__(self) -> None:
        self.client = LlamaClient()
        self.prompt_builder = PromptBuilder()

    def extract(self, requirement_text: str, generation_notes: str | None = None) -> dict[str, Any]:
        system_prompt, user_prompt = self.prompt_builder.build_coverage_prompt(
            requirement_text=requirement_text,
            generation_notes=generation_notes,
        )

        parsed = self.client.chat_json(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=800,
            temperature=0.1,
        )

        return self._normalize(parsed)

    @staticmethod
    def to_json_text(coverage: dict[str, Any]) -> str:
        return json.dumps(coverage, ensure_ascii=False, separators=(",", ":"))

    @staticmethod
    def _normalize(data: dict[str, Any]) -> dict[str, Any]:
        def normalize_list(value: Any) -> list[str]:
            if not isinstance(value, list):
                return []
            return [str(x).strip() for x in value if str(x).strip()]

        normalized = {
            "feature_name": str(data.get("feature_name", "")).strip(),
            "actors": normalize_list(data.get("actors", [])),
            "entry_points": normalize_list(data.get("entry_points", [])),
            "fields": normalize_list(data.get("fields", [])),
            "required_fields": normalize_list(data.get("required_fields", [])),
            "optional_fields": normalize_list(data.get("optional_fields", [])),
            "validations": normalize_list(data.get("validations", [])),
            "business_rules": normalize_list(data.get("business_rules", [])),
            "technical_rules": normalize_list(data.get("technical_rules", [])),
            "status_codes": normalize_list(data.get("status_codes", [])),
            "error_codes": normalize_list(data.get("error_codes", [])),
            "postconditions": normalize_list(data.get("postconditions", [])),
            "ui_outcomes": normalize_list(data.get("ui_outcomes", [])),
            "api_outcomes": normalize_list(data.get("api_outcomes", [])),
            "security_concerns": normalize_list(data.get("security_concerns", [])),
            "required_coverage": normalize_list(data.get("required_coverage", [])),
            "ambiguities": normalize_list(data.get("ambiguities", [])),
        }

        if not normalized["required_coverage"]:
            normalized["required_coverage"] = (
                normalized["validations"][:5]
                + normalized["business_rules"][:5]
                + normalized["technical_rules"][:5]
                + normalized["postconditions"][:5]
            )

        return normalized