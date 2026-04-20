import re

from app.api.schemas_generation import GenerationRequest, GenerationResponse
from app.core.config import settings
from app.services.prompt_builder import PromptBuilder
from app.services.llama_client import LlamaClient
from app.services.result_normalizer import ResultNormalizer


class GenerationService:
    def __init__(self) -> None:
        self.prompt_builder = PromptBuilder()
        self.llama_client = LlamaClient()

    def generate(self, request: GenerationRequest) -> GenerationResponse:
        text = request.requirement_text.strip()

        if len(text) > settings.max_input_chars:
            raise ValueError(
                f"Input exceeds maximum allowed size of {settings.max_input_chars} characters."
            )

        if not self._contains_acceptance_criteria(text):
            raise ValueError("No recognizable acceptance criteria were found in the document.")

        prompt = self.prompt_builder.build(
            requirement_text=text,
            generation_notes=request.generation_notes,
        )

        raw_response = self.llama_client.generate(prompt)
        return ResultNormalizer.normalize(raw_response)

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