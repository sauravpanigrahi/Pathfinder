from fastapi import APIRouter, HTTPException,Request
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.resume import Resume
from Schema.jobs import Jobs
from utils.resumeparse import extract_text_from_cloudinary_pdf,get_resume_skills_from_pdf
from utils.ai_google import run_gemini_query
from utils.ai_analysis import calculate_ats_score
from slowapi import Limiter
from slowapi.util import get_remote_address
from utils.rate_limiter import limiter

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
router=APIRouter(
    prefix="/review",
    tags=["review"]
)
@router.get("/getresume/{userID}")
def get_resume(userID: str, db: Session = Depends(get_db)):
    resume_entry = db.query(Resume).filter(Resume.uid == userID).first()
    if not resume_entry:
        raise HTTPException(status_code=404, detail="Resume not found for the user")

    return {
        "file_name": resume_entry.filename,
        "url": resume_entry.secure_url,
        "uploaded_at": resume_entry.uploaded_at
    }
    
@router.get("/analyze_resume/{userID}/{job_id}")
@limiter.limit("1/2minutes")
def analyze_resume(request: Request,userID: str, job_id: int, db: Session = Depends(get_db)):
    try:
        # 1️⃣ Resume
        resume_entry = db.query(Resume).filter(Resume.uid == userID).first()
        if not resume_entry:
            raise HTTPException(status_code=404, detail="Resume not found")

        resume_text = extract_text_from_cloudinary_pdf(resume_entry.secure_url)
        resume_skills_text = None
        if resume_text:
            resume_skills_text = get_resume_skills_from_pdf(resume_entry.secure_url )
        resume_text = resume_text[:10000]
        print(resume_text)
        # 2️⃣ Job
        job = db.query(Jobs).filter(Jobs.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        job_description = job.description
        job_skill=job.skills
        print("job_skills",job_skill)
        print("resume_skills_text",resume_skills_text)
        # 3️⃣ Gemini prompt
        prompt = f"""
        You are an expert resume and ATS evaluator.

        Analyze the resume ONLY for the following job.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Provide:
        1. Summary – key strengths and technical skills
        2. Missing Skills
        3. 3 actionable recommendations

        Keep the response under 300 words.
        """

        response = run_gemini_query(prompt)
        if not response:
            raise HTTPException(
                status_code=500,
                detail="AI failed to process the resume"
            )

        ai_result = response.text

        # 4️⃣ ATS score (algorithmic)
        score,matched = calculate_ats_score(resume_skills_text, job_skill)
        print(score)
        return {
            "analysis": ai_result,
            "semantic_score": score,
            # "matched_skills": matched
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}"
        )