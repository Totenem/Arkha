from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
import os
import json
import tempfile
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

client = Groq()


def optimize_cv(assess_results: dict, resume_details: dict, job_description: str) -> dict:
    important_info = assess_results.get("important_info", {})
    score = assess_results.get("score", "N/A")
    improvements = assess_results.get("improvements", [])

    resume_text = (
        " ".join(str(v) for v in resume_details.values())
        if isinstance(resume_details, dict)
        else str(resume_details)
    )

    # === Chain Step 1: Gap Analysis & Optimization Strategy ===
    strategy_response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional resume consultant. Analyze a candidate's resume assessment "
                    "against a target job description and produce a precise optimization strategy.\n"
                    "Return ONLY a valid JSON object with no text outside it:\n"
                    "{\n"
                    '  "target_keywords": ["keyword1", "keyword2"],\n'
                    '  "skills_to_emphasize": ["skill1"],\n'
                    '  "experience_framing_tips": "specific advice on how to reframe work experience",\n'
                    '  "recommended_summary_focus": "what the professional summary should highlight"\n'
                    "}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Current resume score vs this job: {score}\n"
                    f"Identified gaps and improvements needed: {json.dumps(improvements)}\n"
                    f"Candidate's structured info: {json.dumps(important_info)}\n"
                    f"Target job description: {job_description}\n\n"
                    "Produce an optimization strategy to maximize alignment with the target job."
                ),
            },
        ],
        temperature=0.3,
    )

    strategy_raw = strategy_response.choices[0].message.content
    strategy_cleaned = strategy_raw.replace("```json", "").replace("```", "").strip()

    try:
        strategy = json.loads(strategy_cleaned)
    except json.JSONDecodeError:
        strategy = {
            "target_keywords": [],
            "skills_to_emphasize": [],
            "experience_framing_tips": "Highlight achievements and quantifiable results aligned with the job.",
            "recommended_summary_focus": "Emphasize relevant experience and key skills matching the role.",
        }

    # === Chain Step 2: Generate Full Optimized Resume JSON ===
    optimized_response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert resume writer specializing in ATS-optimized Harvard-style resumes.\n"
                    "Apply the given optimization strategy to rewrite the candidate's resume for the target job.\n\n"
                    "STRICT RULES:\n"
                    "- Do NOT invent experience, credentials, skills, or dates not in the original resume\n"
                    "- Only reframe, emphasize, and optimize what already exists\n"
                    "- Use strong action verbs and incorporate target keywords naturally\n"
                    "- Return ONLY a valid JSON object with no text outside it\n\n"
                    "Required JSON structure:\n"
                    "{\n"
                    '  "personal_info": { "name": "", "email": "", "phone": "", "location": "" },\n'
                    '  "professional_summary": "",\n'
                    '  "education": [{ "degree": "", "institution": "", "dates": "", "details": "" }],\n'
                    '  "experience": [{ "company": "", "title": "", "dates": "", "bullets": ["achievement"] }],\n'
                    '  "skills": ["skill1"],\n'
                    '  "languages": ["language1"],\n'
                    '  "certifications": ["cert1"]\n'
                    "}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Original resume text:\n{resume_text}\n\n"
                    f"Original structured candidate info:\n{json.dumps(important_info)}\n\n"
                    f"Optimization strategy to apply:\n{json.dumps(strategy)}\n\n"
                    f"Target job description:\n{job_description}\n\n"
                    "Generate the fully optimized resume as JSON."
                ),
            },
        ],
        temperature=0.4,
    )

    optimized_raw = optimized_response.choices[0].message.content
    optimized_cleaned = optimized_raw.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(optimized_cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse optimized resume from LLM: {str(e)}")


def build_new_cv(results: dict) -> str:
    """Build a Harvard-style PDF resume from structured data. Returns the temp file path."""

    personal_info = results.get("personal_info", {})
    name = personal_info.get("name", "Candidate")
    email = personal_info.get("email", "")
    phone = personal_info.get("phone", "")
    location = personal_info.get("location", "")

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", prefix="ARKHA-Resume-")
    temp_path = temp_file.name
    temp_file.close()

    doc = SimpleDocTemplate(
        temp_path,
        pagesize=LETTER,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch,
    )

    name_style = ParagraphStyle(
        "NameStyle",
        fontName="Times-Bold",
        fontSize=16,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    contact_style = ParagraphStyle(
        "ContactStyle",
        fontName="Times-Roman",
        fontSize=10,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
    section_header_style = ParagraphStyle(
        "SectionHeader",
        fontName="Times-Bold",
        fontSize=11,
        spaceBefore=12,
        spaceAfter=2,
    )
    body_style = ParagraphStyle(
        "BodyStyle",
        fontName="Times-Roman",
        fontSize=10,
        spaceAfter=4,
        leading=14,
    )
    bullet_style = ParagraphStyle(
        "BulletStyle",
        fontName="Times-Roman",
        fontSize=10,
        leftIndent=16,
        spaceAfter=2,
        leading=14,
    )

    content = []

    # --- Header ---
    content.append(Paragraph(name, name_style))

    contact_parts = [p for p in [email, phone, location] if p]
    if contact_parts:
        content.append(Paragraph(" | ".join(contact_parts), contact_style))

    content.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceAfter=6))

    # --- Professional Summary ---
    summary = results.get("professional_summary", "")
    if summary:
        content.append(Paragraph("PROFESSIONAL SUMMARY", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        content.append(Paragraph(summary, body_style))

    # --- Education ---
    education = results.get("education", [])
    if education:
        content.append(Paragraph("EDUCATION", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        for edu in education:
            degree = edu.get("degree", "")
            institution = edu.get("institution", "")
            dates = edu.get("dates", "")
            details = edu.get("details", "")
            line = f"<b>{institution}</b>"
            if degree:
                line += f", {degree}"
            if dates:
                line += f" &nbsp;&nbsp; <i>{dates}</i>"
            content.append(Paragraph(line, body_style))
            if details:
                content.append(Paragraph(details, bullet_style))
            content.append(Spacer(1, 4))

    # --- Experience ---
    experience = results.get("experience", [])
    if experience:
        content.append(Paragraph("EXPERIENCE", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        for exp in experience:
            company = exp.get("company", "")
            title = exp.get("title", "")
            dates = exp.get("dates", "")
            bullets = exp.get("bullets", [])
            header = f"<b>{company}</b>"
            if title:
                header += f" — <i>{title}</i>"
            if dates:
                header += f" &nbsp;&nbsp; {dates}"
            content.append(Paragraph(header, body_style))
            for bullet in bullets:
                content.append(Paragraph(f"• {bullet}", bullet_style))
            content.append(Spacer(1, 6))

    # --- Skills ---
    skills = results.get("skills", [])
    if skills:
        content.append(Paragraph("SKILLS", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        content.append(Paragraph(" • ".join(skills), body_style))

    # --- Languages ---
    languages = [l for l in results.get("languages", []) if "not found" not in str(l).lower()]
    if languages:
        content.append(Paragraph("LANGUAGES", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        content.append(Paragraph(" • ".join(languages), body_style))

    # --- Certifications ---
    certifications = [c for c in results.get("certifications", []) if "not found" not in str(c).lower()]
    if certifications:
        content.append(Paragraph("CERTIFICATIONS", section_header_style))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.black, spaceAfter=4))
        for cert in certifications:
            content.append(Paragraph(f"• {cert}", bullet_style))

    doc.build(content)
    return temp_path
