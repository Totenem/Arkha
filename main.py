from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from service.onlinejobsph import search_onlinejobsph, get_onlinejobsph_job
from utils import extractTextFromFile, extractImportantInfo, convertJsonToDict, compareJobDescription, generateCoverLetter
from lib.optimize_resume import optimize_cv, build_new_cv
from lib.auth import get_current_user, check_and_log_usage
from models.input import OnlineJobsSearchInput, TailorResumeInput
import json
import tempfile
import os

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "working"}

@app.post("/get-assess", status_code=200)
@limiter.limit("10/minute")
async def getTextFromPdf(request: Request, job_description: str, sector: str, file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    await check_and_log_usage("assess", user)

    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        extracted_text = extractTextFromFile(temp_file_path)

        if not extracted_text:
            raise HTTPException(status_code=422, detail="No text could be extracted from the uploaded PDF.")

        all_text = " ".join(extracted_text.values())
        important_info = extractImportantInfo(all_text, sector)
        cleaned_json = important_info.replace("```json", "").replace("```", "").strip()

        try:
            important_info_dict = json.loads(cleaned_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=422, detail="Failed to parse resume information. Please try again.")

        comparison_dict = compareJobDescription(job_description, important_info_dict)

        if comparison_dict.get("score") == "Error":
            raise HTTPException(
                status_code=422,
                detail=comparison_dict.get("improvements", ["Unknown error during comparison."])[0]
            )

        cover_letter = generateCoverLetter(job_description, cleaned_json)

        return {
            "extraction_message": "Successfully Analyzed Your Resume",
            "important_info": important_info_dict,
            "score": comparison_dict.get("score"),
            "cover_letter": cover_letter,
            "improvements": comparison_dict.get("improvements", []),
            "resume_details": extracted_text,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


@app.post("/tailor-resume", status_code=200)
@limiter.limit("5/minute")
async def tailor_resume(request: Request, body: TailorResumeInput, user: dict = Depends(get_current_user)):
    await check_and_log_usage("optimize", user)

    try:
        optimized_data = optimize_cv(body.assess_results, body.resume_details, body.job_description)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume optimization failed: {str(e)}")

    try:
        pdf_path = build_new_cv(optimized_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    candidate_name = optimized_data.get("personal_info", {}).get("name", "Resume").replace(" ", "_")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"ARKHA-{candidate_name}-Optimized-Resume.pdf",
        background=BackgroundTask(os.unlink, pdf_path),
    )

@app.post("/search-ojph")
@limiter.limit("100/minute")
async def searchOnlineJobsPH(request: Request, search_data: OnlineJobsSearchInput):
    try:
        return await search_onlinejobsph(search_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/ojph-job/{job_id}")
@limiter.limit("100/minute")
async def getOnlineJobsPHJob(request: Request, job_id: str):
    try:
        return await get_onlinejobsph_job(job_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")