from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./inventory.db"
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    # SECRET_KEY can be overridden via the SECRET_KEY environment variable.
    # This default is a randomly generated key - override in production via env var.
    SECRET_KEY: str = "2946173655a1cb3543471bb9159750d6c65dc8f14ade7de752eaec9483bf14a9"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@inventorysystem.com"
    # Frontend URL for password reset emails - MUST match your Vercel deployment URL
    FRONTEND_URL: str = "https://inventory-management-system-8d9e.vercel.app"

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
