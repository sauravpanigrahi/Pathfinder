# routes/bookmark.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# from config.db import get_db
from Schema.bookmark import Bookmark
from Schema.bookmark import BookmarkCreate
from config.db import Sessionlocal
from Schema.jobs import Jobs
from Schema.student_job_match import StudentJobMatch
router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

# Toggle bookmark (save/unsave)
@router.post("/toggle")
def toggle_bookmark(data: BookmarkCreate, db: Session = Depends(get_db)):
    existing = db.query(Bookmark).filter(
        Bookmark.user_uid == data.user_uid,
        Bookmark.job_id == data.job_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False}

    new_bookmark = Bookmark(**data.dict())
    db.add(new_bookmark)
    db.commit()
    return {"saved": True}


# Check if job is saved
@router.get("/check/{user_uid}/{job_id}")
def check_bookmark(user_uid: str, job_id: int, db: Session = Depends(get_db)):
    exists = db.query(Bookmark).filter(
        Bookmark.user_uid == user_uid,
        Bookmark.job_id == job_id
    ).first()

    return {"saved": bool(exists)}


@router.get("/user/{user_uid}")
def get_saved_jobs(user_uid: str, db: Session = Depends(get_db)):
    results = (
        db.query(Jobs, StudentJobMatch.match_percentage)
        .join(Bookmark, Bookmark.job_id == Jobs.id)
        .outerjoin(
            StudentJobMatch,
            (StudentJobMatch.job_id == Jobs.id) &
            (StudentJobMatch.student_uid == user_uid)
        )
        .filter(Bookmark.user_uid == user_uid)
        .all()
    )

    # format clean response
    response = []
    for job, match in results:
        job_dict = job.__dict__
        job_dict["match_percentage"] = match
        job_dict.pop("_sa_instance_state", None)
        response.append(job_dict)

    return response

