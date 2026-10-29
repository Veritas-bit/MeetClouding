# Run with backend/ as the working directory.
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_does_not_expose_secrets() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "meetcloud-api",
        "version": "0.1.0",
    }


def test_versioned_health() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["api_version"] == "v1"
