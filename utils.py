import fitz
import os
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq()

# ==== Extract text from PDF file =====

def extractTextFromFile(file_path):
    doc = fitz.open(file_path) 
    page_texts = {}
    for page_i in range(len(doc)):
        page = doc[page_i]
        text = page.get_text()
        page_texts[page_i + 1] = text
    return page_texts

# ====== EXTRACT IMPORTANT INFO FROM TEXT ======
def extractImportantInfo(text):
    chat_extraction = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        
        messages=[
            {
                "role": "system",
                "content": " You are a helpful assistant that extracts important information from resumes. Your task is to extract key details such as name, email, phone number, education, work experience,  and skills"
            },
            {
                "role": "user",
                "content": f"Extract important information from the following text and return as json (No other words or explanation): {text}"
            }
        ],
        temperature=1,
        top_p=1,
    )
    return chat_extraction.choices[0].message.content

# ====== take the json and convert it to a dictionary ======
def convertJsonToDict(json_str):
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return None

# take in the job description input by the user amd the important info, 
# campar the two and return score percenatge for the user to match the job description
def compareJobDescription(job_description, important_info):
    try:
        chat_compare = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": "You are a scoring system that analyzes job descriptions and candidate information. You must return a valid JSON object with exactly these two fields: 'score' (a string like '75% fit') and 'improvements' (an array of strings). Do not include any other text or formatting. Example: {\"score\": \"75% fit\", \"improvements\": [\"Gain experience with React\", \"Add more cloud computing projects\"]}"
                },
                {
                    "role": "user",
                    "content": f"Compare these and return a JSON object with score and improvement suggestions. Return ONLY the JSON object, no other text: Job Description: {job_description}, Candidate Info: {important_info}"
                }
            ],
            temperature=0.3,
        )
        response = chat_compare.choices[0].message.content
        # print("Raw API Response:", response)  # Debug log
        
        # remove any markdown code blocks if present
        cleaned_response = response.replace("```json", "").replace("```", "").strip()
        # print("Cleaned Response:", cleaned_response)  # Debug log
        
        try:
            result = json.loads(cleaned_response)
            # print("Parsed JSON:", result)  # Debug log
            
            # Validate the expected structure
            if not isinstance(result, dict):
                # print("Error: Result is not a dictionary")  # Debug log
                return {
                    "score": "Error",
                    "improvements": ["Invalid response format: not a dictionary"]
                }
                
            if "score" not in result or "improvements" not in result:
                # print("Error: Missing required fields")  # Debug log
                return {
                    "score": "Error",
                    "improvements": ["Invalid response format: missing required fields"]
                }
                
            if not isinstance(result["improvements"], list):
                # print("Error: Improvements is not a list")  # Debug log
                return {
                    "score": "Error",
                    "improvements": ["Invalid response format: improvements must be a list"]
                }
                
            return result
            
        except json.JSONDecodeError as e:
            # print("JSON Parse Error:", str(e))  # Debug log
            return {
                "score": "Error",
                "improvements": [f"Failed to parse analysis results: {str(e)}"]
            }
            
    except Exception as e:
        # print("General Error:", str(e))  # Debug log
        return {
            "score": "Error",
            "improvements": [f"Analysis failed: {str(e)}"]
        }