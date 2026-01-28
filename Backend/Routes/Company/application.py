from fastapi import  HTTPException,APIRouter
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from datetime import datetime
from Schema.companysignup import CompanyDetails
from Schema.jobs import Jobs
from Schema.application import Applications
from Schema.resume import Resume
from Schema.interview import Interview
from Schema.notifications import Notification
from datetime import datetime
from utils.resumeparse import extract_text_from_cloudinary_pdf,get_resume_skills_from_pdf
from pydantic import BaseModel
from typing import Optional
from utils.ai_analysis import calculate_ats_score

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/applications",
    tags=["application"]
)
def create_notification(
    db: Session,
    user_uid: str,
    type: str,
    title: str,
    message: str,
    related_id: Optional[int] = None,
    related_type: Optional[str] = None,
    company_name: Optional[str] = None,
    job_role: Optional[str] = None,
    interview_datetime: Optional[datetime] = None,
    meeting_link: Optional[str] = None
):
    """Helper function to create notifications"""
    try:
        notification = Notification(
            user_uid=user_uid,
            type=type,
            title=title,
            message=message,
            related_id=related_id,
            related_type=related_type,
            company_name=company_name,
            job_role=job_role,
            interview_datetime=interview_datetime,
            meeting_link=meeting_link
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    except Exception as e:
        db.rollback()
        print(f"Error creating notification: {str(e)}")
        return None
    

@router.get("/{companyUID}")
def get_company_applications(companyUID: str, db: Session = Depends(get_db)):
    try:
        applications = db.query(Applications).filter(
            Applications.comp_uid == companyUID
        ).all()
        return jsonable_encoder(applications)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class StatusUpdate(BaseModel):
    status: str

@router.patch("/{application_id}/status")
def update_application_status(application_id: int, status_data: StatusUpdate, db: Session = Depends(get_db)):
    """
    Update application status (pending, accepted, rejected)
    """
    try:
        application = db.query(Applications).filter(Applications.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        new_status = status_data.status.lower()
        if new_status not in ['pending', 'accepted', 'rejected']:
            raise HTTPException(status_code=400, detail="Invalid status. Must be 'pending', 'accepted', or 'rejected'")
        
        application.status = new_status
        db.commit()
        db.refresh(application)
        
        # Create notification if application is accepted
        if new_status == 'accepted':
            company = db.query(CompanyDetails).filter(CompanyDetails.uid == application.comp_uid).first()
            create_notification(
                db=db,
                user_uid=application.stud_uid,
                type='application_accepted',
                title='Application Accepted! 🎉',
                message=f'Congratulations! Your application for {application.Job_role} at {application.Job_company} has been accepted.',
                related_id=application.id,
                related_type='application',
                company_name=application.Job_company,
                job_role=application.Job_role
            )
        
        return {
            "message": f"Application status updated to {new_status}",
            "application_id": application.id,
            "status": application.status
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update status: {str(e)}")

@router.get("/{application_id}/match-percentage")
def calculate_match_percentage(application_id: int, db: Session = Depends(get_db)):
    try:
        application = db.query(Applications).filter(
            Applications.id == application_id
        ).first()

        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        # Return cached value
        if application.match_percentage is not None:
            return {
                "match_percentage": application.match_percentage,
                "cached": True
            }

        # Get resume
        resume_entry = db.query(Resume).filter(
            Resume.uid == application.stud_uid
        ).first()

        if not resume_entry:
            return {
                "match_percentage": 0,
                "message": "Resume not uploaded by student"
            }

        resume_skills_text = get_resume_skills_from_pdf(
            resume_entry.secure_url
        )

        # Get job
        job = db.query(Jobs).filter(
            Jobs.uid == application.comp_uid,
            Jobs.title == application.Job_role,
            Jobs.company == application.Job_company,
            Jobs.location == application.Job_location,
        ).first()

        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # ✅ Correct unpacking
        score, matched = calculate_ats_score(
            resume_skills_text,
            job.skills
        )

        match_percentage = int(score)
        print("match",match_percentage)
        # Save to DB
        application.match_percentage = match_percentage
        db.commit()

        return {
            "match_percentage": match_percentage,
            "matched_skills": matched,
            "cached": False
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate match: {str(e)}"
        )

@router.get("/check/{userID}/{companyUID}/{jobRole}/{jobCompany}/{jobLocation}")
def check_application_status(
    userID: str,
    companyUID: str,
    jobRole: str,
    jobCompany: str,
    jobLocation: str,
    db: Session = Depends(get_db)
):
    try:
        # 1️⃣ Check application
        application = db.query(Applications).filter(
            Applications.stud_uid == userID,
            Applications.comp_uid == companyUID,
            Applications.Job_role == jobRole,
            Applications.Job_company == jobCompany,
            Applications.Job_location == jobLocation
        ).first()

        if not application:
            return {
                "has_applied": False,
                "status": None
            }

        # 2️⃣ Check interview linked to this application
        interview = db.query(Interview).filter(
            Interview.application_id == application.id,
            Interview.student_uid == userID,
            Interview.company_uid == companyUID,
            Interview.status.in_(["scheduled","rescheduled","completed","cancelled"]),
            Interview.platform.in_(["google_meet", "zoom","offline"])
        ).first()

        # 3️⃣ Decide final status
        final_status = interview.status if interview else application.status
        platform= interview.platform if interview else None
        meeting_link = None
        if interview:
            if interview.platform in ["google_meet", "zoom"]:
                meeting_link = interview.meeting_link
            else:
                meeting_link = "offline"
        return {
            "has_applied": True,
            "status": final_status,
            "meeting_link": meeting_link,
            "platform": platform,
            "application_id": application.id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))