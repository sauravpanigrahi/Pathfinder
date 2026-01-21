from fastapi import HTTPException,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from datetime import datetime
# Import models in correct order
from Schema.student import Users
from Schema.companysignup import CompanyDetails
from Schema.jobs import Jobs
from Schema.jobs import JobsCreate, JobsResponse
from Schema.notifications import Notification
from datetime import datetime
from typing import Optional

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

@router.post("/{uid}/create", response_model=JobsResponse)
def create_job(uid: str, job_data: JobsCreate, db: Session = Depends(get_db)):
    # Verify company exists
    company = db.query(CompanyDetails).filter(CompanyDetails.uid == uid).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    try:
        # Create job with company details
        job = Jobs(
            uid=uid,
            title=job_data.title,
            company=company.companyName,  # Use company name from DB
            location=job_data.location,
            type=job_data.type,
            salary=job_data.salary,
            posted=job_data.posted,
            status="Active",  # Default status
            skills=dict(job_data.skills),  # Convert to dict if needed
            description=job_data.description
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Create notifications for all students about new job posting
        # Get all students (users)
        all_students = db.query(Users).all()
        for student in all_students:
            create_notification(
                db=db,
                user_uid=student.uid,
                type='new_job',
                title='New Job Opportunity! 💼',
                message=f'{company.companyName} has posted a new {job_data.title} position in {job_data.location}.',
                related_id=job.id,
                related_type='job',
                company_name=company.companyName,
                job_role=job_data.title
            )
        
        return job
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))    


# ==================== NOTIFICATIONS ENDPOINTS ====================

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