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
import fitz  # for compression
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
async def upload_resume(userID: str, resume: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # ✅ Step 1: Check if user exists
        user = db.query(Users).filter(Users.uid == userID).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"No user found with UID {userID}. Please sign up before uploading a resume."
            )

        # ✅ Step 2: Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
            temp.write(await resume.read())
            temp_path = temp.name

        compressed_path = temp_path.replace(".pdf", "_compressed.pdf")
        compress_pdf(temp_path, compressed_path)
        import os
        print("Original size:", os.path.getsize(temp_path))
        print("Compressed size:", os.path.getsize(compressed_path))

        # ✅ Step 3: Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            compressed_path,
            resource_type="auto",
            folder=f"resumes/{userID}"
        )

        # ✅ Step 4: Save resume record to DB
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
            "message": f"Resume uploaded successfully for user {userID}",
            "file_name": resume.filename,
            "url": upload_result["secure_url"]
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ Error in upload_resume: {e}")
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