from pydantic import BaseModel
from typing import Optional

class JobSearchInput(BaseModel):
    what: str
    page: int = 1
    country: str = "gb"
    salary_min: Optional[int] = None
    full_time: Optional[int] = None
    permanent: Optional[int] = None
    where: Optional[str] = "london"
    sort_by: Optional[str] = "date"

class OnlineJobsSearchInput(BaseModel):
    keyword: str
    skill_tags: Optional[str] = ""   # comma-separated tag codes from skills.csv
    gig: bool = True
    part_time: bool = True
    full_time: bool = True
    page: int = 1