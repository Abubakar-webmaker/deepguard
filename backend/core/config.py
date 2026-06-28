from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "deepguard"
    SECRET_KEY: str = "changeme"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    HIVE_API_KEY: str = ""
    SAPLING_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()