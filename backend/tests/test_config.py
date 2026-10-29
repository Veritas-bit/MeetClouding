from app.core.config import Settings


def test_settings_have_local_safe_defaults() -> None:
    settings = Settings(_env_file=None)
    assert settings.environment == "development"
    assert settings.api_base_url == "http://localhost:8000"
    assert settings.log_level == "INFO"
