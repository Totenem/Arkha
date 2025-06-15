from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from utils import extractTextFromFile, extractImportantInfo, convertJsonToDict, compareJobDescription, generateCoverLetter
import json
import tempfile
import os

app = FastAPI()

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
async def getTextFromPdf(job_description: str, sector: str, file: UploadFile = File(...)):
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