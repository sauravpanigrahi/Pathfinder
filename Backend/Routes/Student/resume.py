from fastapi import  HTTPException,File, UploadFile,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from datetime import datetime
# Import models in correct order
from Schema.student import Users
from Schema.resume import Resume
import cloudinary
import cloudinary.uploader
import tempfile

from datetime import datetime
from pydantic import BaseModel
import os
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()   
def compress_pdf(input_path, output_path):
    pdf = fitz.open(input_path)
    pdf.save(output_path, deflate=True)
    pdf.close()   
class ChatRequest(BaseModel):
    user_message: str
    resume_text: str | None = None  # optional field
router=APIRouter(
    prefix="/resume",
    tags=["application"]
)
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
    secure=True
)
@router.post("/uploadresume/{userID}")
async def upload_resume(
    userID: str,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # 1. Check user
        user = db.query(Users).filter(Users.uid == userID).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"No user found with UID {userID}"
            )

        # 2. Save temp file (streaming friendly)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
            while chunk := await resume.read(1024 * 1024):
                temp.write(chunk)
            temp_path = temp.name

        # 3. Upload directly (NO compression)
        upload_result = cloudinary.uploader.upload(
            temp_path,
            resource_type="auto",
            folder=f"resumes/{userID}"
        )

        # 4. Save DB
        resume_entry = Resume(
            uid=userID,
            filename=resume.filename,
            secure_url=upload_result["secure_url"],
            public_id=upload_result["public_id"],
            format=upload_result["format"],
            uploaded_at=datetime.utcnow()
        )

        db.add(resume_entry)
        db.commit()
        db.refresh(resume_entry)

        return {
            "message": "Resume uploaded successfully",
            "file_name": resume.filename,
            "url": upload_result["secure_url"]
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/checkresume/{user_id}")
def check_resume(user_id: str, db: Session = Depends(get_db)):
    """
    Check if the user has already uploaded a resume.
    """
    resume_entry = db.query(Resume).filter(Resume.uid == user_id).first()
    if resume_entry:
        return {"uploaded": True, "url": resume_entry.secure_url }
    else:
        return {"uploaded": False, "url": None}