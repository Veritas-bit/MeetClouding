# MeetCloud API

Initial FastAPI foundation for the native Android and iOS clients. At this stage it contains health endpoints only; no production authentication, database, user data or cloud endpoints are implemented yet.

## Local run

```bash
python -m venv .venv
# Activate the virtual environment, then:
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Liveness: `GET /health`
- Versioned health: `GET /api/v1/health`
- Local API docs: `/api/v1/docs`

Run tests from this directory with `pytest`.

Before deployment: configure explicit CORS origins, authentication/token validation, database migrations, structured redacted logging, rate limits and deployment secrets. Do not expose the development server directly to the public internet.
