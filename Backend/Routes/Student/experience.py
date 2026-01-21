
from fastapi import HTTPException,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.experience import Experience,ExperienceBulkCreate,ExperienceDetailsResponse,ExperienceUpdate
from typing import List
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
router = APIRouter(
    prefix="/experience",
    tags=["experience"]
)
@router.post("/add/{userID}")  
def add_experience(
    userID: str,
    data: ExperienceBulkCreate,
    db: Session = Depends(get_db)
):
    try:
        new_experiences = []
        for exp in data.experiences:
            new_experience = Experience(
                stud_uid=userID,
                company_name=exp.company_name,
                role=exp.role,
                duration=exp.duration,
                description=exp.description
            )
            db.add(new_experience)
            new_experiences.append(new_experience)
        db.commit()
        return {
            "message": "Experiences added successfully",
            "added_count": len(new_experiences)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))  
@router.get("/{userID}", response_model=List[ExperienceDetailsResponse])
def get_experience(userID: str,db: Session = Depends(get_db)):
    try:
        experience = db.query(Experience).filter(Experience.stud_uid == userID).all()
        return experience
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  
@router.put("/update/{userID}/{id}")
def update_experience(
    userID: str,
    id: int,
    data: ExperienceUpdate,
    db: Session = Depends(get_db)
):
    # 1️⃣ Find the experience for this user
    experience = db.query(Experience).filter(
        Experience.id == id,
        Experience.stud_uid == userID
    ).first()

    if not experience:
        raise HTTPException(
            status_code=404,
            detail="Experience not found"
        )

    # 2️⃣ Update fields
    experience.company_name = data.company_name
    experience.role = data.role
    experience.duration = data.duration
    experience.description = data.description

    # 3️⃣ Save
    db.commit()
    db.refresh(experience)

    return {
        "message": "Experience updated successfully",
        "experience": {
            "id": experience.id,
            "company_name": experience.company_name,
            "role": experience.role,
            "duration": experience.duration,
            "description": experience.description
        }
    }
@router.delete("/delete/{userID}/{id}")
def delete_experience(
    userID: str,
    id: int,
    db: Session = Depends(get_db)
):
    try:
        experience = db.query(Experience).filter(
            Experience.stud_uid == userID,
            Experience.id == id
        ).first()

        if not experience:
            raise HTTPException(status_code=404, detail="Experience not found")

        db.delete(experience)
        db.commit()

        return {"message": "Experience deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))