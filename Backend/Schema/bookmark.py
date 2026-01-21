# models/bookmark.py
from sqlalchemy import Column, Integer, String, ForeignKey
from config.db import Base
# schemas/bookmark.py
from pydantic import BaseModel
class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_uid = Column(String(255),ForeignKey("users.uid", ondelete="CASCADE"), index=True )
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))

class BookmarkCreate(BaseModel):
    user_uid: str
    job_id: int

class BookmarkResponse(BaseModel):
    id: int
    user_uid: str
    job_id: int

    class Config:
        from_attributes = True
