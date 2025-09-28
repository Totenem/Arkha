from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    id: int | None = None
    first_name: str
    last_name: str
    is_premium: bool
    email: str
    password: str
    created_at: datetime
    updated_at: datetime
