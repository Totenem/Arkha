import re
import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException
from models.input import OnlineJobsSearchInput
from typing import Optional

BASE_URL = "https://www.onlinejobs.ph"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


def _extract_job_id(href: str) -> Optional[str]:
    # "See More" pattern: /jobseekers/job/1234567
    m = re.search(r"/jobseekers/job/(\d+)$", href)
    if m:
        return m.group(1)
    # Slug pattern: /jobseekers/job/Some-Title-1234567
    m = re.search(r"-(\d+)$", href)
    if m:
        return m.group(1)
    return None


def _parse_card(anchor) -> Optional[dict]:
    href = anchor.get("href", "")
    job_id = _extract_job_id(href)
    url = BASE_URL + href if href.startswith("/") else href

    card = anchor.find("div", class_="jobpost-cat-box")
    if not card:
        return None

    # Title + job type badge
    h4 = card.find("h4", class_=re.compile(r"fs-16"))
    title, job_type = "", ""
    if h4:
        badge = h4.find("span", class_="badge")
        if badge:
            job_type = badge.get_text(strip=True)
            badge.decompose()
        title = h4.get_text(" ", strip=True)

    # Posted date
    em = card.find("em")
    posted_at = ""
    if em:
        posted_at = em.get_text(strip=True).replace("Posted on", "").strip()

    # Salary — first <dd class="col"> inside the card
    salary_dd = card.find("dd", class_="col")
    salary = salary_dd.get_text(strip=True) if salary_dd else ""

    # Description (drop the trailing "See More" anchor)
    desc_div = card.find("div", class_="desc")
    description = ""
    if desc_div:
        see_more = desc_div.find("a")
        if see_more:
            see_more.decompose()
        description = desc_div.get_text(" ", strip=True)

    # Skills
    tag_div = card.find("div", class_="job-tag")
    skills = []
    if tag_div:
        for a in tag_div.find_all("a", class_="badge"):
            s = a.get_text(strip=True)
            if s:
                skills.append(s)

    # Employer logo (optional)
    logo_img = card.find("img", class_="jobpost-cat-box-logo")
    company_logo = logo_img.get("src", "") if logo_img else ""

    return {
        "job_id": job_id,
        "title": title,
        "job_type": job_type,
        "posted_at": posted_at,
        "salary": salary,
        "description": description,
        "skills": skills,
        "url": url,
        "company_logo": company_logo,
    }


async def search_onlinejobsph(search_data: OnlineJobsSearchInput) -> dict:
    try:
        offset = (search_data.page - 1) * 30
        offset_path = f"/{offset}" if offset > 0 else ""

        params: dict = {
            "jobkeyword": search_data.keyword,
            "skill_tags": search_data.skill_tags or "",
            "isFromJobsearchForm": "1",
        }
        if search_data.gig:
            params["gig"] = "on"
        if search_data.part_time:
            params["partTime"] = "on"
        if search_data.full_time:
            params["fullTime"] = "on"

        url = f"{BASE_URL}/jobseekers/jobsearch{offset_path}"
        response = requests.get(url, params=params, headers=_HEADERS, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Only top-level job card anchors (not "See More" links inside cards)
        anchors = [
            a for a in soup.find_all("a", href=re.compile(r"/jobseekers/job/"))
            if a.get("target") != "_blank" and a.find("div", class_="jobpost-cat-box")
        ]

        jobs = [j for a in anchors if (j := _parse_card(a))]

        # Total result count is embedded in the GTM dataLayer script
        total = None
        for script in soup.find_all("script"):
            if script.string and "search_result_count" in script.string:
                m = re.search(r'"search_result_count":(\d+)', script.string)
                if m:
                    total = int(m.group(1))
                    break

        return {"jobs": jobs, "total": total, "page": search_data.page, "per_page": 30}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch from OnlineJobs.ph: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


async def get_onlinejobsph_job(job_id: str) -> dict:
    try:
        url = f"{BASE_URL}/jobseekers/job/{job_id}"
        response = requests.get(url, headers=_HEADERS, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Title
        title_el = soup.find("h1", class_="job__title")
        title = title_el.get_text(strip=True) if title_el else ""

        # Metadata — four col-lg-3 blocks inside .job-post, each has a p.fs-18
        meta_cols = soup.select(".job-post .card-body [class*='col-lg-3']")
        def _meta(idx: int) -> str:
            if idx >= len(meta_cols):
                return ""
            p = meta_cols[idx].find("p", class_="fs-18")
            return p.get_text(strip=True) if p else ""

        job_type      = _meta(0)
        salary        = _meta(1)
        hours_per_week = _meta(2)
        date_updated  = _meta(3)

        # Description — <p id="job-description">
        # <br> → newline, <ojfilter> (blurred links) → [hidden]
        desc_el = soup.find("p", id="job-description")
        description = ""
        if desc_el:
            for ojf in desc_el.find_all("ojfilter"):
                ojf.replace_with("[hidden]")
            for br in desc_el.find_all("br"):
                br.replace_with("\n")
            description = desc_el.get_text()

        # Skills
        skills = [
            a.get_text(strip=True)
            for a in soup.find_all("a", class_="card-worker-topskill")
            if a.get_text(strip=True)
        ]

        return {
            "job_id": job_id,
            "title": title,
            "job_type": job_type,
            "salary": salary,
            "hours_per_week": hours_per_week,
            "date_updated": date_updated,
            "description": description,
            "skills": skills,
            "url": url,
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch job detail: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
