"""MeetCloud backend API entry point.

This initial service intentionally exposes only health/readiness metadata.
Protected product endpoints will be added after auth and schema contracts are defined.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MeetCloud API",
    version="0.1.0",
    description="Shared API for the native MeetCloud Android and iOS clients.",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
)

# Production origins must be configured explicitly before deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Liveness endpoint; contains no secrets or infrastructure details."""
    return {"status": "ok", "service": "meetcloud-api", "version": "0.1.0"}


@app.get("/api/v1/health", tags=["health"])
def api_health() -> dict[str, str]:
    """Versioned health endpoint used by mobile smoke tests."""
    return {"status": "ok", "api_version": "v1"}
