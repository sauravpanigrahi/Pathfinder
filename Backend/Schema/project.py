from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from config.db import Base
from pydantic import BaseModel
from typing import List, Optional
class ProjectDetails(Base):
    __tablename__ = "projectdetails"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    stud_uid = Column(
        String(255),
        ForeignKey("users.uid", ondelete="CASCADE"),
        nullable=False
    )
    Title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(255), nullable=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProjectDetailsCreate(BaseModel):
    Title: str
    description: str
    tech_stack: str
    link: Optional[str] = None

class ProjectDetailsBulkCreate(BaseModel):
    projects: List[ProjectDetailsCreate]
class ProjectUpdate(BaseModel):
    Title: str
    description: str
    tech_stack: str
    link: Optional[str] = None
class ProjectDetailsResponse(BaseModel):
    id: int
    Title: str
    description: str
    tech_stack: str
    link: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectBulkResponse(BaseModel):
    message: str
    added_count: int
