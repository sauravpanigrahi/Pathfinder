from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from config.db import Base
from pydantic import BaseModel
from typing import Optional
from datetime import date

class Details(Base):
    __tablename__ = "details"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)  # details table id
    uid = Column(String(50), ForeignKey("users.uid", ondelete="CASCADE"), nullable=False)        # links to Users.uid
    phone_number = Column(String(20), nullable=False)         # compulsory
    date_of_birth = Column(Date, nullable=False)              # compulsory
    address = Column(String(255), nullable=False)             # compulsory
    bio = Column(Text, nullable=True)                          # optional
    qualification = Column(String(100), nullable=False)       # compulsory
    graduation_year = Column(Integer, nullable=False)         # compulsory
    college_university = Column(String(255), nullable=False) # compulsory
    linkedin_url = Column(String(255), nullable=True)         # optional
    github_url = Column(String(255), nullable=True)
    profile_picture = Column(String(500), nullable=True)  # ✅ ADD THIS
class StudentCreate(BaseModel):
    uid: str  # foreign key to Users.uid
    phone_number: str
    date_of_birth: date
    address: str
    qualification: str
    graduation_year: int
    college_university: str
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class StudentResponse(BaseModel):
    id: int                  # details table ka auto-generated id
    uid: str                 # linked Users.uid
    phone_number: str
    date_of_birth: date
    address: str
    qualification: str
    graduation_year: int
    college_university: str

    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    profile_picture: Optional[str] = None  # ✅ ADD
    class Config:
        from_attributes = True  # important to return SQLAlchemy models directly as response
