from fastapi.testclient import TestClient

from main import app


def test_health_is_ready_in_mock_mode(monkeypatch):
    monkeypatch.setenv("AI_MODE", "mock")
    monkeypatch.setenv("ENVIRONMENT", "test")

    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "swim-ai-api"}


def test_health_reports_unconfigured_provider(monkeypatch):
    monkeypatch.setenv("AI_MODE", "openai")
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    response = TestClient(app).get("/health")

    assert response.status_code == 503


def test_insights_rejects_invalid_service_token(monkeypatch):
    monkeypatch.setenv("AI_SERVICE_TOKEN", "test-token")

    payload = {
        "session": {
            "id": "session-1",
            "title": "Test",
            "session_type": "main",
            "scheduled_date": "2026-08-27T00:00:00Z",
            "main_sets": [],
        },
        "athletes": [],
    }
    response = TestClient(app).post(
        "/insights",
        headers={"Authorization": "Bearer " + "wrong"},
        json=payload,
    )

    assert response.status_code == 401
