from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, DateTime
from config.db import Base
from datetime import datetime, date, timezone
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import relationship
import pytz


IST = pytz.timezone("Asia/Kolkata")

def ist_now():
    return datetime.now(timezone.utc).astimezone(IST)
class Applications(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    comp_uid = Column(String(255), ForeignKey('companydetails.uid', ondelete='CASCADE'))
    stud_uid = Column(String(255), ForeignKey('users.uid', ondelete='CASCADE'))
    Job_role = Column(String(255))
    Job_company = Column(String(255))
    Job_location = Column(String(255))
    Fullname = Column(String(255))
    Email = Column(String(255))
    phonenumber = Column(String(20))
    Dob = Column(Date)
    high_qualification = Column(String(255))
    college = Column(String(255))
    graduation_year = Column(Integer)
    prev_company = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    why_join = Column(Text)
    status = Column(String(50), default='pending', nullable=False)  # pending, accepted, rejected
    match_percentage = Column(Integer, nullable=True)  # AI-calculated match score
    created_at = Column(
        DateTime(timezone=True),
        default=ist_now,
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=ist_now,
        onupdate=ist_now,
        nullable=False
    )
    interview = relationship(
        "Interview",
        back_populates="application",
        uselist=False,
        cascade="all, delete-orphan"
    )
# Pydantic models
class ApplicationsCreate(BaseModel):
    comp_uid: str
    stud_uid: str
    Job_role: str
    Job_company: str
    Job_location: str
    Fullname: str
    Email: str
    phonenumber: str
    Dob: date
    high_qualification: str
    college: str
    graduation_year: int
    prev_company: Optional[str] = None
    job_title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    why_join: str
    status: Optional[str] = 'pending'
    match_percentage: Optional[int] = None

class ApplicationsResponse(BaseModel):
    id: int
    comp_uid: str
    stud_uid: str
    Job_role: str
    Job_company: str
    Job_location: str
    Fullname: str
    Email: str
    phonenumber: str
    Dob: date
    high_qualification: str
    college: str
    graduation_year: int
    prev_company: Optional[str] = None
    job_title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    why_join: Optional[str] = None
    status: Optional[str] = 'pending'
    match_percentage: Optional[int] = None
    created_at: datetime
    class Config:
        from_attributes = True  # ✅
