from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TestGen AI API"
    app_version: str = "0.1.0"
    app_env: str = "local"
    app_port: int = 8000

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"

    max_input_chars: int = 50000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()