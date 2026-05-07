from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TestGen AI API"
    app_version: str = "0.1.0"
    app_env: str = "local"
    app_port: int = 8000

    llm_base_url: str = "http://127.0.0.1:8080"
    llm_model: str = "Qwen_Qwen3.5-4B-Q4_K_M.gguf"
    llm_timeout_seconds: int = 300
    llm_max_tokens: int = 4096
    llm_temperature: float = 0.15

    max_input_chars: int = 50000
    min_test_cases: int = 12

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()