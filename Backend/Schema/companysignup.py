from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.mysql import JSON
from datetime import datetime
from config.db import Base
from pydantic import BaseModel
from typing import Optional


class CompanyDetails(Base):
    __tablename__ = "companydetails"
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    uid = Column(String(255), nullable=False, index=True)
    workEmail = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    companyName = Column(String(255), nullable=False)
    website = Column(Text, nullable=False)  # Changed from String
    industry = Column(String(255), nullable=False)
    companySize = Column(String(255), nullable=False)
    locations = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    # 🆕 Additional Fields
    foundedYear = Column(Integer, nullable=True)
    logoURL = Column(Text)  # Changed from String
    coverImageURL = Column(Text)  # Changed from String
    linkedinURL = Column(Text)  # Changed from String
    contactNumber = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CompanyCreate(BaseModel):
    uid: str
    workEmail: str
    password: str
    companyName: str
    website: str
    industry: str
    companySize: str
    locations: str
    description: str
    foundedYear: int | None = None
    logoURL: str | None = None
    coverImageURL: str | None = None
    linkedinURL: str | None = None
    contactNumber: str | None = None
    address: str | None = None


class CompanyLogin(BaseModel):
    workEmail: str
    password: str
class CompanyResponseLogin(BaseModel): 
    workEmail: str
    password: str

class CompanyResponse(BaseModel):
    id: int
    uid: str
    workEmail: str
    companyName: str
    website: str
    industry: str
    companySize: str
    locations: str
    description: str
    foundedYear: int | None = None
    logoURL: str | None = None
    coverImageURL: str | None = None
    linkedinURL: str | None = None
    contactNumber: str | None = None
    address: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
class CompanyUpdate(BaseModel):
    companyName: str | None = None
    industry: str | None = None
    companySize: str | None = None
    locations: str | None = None
    
    address: str | None = None
    contactNumber: str | None = None
    workEmail: str | None = None
    website: str | None = None
    foundedYear: int | None = None
    description: str | None = None
    logoURL: str | None = None
    coverImageURL: str | None = None
    linkedinURL: Optional[str] = None
    # twitter: Optional[str] = None
    # facebook: Optional[str] = None

    class Config:
        from_attributes = True
