from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./inventory.db"
    CORS_ORIGINS: Union[List[str], str] = ["*"]

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def parse_database_url(cls, v):
        # If the env var is set but empty, fallback to sqlite
        if not v or not str(v).strip():
            return "sqlite:///./inventory.db"
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            # Try parsing as JSON array
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
            # Try parsing as comma-separated list
            if "," in v:
                return [x.strip() for x in v.split(",") if x.strip()]
            # Single value
            return [v.strip()]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
