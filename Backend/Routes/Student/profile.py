from fastapi import  HTTPException,APIRouter,Form, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.student import Users
from Schema.studentdetails import Details
from Schema.project import ProjectDetails
from Schema.experience import Experience
from Schema.profileupdate import ProfileUpdate
from dotenv import load_dotenv
from typing import Optional
from datetime import date
import cloudinary.uploader
load_dotenv()
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)
@router.get("/{uid}")
def get_student_profile(uid: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.uid == uid).first()
    if not user:
        print("❌ User not found")
        raise HTTPException(status_code=404, detail="User not found")

    userdetails = db.query(Details).filter(Details.uid == uid).first()
    if not userdetails:
        print("❌ User details not found")
        raise HTTPException(status_code=404, detail="User details not found")

    print("✅ Profile found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "details": {
            "id": userdetails.id,
            "phone_number": userdetails.phone_number,
            "date_of_birth": userdetails.date_of_birth,
            "address": userdetails.address,
            "bio": userdetails.bio,
            "qualification": userdetails.qualification,
            "graduation_year": userdetails.graduation_year,
            "college_university": userdetails.college_university,
            "linkedin_url": userdetails.linkedin_url,
            "github_url": userdetails.github_url,
            "profile_picture":userdetails.profile_picture
        }
    }
@router.get("/check/{userID}")
def profilecheck(userID: str, db: Session = Depends(get_db)):
    project = db.query(ProjectDetails).filter(ProjectDetails.stud_uid == userID).first()
    experience = db.query(Experience).filter(Experience.stud_uid == userID).first()

    message = None
    if project is None:
        message = "Add project to your profile"
    elif experience is None:
        message = "Add experience to your profile"

    return {
        "project": project is not None,
        "experience": experience is not None,
        "message": message
    }


@router.put("/update/{userID}")
async def update_profile(
    userID: str,
    db: Session = Depends(get_db),
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    date_of_birth: Optional[date] = Form(None),
    address: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    qualification: Optional[str] = Form(None),
    graduation_year: Optional[int] = Form(None),
    college_university: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    # 1️⃣ Fetch user
    user = db.query(Users).filter(Users.uid == userID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2️⃣ Update Users table
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email

    # 3️⃣ Fetch details
    details = db.query(Details).filter(Details.uid == userID).first()
    if not details:
        raise HTTPException(status_code=404, detail="User details not found")

    # 4️⃣ Update Details table
    if phone_number is not None:
        details.phone_number = phone_number
    if date_of_birth is not None:
        details.date_of_birth = date_of_birth
    if address is not None:
        details.address = address
    if bio is not None:
        details.bio = bio
    if qualification is not None:
        details.qualification = qualification
    if graduation_year is not None:
        details.graduation_year = graduation_year
    if college_university is not None:
        details.college_university = college_university
    if linkedin_url is not None:
        details.linkedin_url = linkedin_url
    if github_url is not None:
        details.github_url = github_url

    # 5️⃣ Upload profile picture (Details table)
    if profile_picture:
        upload = cloudinary.uploader.upload(
            profile_picture.file,
            folder="pathfinder/students/profile"
        )
        details.profile_picture = upload["secure_url"]

    # 6️⃣ Commit changes
    try:
        db.commit()
        db.refresh(user)
        db.refresh(details)
        return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
