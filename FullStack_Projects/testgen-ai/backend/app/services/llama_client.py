import requests
from app.core.config import settings


class LlamaClient:
    def __init__(self) -> None:
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model

    def generate(self, prompt: str) -> str:
        url = f"{self.base_url}/api/generate"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1,
                "num_predict": 1200
            }
        }

        response = requests.post(url, json=payload, timeout=180)
        response.raise_for_status()

        data = response.json()
        return data.get("response", "").strip()