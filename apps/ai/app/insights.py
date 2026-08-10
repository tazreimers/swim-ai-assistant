import json
import os
from typing import Any

import httpx
from pydantic import BaseModel, Field

PROMPT_VERSION = "swim-insights-v1"


class RepInput(BaseModel):
    main_set_id: str
    rep_number: int
    time_ms: int = Field(gt=0)


class AthleteInput(BaseModel):
    athlete_id: str
    status: str
    reps: list[RepInput]


class MainSetInput(BaseModel):
    id: str
    position: int
    stroke: str | None = None
    distance_meters: int | None = None
    repetitions: int


class SessionInput(BaseModel):
    id: str
    title: str | None = None
    session_type: str | None = None
    scheduled_date: str
    main_sets: list[MainSetInput]


class InsightRequest(BaseModel):
    prompt_version: str = PROMPT_VERSION
    session: SessionInput
    athletes: list[AthleteInput]


class InsightResponse(BaseModel):
    model: str
    result: dict[str, Any]


def _facts(request: InsightRequest) -> dict[str, Any]:
    completed = [athlete for athlete in request.athletes if athlete.status == "COMPLETED"]
    averages = [
        sum(rep.time_ms for rep in athlete.reps) / len(athlete.reps)
        for athlete in completed
        if athlete.reps
    ]
    drop_offs = [
        athlete.reps[-1].time_ms - athlete.reps[0].time_ms
        for athlete in completed
        if len(athlete.reps) > 1
    ]
    return {
        "completed_swimmers": len(completed),
        "athletes_in_input": len(request.athletes),
        "average_time_ms": round(sum(averages) / len(averages)) if averages else None,
        "personal_best_count": 0,
        "significant_fade_count": sum(1 for value in drop_offs if value > 1000),
        "missing_data": not bool(completed),
    }


def _mock_result(request: InsightRequest) -> dict[str, Any]:
    facts = _facts(request)
    return {
        "facts": facts,
        "session_summary": (
            f"{facts['completed_swimmers']} swimmers completed the session. "
            "Review the rep-level trend before making coaching changes."
        ),
        "coach_summary": {
            "most_improved_athlete_id": None,
            "largest_pace_dropoff_athlete_id": None,
            "recommendations": [
                "Compare the final repetitions with the opening repetitions.",
                "Use the next comparable session to confirm whether the trend persists.",
            ],
        },
        "athlete_feedback": [
            {
                "athlete_id": athlete.athlete_id,
                "strengths": ["You recorded a complete set of results."],
                "comparison": "No prior comparable baseline was supplied.",
                "recommendations": ["Aim to keep the final repetitions close to your opening pace."],
                "uncertainty": "This feedback is limited when prior comparable sessions are unavailable.",
            }
            for athlete in request.athletes
        ],
    }


def _system_prompt() -> str:
    return (
        "You are a swimming coach assistant. Return only valid JSON. "
        "Use computed facts exactly; never invent times, attendance, causes, diagnoses, "
        "or personal bests. Separate facts from interpretation and state uncertainty "
        "when data is incomplete. Give concise, practical recommendations."
    )


async def generate_insights(request: InsightRequest) -> InsightResponse:
    if os.getenv("AI_MODE", "openai") == "mock":
        return InsightResponse(model="mock", result=_mock_result(request))

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    payload = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": _system_prompt()},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "prompt_version": request.prompt_version,
                        "session": request.session.model_dump(),
                        "athletes": [athlete.model_dump() for athlete in request.athletes],
                        "computed_facts": _facts(request),
                        "required_keys": [
                            "facts",
                            "session_summary",
                            "coach_summary",
                            "athlete_feedback",
                        ],
                    }
                ),
            },
        ],
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        return InsightResponse(model=model, result=json.loads(content))
