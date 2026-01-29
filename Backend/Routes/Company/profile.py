from fastapi import  HTTPException,APIRouter,Form, UploadFile, File
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.companysignup import CompanyDetails
from Schema.jobs import Jobs
from Schema.companysignup import CompanyUpdate
from Schema.interview import Interview
from datetime import datetime
from typing import Optional
import cloudinary.uploader
import os
import cloudinary
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
router=APIRouter(
    prefix="/company",
    tags=["company"]
)    
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
    secure=True
)    
@router.get("/{uid}/jobs")
def get_company_jobs(uid: str, db: Session = Depends(get_db)):
    try:
        jobs = db.query(Jobs).filter(Jobs.uid == uid).all()
        interview=db.query(Interview).filter(Interview.company_uid == uid,
                                             Interview.status.in_(["scheduled","completed"])
                                             ).all()

        return {
            "jobs": jsonable_encoder(jobs),
            "scheduled": len([i for i in interview if i.status=="scheduled"]),
            "Hired":len([i for i in interview if i.status=="completed"])
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch company jobs: {str(e)}"
        )
@router.get("/{companyUID}")
def get_company_interviews(companyUID: str, db: Session = Depends(get_db)):
    """
    Retrieve all interviews scheduled by a company.
    """
    try:
        interviews = db.query(Interview).filter(Interview.company_uid == companyUID).all()
        return jsonable_encoder(interviews)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch interviews: {str(e)}")    

@router.put("/{uid}/edit")
async def update_company_profile(
    uid: str,
    db: Session = Depends(get_db),
    companyName: Optional[str] = Form(None),
    industry: Optional[str] = Form(None),
    companySize: Optional[str] = Form(None),
    locations: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    contactNumber: Optional[str] = Form(None),
    workEmail: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    foundedYear: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    linkedinURL: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    coverImage: Optional[UploadFile] = File(None),
):
    company = db.query(CompanyDetails).filter(
        CompanyDetails.uid == uid
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # -------- UPDATE TEXT FIELDS ----------
    if companyName is not None:
        company.companyName = companyName
    if industry is not None:
        company.industry = industry
    if companySize is not None:
        company.companySize = companySize
    if locations is not None:
        company.locations = locations
    if address is not None:
        company.address = address
    if contactNumber is not None:
        company.contactNumber = contactNumber
    if workEmail is not None:
        company.workEmail = workEmail
    if website is not None:
        company.website = website
    if foundedYear is not None:
        company.foundedYear = foundedYear
    if description is not None:
        company.description = description
    if linkedinURL is not None:
        company.linkedinURL = linkedinURL

    # -------- CLOUDINARY UPLOAD ----------
    if logo:
        upload = cloudinary.uploader.upload(
            logo.file,
            folder="pathfinder/company/logos"
        )
        company.logoURL = upload["secure_url"]

    if coverImage:
        upload = cloudinary.uploader.upload(
            coverImage.file,
            folder="pathfinder/company/covers"
        )
        company.coverImageURL = upload["secure_url"]

    db.commit()
    db.refresh(company)

    return company

