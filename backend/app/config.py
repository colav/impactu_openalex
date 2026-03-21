from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "openalexco"
    APP_TITLE: str = "ImpactU OpenAlexCO"
    APP_VERSION: str = "1.0.0"

    # Comma-separated "key:Label" pairs, e.g.:
    # "openalexco:OpenAlex Colombia,openalex:OpenAlex Full"
    AVAILABLE_DBS: str = "openalexco:OpenAlex Colombia,openalex:OpenAlex Full"

    def databases(self) -> dict[str, str]:
        """Parse AVAILABLE_DBS into a {key: label} dict."""
        result: dict[str, str] = {}
        for entry in self.AVAILABLE_DBS.split(","):
            parts = entry.split(":", 1)
            if len(parts) == 2:
                result[parts[0].strip()] = parts[1].strip()
        return result or {self.MONGO_DB: self.MONGO_DB}

    class Config:
        env_file = ".env"


settings = Settings()
