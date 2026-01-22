from fastapi import  HTTPException,APIRouter,Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from Schema.jobs import Jobs
from Schema.application import Applications
from Schema.jobs import JobsResponse
from Schema.resume import Resume

from Schema.student_job_match import StudentJobMatch
from utils.resumeparse import extract_text_from_cloudinary_pdf
from utils.ai_analysis import calculate_ats_score
from typing import List
from sqlalchemy import or_, cast, String
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

# @router.get("/listedjobs")
# def get_listed_jobs(db: Session = Depends(get_db)):
#     try:
#         jobs = db.query(Jobs).all()
#         return jsonable_encoder(jobs)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))    
@router.get("/appliedjobs/{userID}")
def get_applied_jobs(userID: str, db: Session = Depends(get_db)):
    try:
        applications = db.query(Applications).filter(Applications.stud_uid == userID).all()
        return jsonable_encoder(applications)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/with-match/{stud_uid}")
def get_jobs_with_match(stud_uid: str, db: Session = Depends(get_db)):
    try:
        # Get resume text with error handling
        resume_entry = db.query(Resume).filter(Resume.uid == stud_uid).first()
        resume_text = None
        if resume_entry:
            try:
                resume_text = extract_text_from_cloudinary_pdf(resume_entry.secure_url)
            except Exception as e:
                print(f"⚠️ Warning: Could not extract resume text: {e}")
                # Continue without resume text - jobs will still be returned without match percentages

        # ✅ FIX: Only get Active jobs
        jobs = db.query(Jobs).filter(Jobs.status == "Active").all()

        applications = db.query(Applications).filter(
            Applications.stud_uid == stud_uid
        ).all()

        app_map = {
            (a.comp_uid, a.Job_role, a.Job_company, a.Job_location): a.status
            for a in applications
        }

        result = []

        for job in jobs:
            match_percentage = None
            job_description = f"""
            Job Title: {job.title}
            Company: {job.company}
            Location: {job.location}
            Type: {job.type}
            Description: {job.description}
            Required Skills: {', '.join(job.skills.keys()) if isinstance(job.skills, dict) else str(job.skills)}
            """
            if resume_text:
                try:
                    cache = db.query(StudentJobMatch).filter(
                        StudentJobMatch.student_uid == stud_uid,
                        StudentJobMatch.job_id == job.id
                    ).first()

                    if cache:
                        match_percentage = cache.match_percentage
                    else:
                        ats = calculate_ats_score(
                            resume_text[:17000],
                            job_description[:7000]
                        )
                        match_percentage = int(ats["semantic_score"])

                        db.add(StudentJobMatch(
                            student_uid=stud_uid,
                            job_id=job.id,
                            match_percentage=match_percentage
                        ))
                        # ✅ Note: Committing inside loop is acceptable here for caching,
                        # but consider batch commits for better performance with many jobs
                        try:
                            db.commit()
                        except Exception as commit_error:
                            db.rollback()
                            print(f"⚠️ Warning: Could not save match cache for job {job.id}: {commit_error}")
                            # Continue without caching - match_percentage is already calculated
                except Exception as e:
                    print(f"⚠️ Warning: Could not calculate match for job {job.id}: {e}")
                    # Continue without match percentage

            application_status = app_map.get(
                (job.uid, job.title, job.company, job.location),
                "not_applied"
            )

            # ✅ FIX: Remove duplicate fields
            result.append({
                "id": job.id,
                "uid": job.uid,
                "title": job.title,
                "company": job.company,
                "salary": job.salary,
                "posted": job.posted,
                "location": job.location,
                "type": job.type,
                "skills": job.skills,
                "status": job.status,  # Job status (Active/Closed)
                "match_percentage": match_percentage,  # None if no resume
                "application_status": application_status,  # Application status (not_applied/applied/etc)
                "description": job.description
            })

        return result
    except Exception as e:
        print(f"❌ Error in get_jobs_with_match: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")

@router.patch("/{uid}/status")
def update_job_status(job_id: str,jobTitle: str,jobType: str,data:JobsResponse,db: Session = Depends(get_db)):
    try:
    
        # Step 1: Check if job exists
        job = db.query(Jobs).filter(Jobs.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Step 2: Validate title and type match for that job
        if job.title != jobTitle or job.type != jobType:
            raise HTTPException(status_code=400, detail="Job title or type mismatch")

        # Step 3: Validate new status value
        if data.new_status not in ["Active", "Closed"]:
            raise HTTPException(status_code=400, detail="Invalid status value")

        # Step 4: Update only this specific job’s status
        job.status = data.new_status
        db.commit()
        db.refresh(job)
        return {
                "message": f"Status for job '{job.title}' updated to {data.new_status}",
                "job_id": job.id,
                "status": job.status,
            }
    except HTTPException:
            raise
    except Exception as e:
            db.rollback()
            print(f"❌ Error updating job status: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to update job status: {str(e)}")
@router.get("/search", response_model=List[JobsResponse])
def search_jobs(
    query: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    jobs = (
        db.query(Jobs)
        .filter(
            or_(
                Jobs.title.ilike(f"%{query}%"),
                Jobs.company.ilike(f"%{query}%"),
                Jobs.location.ilike(f"%{query}%"),
                Jobs.description.ilike(f"%{query}%"),
                cast(Jobs.skills, String).ilike(f"%{query}%")
            )
        )
        .filter(Jobs.status == "Active")
        .all()
    )

    if not jobs:
        return []

    return jobs