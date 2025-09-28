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
def extractImportantInfo(text, sector):
    chat_extraction = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        
        messages=[
            {
                "role": "system",
                "content": f"You are a helpful assistant that extracts important information from a {sector} resumes. Your task is to extract key details such as name, email, phone number, education, work experience,  and skills"
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

#========== take in the job description input by the user amd the important info, 
# campar the two and return score percenatge for the user to match the job description=============
def compareJobDescription(job_description, important_info):
    try:
        chat_compare = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": """You are an AI that analyzes a job description and a candidate's information.

        You must return a single, valid JSON object with the following exact fields:
        - "name"
        - "email"
        - "phone_number"
        - "education": an array of objects, or the string "Not found sorry"
        - "work_experience": an array of objects, or the string "Not found sorry"
        - "skills": an array of strings, or the string "Not found sorry"
        - "languages": an array of strings, or the string "Not found sorry"
        - "licenses": an array of strings, or the string "Not found sorry"
        - "score": a string in this format: "75% fit"
        - "improvements": an array of suggestions

        Example output format:
        {
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": "+63 900 000 0000",
        "education": [
            {
            "degree": "BS in Engineering",
            "university": "XYZ University",
            "graduation_date": "2015-2019"
            }
        ],
        "work_experience": [
            {
            "company": "ABC Corp",
            "position": "Engineer",
            "date": "2020 - PRESENT",
            "description": [
                "Designed mechanical components",
                "Led engineering reviews"
            ]
            }
        ],
        "skills": ["Project Management", "AutoCAD"],
        "languages": ["English", "Filipino"],
        "licenses": ["Registered Civil Engineer"],
        "score": "70% fit",
        "improvements": [
            "Learn React",
            "Understand REST APIs"
        ]
        }

        Rules:
        - Do not return any text outside of the JSON.
        - If a section is missing or incomplete, insert "Not found sorry" as the value.
        - Only output the JSON object with no explanation or formatting."""
                },
                {
                    "role": "user",
                    "content": f"Job Description: {job_description}\n\nCandidate Info: {important_info}"
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
        
# ======== Generate Cover Letter =========
def generateCoverLetter(job_description, cleaned_json):
    try:
        chat_cover = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert cover letter generator. Given a job description and a candidate's structured resume info, write a professional 250-word cover letter.
                Only return the cover letter as plain text — no JSON, no formatting tags.
                Start with 'Dear Hiring Manager' and end with a polite sign-off including the candidate's name.
                """
                },
                {
                    "role": "assistant",
                    "content": "Here's a sample cover letter:\n\n[Your Name]\n[Your Address]\n[City, State ZIP Code]\n[Date]\n\n[Recipient’s Name]\n[Recipient’s Title]\n[Company Name]\n[Company Address]\n[City, State ZIP Code]\n\nDear [Recipient’s Name],\n\nI am excited to apply for the [Job Title] position at [Company Name]. As a highly motivated and dedicated professional with [Number] years of experience in [Industry/Field], I am confident that I possess the skills and qualifications necessary to excel in this role.\n\nWith a strong background in [Key Skills or Qualifications], I have a proven track record of [Desirable Achievements or Accomplishments]. My most recent position at [Previous Company] has provided me with valuable experience in [Relevant Skills or Experience], and I am eager to leverage my expertise to contribute to the success of [Company Name].\n\nI am particularly drawn to [Company Name] because of its [Reason for Interest in Company]. I am impressed by the company's commitment to [Aspect of Company's Mission or Values that Resonates with You] and believe that my own values and work ethic align closely with those of the organization.\n\nIn addition to my professional experience and skills, I possess excellent communication and interpersonal skills, which have been demonstrated through my ability to [Example of Effective Communication or Teamwork]. I am a team player who is comfortable working in a [Fast-Paced/ Collaborative/ Dynamic] environment and am excited about the opportunity to join a team of dedicated professionals.\n\nThank you for considering my application. I would welcome the opportunity to discuss my qualifications further and explain in greater detail why I am the ideal candidate for this role. Please feel free to contact me at [Your Phone Number] or [Your Email Address].\n\nSincerely,\n\n[Your Name]\n\n**Here's a breakdown of the key components:**\n\n1. **Introduction**: Introduce yourself, state the position you're applying for, and provide a brief overview of your qualifications.\n2. **Summary of Qualifications**: Highlight your relevant skills, experience, and achievements that align with the job requirements.\n3. **Expression of Interest**: Explain why you're interested in the company and the role, and how your values and goals align with those of the organization.\n4. **Key Skills and Strengths**: Emphasize your relevant skills and strengths that will enable you to excel in the role.\n5. **Call to Action**: Express your enthusiasm for the opportunity to discuss your qualifications further and request an interview.\n6. **Closing**: End with a professional closing and signature.\n\n**Remember to customize your cover letter:**\n\n* Address the recipient by name (if possible)\n* Tailor your letter to the specific job and company\n* Use specific examples and anecdotes to illustrate your skills and experience\n* Proofread carefully to ensure error-free writing\n\nI hope this sample cover letter helps! Let me know if you have any questions or need further assistance."
                },
                {
                    "role": "user",
                    "content": f"""Job Description: {job_description}
                    Candidate Info: {cleaned_json}
                    """
                }
            ],
            temperature=1,
            top_p=1,
            stream=True,
            stop=None,
        )
        cover_letter = ""
        for chunk in chat_cover:
            cover_letter += chunk.choices[0].delta.content or ""
        return cover_letter
    except Exception as e:
        return f"Error generating cover letter: {str(e)}"
