from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    TMDB_API_KEY: str
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE_URL: str = "https://image.tmdb.org/t/p/w500"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    JWT_SECRET: str = "changeme"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_SECONDS: int = 60 * 60 * 24  

    model_config = SettingsConfigDict(env_file=".env")


def get_settings() -> Settings:
    return Settings()
