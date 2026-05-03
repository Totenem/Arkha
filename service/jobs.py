from dotenv import load_dotenv
from models.input import JobSearchInput
from fastapi import HTTPException
import os
import requests

load_dotenv()

BASE_URL = os.getenv("JOBS_API_BASE_URL")
APP_ID = os.getenv("JOBS_API_APP_ID")
APP_KEY = os.getenv("JOBS_API_APP_KEY")

async def search_for_ads_job(search_data: JobSearchInput):
    try: 
        # if some value is not provided, we will not include it in the url
        url_params = {
            "app_id": APP_ID,
            "app_key": APP_KEY,            
            "what": search_data.what,
            "salary_min": search_data.salary_min,
            "full_time": search_data.full_time,
            "permanent": search_data.permanent,
            "where": search_data.where,
            "sort_by": search_data.sort_by
        }
        filtered_params = {}

        for key, value in url_params.items():
            # Check that value is not None and not an empty string
            if value is not None and value != "":
                filtered_params[key] = value
        
        #query string here
        parts = []
        for key, value in filtered_params.items():
            part = f"{key}={value}"
            parts.append(part)

        url_params_str = "&".join(parts)

        url = f"{BASE_URL}/{search_data.country}/search/{search_data.page}?{url_params_str}"
        response = requests.get(url)

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")