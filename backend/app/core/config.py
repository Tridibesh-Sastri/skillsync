from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # PostgreSQL Configuration
    DATABASE_URL: str
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-change-in-production-minimum-32-characters"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Neo4j Configuration (NEW)
    NEO4J_URI: str
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str
    
    class Config:
        env_file = ".env"

settings = Settings()
