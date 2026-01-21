from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.blog import Blog,BlogCreate,BlogResponse
from Schema.student import Users

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
router=APIRouter(
    prefix="/student",
    tags=["blog"]
)
@router.post("/blog/form/{userID}", response_model=BlogResponse)
def blog_post(userID:str,details:BlogCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(Users).filter(Users.uid == userID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found for provided uid")
    # Create blog
    blog = Blog(
        stud_uid=userID,
        title=details.title,
        description=details.description,
        author_name=details.author_name
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

@router.get("/blog", response_model=list[BlogResponse])
def get_all_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blog).order_by(Blog.publish_date.desc()).all()
    return blogs

