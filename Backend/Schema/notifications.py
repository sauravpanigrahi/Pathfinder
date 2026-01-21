from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from config.db import Base
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_uid = Column(String(255), ForeignKey('users.uid', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # 'application_accepted', 'interview_scheduled', 'new_job'
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    related_id = Column(Integer, nullable=True)  # ID of related application, interview, or job
    related_type = Column(String(50), nullable=True)  # 'application', 'interview', 'job'
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Additional metadata
    company_name = Column(String(255), nullable=True)
    job_role = Column(String(255), nullable=True)
    interview_datetime = Column(DateTime, nullable=True)
    meeting_link = Column(String(500), nullable=True)

# Pydantic models
class NotificationCreate(BaseModel):
    user_uid: str
    type: str
    title: str
    message: str
    related_id: Optional[int] = None
    related_type: Optional[str] = None
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    interview_datetime: Optional[datetime] = None
    meeting_link: Optional[str] = None

class NotificationResponse(BaseModel):
    id: int
    user_uid: str
    type: str
    title: str
    message: str
    related_id: Optional[int] = None
    related_type: Optional[str] = None
    is_read: bool
    created_at: datetime
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    interview_datetime: Optional[datetime] = None
    meeting_link: Optional[str] = None
    
    class Config:
        from_attributes = True

