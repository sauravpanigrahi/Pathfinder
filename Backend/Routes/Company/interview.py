from fastapi import HTTPException,APIRouter,BackgroundTasks
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from datetime import datetime
from Schema.student import Users
from Schema.companysignup import CompanyDetails
from Schema.application import Applications
from Schema.interview import Interview,InterviewStatusUpdate
from Schema.notifications import Notification
from datetime import datetime
from typing import Optional
from utils.fastmail import mail_send

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

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
router = APIRouter(
    prefix="/interviews",
    tags=["interviews"]
)   

@router.post("/schedule")
async def schedule_interview(interview_data: dict, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Schedule an interview for a job application.
    Expects interview_data to contain:
    - application_id
    - student_id
    - company_id
    - interview_datetime (ISO format string)
    - platform (google_meet, zoom, offline)
    - meeting_link (optional)
    - status (scheduled, rescheduled, completed, cancelled)
    """
    try:
         # Import here to avoid circular dependency
        interview = Interview(
            application_id=interview_data["application_id"],
            student_uid=interview_data["student_uid"],
            company_uid=interview_data["company_uid"],
            interview_datetime=datetime.fromisoformat(interview_data["interview_datetime"]),
            platform=interview_data.get("platform", "google_meet"),
            meeting_link=interview_data.get("meeting_link"),
            status=interview_data.get("status", "scheduled"),
            name=interview_data["name"],
            role=interview_data["role"]

        )
        db.add(interview)
        db.commit()
        db.refresh(interview)
        
        # Create notification for interview scheduled
        application = db.query(Applications).filter(Applications.id == interview_data["application_id"]).first()
        if application:
            create_notification(
                db=db,
                user_uid=interview_data["student_uid"],
                type='interview_scheduled',
                title='Interview Scheduled 📅',
                message=f'Your interview for {application.Job_role} at {application.Job_company} has been scheduled.',
                related_id=interview.id,
                related_type='interview',
                company_name=application.Job_company,
                job_role=application.Job_role,
                interview_datetime=interview.interview_datetime,
                meeting_link=interview.meeting_link
            )
        
        email_sent = False
        if interview_data.get("send_email") is True:
            application=db.query(Applications).filter(Applications.id==interview_data["application_id"]).first()
            student=db.query(Users).filter(Users.uid==interview_data["student_uid"]).first()
            company=db.query(CompanyDetails).filter(CompanyDetails.uid==interview_data["company_uid"]).first()
            if application and student and company:
                email_subject="Interview Scheduled"
                email_body = f"""
                    <p>Dear {application.Fullname},</p>

                    <p>Your interview for the position of <b>{application.Job_role}</b> at
                    <b>{application.Job_company}</b> has been scheduled.</p>

                    <p>
                    Date & Time: {interview.interview_datetime.strftime('%Y-%m-%d %H:%M')}<br/>
                    Platform: {interview.platform}<br/>
                    Meeting Link:
                    <a href="{interview.meeting_link}">{interview.meeting_link}</a>
                    </p>

                    <p>Best regards,<br/>
                    <b>{company.companyName} Recruitment Team</b>
                    </p>
                    """

                try:
                    print("📧 Sending email to:", student.email)
                    background_tasks.add_task(mail_send,email_subject,student.email,email_body)
                    email_sent = True  # ✅ mail actually sent
                except Exception as mail_error:
                    email_sent = False
        return {
            "message": "Interview scheduled successfully",
            "interview_id": interview.id,
            "email_status": "sent" if email_sent else "not_sent",
            "details": {
                "application_id": interview.application_id,
                "student_uid": interview.student_uid,
                "company_uid": interview.company_uid,
                "interview_datetime": interview.interview_datetime,
                "platform": interview.platform,
                "meeting_link": interview.meeting_link,
                "status": interview.status
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to schedule interview: {str(e)}")    

@router.get("/company/{companyUID}")
def fetch_interview(companyUID:str,db: Session = Depends(get_db)):
    interview=db.query(Interview).filter(Interview.company_uid==companyUID).all()
    if interview is None:
        raise HTTPException(status_code=404, detail="interview not found")
    return interview
@router.put("/{interviewId}/status")
def update_interview_status(
    interviewId: int,
    payload: InterviewStatusUpdate,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == interviewId).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if payload.status == "rescheduled":
        if not payload.interview_datetime:
            raise HTTPException(
                status_code=400,
                detail="New interview date/time is required"
            )
        interview.interview_datetime = payload.interview_datetime

    interview.status = payload.status
    db.commit()
    db.refresh(interview)
    return interview
