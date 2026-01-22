from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal

# Import models in correct order
from Schema.student import Users
from Schema.studentdetails import Details
from Schema.companysignup import CompanyDetails
from Schema.jobs import Jobs
from Schema.application import Applications
from Schema.studentdetails import StudentCreate, StudentResponse
from Schema.application import ApplicationsCreate, ApplicationsResponse
from Schema.resume import Resume
from Schema.student_job_match import StudentJobMatch
import cloudinary
import cloudinary.uploader

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
router=APIRouter(
    prefix="/student",
    tags=["application"]
)

@router.post("/details", response_model=StudentResponse)
def create_student_details(details: StudentCreate, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.uid == details.uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found for provided uid")

    existing = db.query(Details).filter(Details.uid == details.uid).first()
    if existing:
        raise HTTPException(status_code=400, detail="Details already exist for this user")
    record = Details(
        uid=details.uid,
        phone_number=details.phone_number,
        date_of_birth=details.date_of_birth,
        address=details.address,
        bio=details.bio,
        qualification=details.qualification,
        graduation_year=details.graduation_year,
        college_university=details.college_university,
        linkedin_url=details.linkedin_url,
        github_url=details.github_url,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.post("/apply", response_model=ApplicationsResponse)
def submit_application(application: ApplicationsCreate, db: Session = Depends(get_db)):
    check_comp=db.query(CompanyDetails).filter(CompanyDetails.uid==application.comp_uid).first()
    check_job=db.query(Jobs).filter(Jobs.uid==application.comp_uid).first()
    if not check_comp or not check_job:
        raise HTTPException(status_code=404, detail="Company or Job post not found")
    check_role=db.query(Jobs).filter(Jobs.title==application.Job_role, Jobs.company==application.Job_company, Jobs.location==application.Job_location).first()
    if not check_role:
        raise HTTPException(status_code=404, detail="Job role, company, or location mismatch")
    try:
        db_application = Applications(
            comp_uid=application.comp_uid,
            stud_uid=application.stud_uid,
            Job_role= application.Job_role,
            Job_company=application.Job_company,
            Job_location=application.Job_location,
            Fullname=application.Fullname,
            Email=application.Email,
            phonenumber=application.phonenumber,
            Dob=application.Dob,
            high_qualification=application.high_qualification,
            college=application.college,
            graduation_year=application.graduation_year,
            prev_company=application.prev_company,
            job_title=application.job_title,
            start_date=application.start_date,
            end_date=application.end_date,
            linkedin_url=application.linkedin_url,
            github_url=application.github_url,
            why_join=application.why_join,
            status='pending'  # ✅ Default status
        )
        db.add(db_application)
        db.commit()
        db.refresh(db_application)
        return db_application
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
@router.delete("/resume/delete/{userID}")
def delete_resume(userID: str, db: Session = Depends(get_db)):
    resume_entry = db.query(Resume).filter(Resume.uid == userID).first()

    if not resume_entry:
        raise HTTPException(status_code=404, detail="Resume not found")

    # ☁️ Cloudinary delete (DO NOT CRASH API)
    if resume_entry.public_id:
        try:
            # ✅ FIX: Use "raw" resource_type for PDF files, not "image"
            cloudinary.uploader.destroy(
                resume_entry.public_id,
                resource_type="raw",  # Changed from "image" to "raw" for PDF files
                type="upload",
                invalidate=True
            )
        except Exception as e:
            print("Cloudinary delete error:", e)

    try:
        # 🗑️ Delete resume
        db.delete(resume_entry)
        # 🔥 CLEAR STUDENT-SIDE ATS (preview)
        db.query(StudentJobMatch)\
          .filter(StudentJobMatch.student_uid == userID)\
          .delete()

        db.commit()

        return {
            "message": "Resume deleted successfully. ATS cache cleared."
        }

    except Exception as e:
        db.rollback()
        print("DB delete error:", e)
        raise HTTPException(status_code=500, detail="Database delete failed")    