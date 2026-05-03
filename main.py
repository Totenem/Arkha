from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from service.jobs import search_for_ads_job
from service.onlinejobsph import search_onlinejobsph, get_onlinejobsph_job
from utils import extractTextFromFile, extractImportantInfo, convertJsonToDict, compareJobDescription, generateCoverLetter
from models.input import JobSearchInput, OnlineJobsSearchInput
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

@app.post("/get-assess")
@limiter.limit("10/minute")
async def getTextFromPdf(request: Request, job_description: str, sector: str, file: UploadFile = File(...)):
    try:
        # Create a temporary file to store the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Write the uploaded file content to the temporary file
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Extract text from the temporary PDF file
            extracted_text = extractTextFromFile(temp_file_path)
            
            if not extracted_text:
                return {"error": "No text extracted from PDF."}
            
            # if the extraction successful
            extraction_message = "Successfully Analyzed Your Resume"
            
            # get the important infos 
            all_text = " ".join(extracted_text.values())
            important_info = extractImportantInfo(all_text, sector)
            
            # clean up the json string by removing markdown code and structure llm response
            cleaned_json = important_info.replace("```json", "").replace("```", "").strip()
            
            # breaking down the cleaned json string
            important_info_dict = json.loads(cleaned_json)
            
            # compare the job description and the important info
            comparison_dict = compareJobDescription(job_description, important_info_dict)
            
            # generate cover letter
            cover_letter = generateCoverLetter(job_description, cleaned_json)
            
            # Check if we got an error response
            if comparison_dict.get("score") == "Error":
                return {
                    "extraction_message": extraction_message,
                    "important_info": important_info_dict,
                    "error": comparison_dict.get("improvements", ["Unknown error occurred"])[0]
                }
            
            return {
                "extraction_message": extraction_message,
                "important_info": important_info_dict,
                "score": comparison_dict.get("score"),
                "cover_letter": cover_letter,
                "improvements": comparison_dict.get("improvements", [])
            }
            
        finally:
            # Clean up: remove the temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
        
    except Exception as e:
        return { 
            "error": f"An unexpected error occurred: {str(e)}"
        }


# @app.post("/search-jobs")
# async def searchJobs(search_data: JobSearchInput):
#     try:
#         job_json = await search_for_ads_job(search_data)
#         return job_json
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

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