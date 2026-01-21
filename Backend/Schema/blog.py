from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from config.db import Base
from datetime import datetime
from pydantic import BaseModel


class Blog(Base):
    __tablename__ = "blog"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    stud_uid = Column(String(255),ForeignKey("users.uid", ondelete="CASCADE"),nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    author_name = Column(String(100), nullable=False)
    publish_date = Column(DateTime, default=datetime.utcnow)
    update_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BlogCreate(BaseModel):
    title: str
    description: str
    author_name: str
class BlogResponse(BaseModel):
    id: int
    stud_uid: str
    title: str
    description: str
    author_name: str
    publish_date: datetime
    update_date: datetime

    class Config:
        from_attributes = True
