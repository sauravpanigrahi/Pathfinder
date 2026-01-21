from sqlalchemy import Column, Integer, String, Text, ForeignKey
from config.db import Base
from pydantic import BaseModel
from typing import List, Optional

# SQLAlchemy Model
class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    stud_uid = Column(String(255), ForeignKey("users.uid", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    duration = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

# Create Schema
class ExperienceCreate(BaseModel):
    company_name: str
    role: str
    duration: str
    description: Optional[str] = None

# Bulk Create
class ExperienceBulkCreate(BaseModel):
    experiences: List[ExperienceCreate]
class ExperienceUpdate(BaseModel):
    company_name: str
    role: str
    duration: str
    description: str
# Response Schema
class ExperienceDetailsResponse(BaseModel):
    id: int
    company_name: str
    role: str
    duration: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Bulk Response
class ExperienceBulkResponse(BaseModel):
    message: str
    added_count: int
