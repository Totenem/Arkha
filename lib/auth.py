from fastapi import HTTPException, Request
from supabase import create_client, Client
from datetime import datetime
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

MONTHLY_LIMIT = 20

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in to use this feature.")

    token = auth_header.removeprefix("Bearer ").strip()

    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            raise HTTPException(status_code=401, detail="Invalid or expired session. Please log in again.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired session. Please log in again.")

    return {"user_id": str(user.id)}


async def check_and_log_usage(endpoint: str, user: dict):
    user_id = user["user_id"]

    now = datetime.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()

    try:
        result = (
            supabase.table("usage_logs")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .eq("endpoint", endpoint)
            .gte("created_at", month_start)
            .execute()
        )
        used = result.count or 0
    except Exception:
        used = 0

    if used >= MONTHLY_LIMIT:
        next_reset = (now.replace(day=1, month=now.month % 12 + 1) if now.month < 12
                      else now.replace(day=1, month=1, year=now.year + 1))
        raise HTTPException(
            status_code=429,
            detail=f"You've used all {MONTHLY_LIMIT} free credits this month. Resets on {next_reset.strftime('%B 1')}.",
        )

    try:
        supabase.table("usage_logs").insert({
            "user_id": user_id,
            "endpoint": endpoint,
        }).execute()
    except Exception:
        pass  # don't fail the request if logging fails
