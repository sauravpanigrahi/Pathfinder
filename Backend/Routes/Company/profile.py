from fastapi import  HTTPException,APIRouter
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.companysignup import CompanyDetails
from Schema.jobs import Jobs
from Schema.companysignup import CompanyUpdate
from Schema.interview import Interview
from datetime import datetime

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
def Update_companyprofile(uid:str,payload:CompanyUpdate,db:Session=Depends(get_db)):
    company=db.query(CompanyDetails).filter(CompanyDetails.uid==uid).first()
    if not company:
        raise HTTPException(status_code=404, detail="company not found")
    update_data = payload.model_dump(exclude_unset=True)
# payload = frontend se aaya hua CompanyUpdate object
# model_dump() = Pydantic object ko Python dict me convert karta hai
# exclude_unset=True =
# 👉 sirf wahi fields include karo jo request me bheje gaye hain
    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)
    return company

