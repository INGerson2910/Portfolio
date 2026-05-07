import json
import re
from pathlib import Path
from typing import Any

import requests

from app.core.config import settings


class LlamaClient:
    def __init__(self) -> None:
        self.base_url = settings.llm_base_url.rstrip("/")
        self.model = settings.llm_model
        self.timeout = settings.llm_timeout_seconds
        self.max_tokens = settings.llm_max_tokens
        self.temperature = settings.llm_temperature
        self.debug_dir = Path("debug_llm")
        self.debug_dir.mkdir(exist_ok=True)

    def chat_json(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> dict[str, Any]:
        raw = self.chat_text(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return self._safe_json_loads(raw)

    def chat_text(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> str:
        url = f"{self.base_url}/v1/chat/completions"

        payload: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": self.temperature if temperature is None else temperature,
            "max_tokens": self.max_tokens if max_tokens is None else max_tokens,
            "stream": False,
            "chat_template_kwargs": {
                "enable_thinking": False
            }
        }

        self._write_debug("last_request.json", json.dumps(payload, ensure_ascii=False, indent=2))

        response = requests.post(url, json=payload, timeout=self.timeout)
        response.raise_for_status()

        data = response.json()
        self._write_debug("last_response.json", json.dumps(data, ensure_ascii=False, indent=2))

        try:
            message = data["choices"][0]["message"]
        except (KeyError, IndexError, TypeError) as exc:
            raise ValueError(f"Unexpected LLM response structure: {data}") from exc

        content = str(message.get("content") or "").strip()
        reasoning_content = str(message.get("reasoning_content") or "").strip()

        self._write_debug("last_content.txt", content)
        self._write_debug("last_reasoning_content.txt", reasoning_content)

        if not content:
            raise ValueError(
                "Model returned empty content. Check debug_llm/last_response.json."
            )

        content = self._strip_think_blocks(content)
        return content.strip()

    @staticmethod
    def _strip_think_blocks(text: str) -> str:
        text = text.lstrip("\ufeff").strip()
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE).strip()
        return text

    @staticmethod
    def _safe_json_loads(raw: str) -> dict[str, Any]:
        raw = raw.strip()

        if raw.startswith("{") and raw.endswith("}"):
            return json.loads(raw)

        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(raw[start:end + 1])

        raise ValueError(f"Model response is not valid JSON. Raw response:\n{raw}")

    def _write_debug(self, filename: str, content: str) -> None:
        path = self.debug_dir / filename
        path.write_text(content, encoding="utf-8")