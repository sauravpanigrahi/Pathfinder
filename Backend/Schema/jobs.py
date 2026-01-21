from sqlalchemy import Column,Integer,String,ForeignKey,JSON
from sqlalchemy.dialects.mysql import json
from config.db import Base
from pydantic import BaseModel
from typing import Dict

class Jobs(Base):
    __tablename__="jobs"  # Changed to lowercase
    id=Column(Integer,autoincrement=True,primary_key=True,index=True)
    uid=Column(String(255),ForeignKey("companydetails.uid", ondelete="CASCADE"),nullable=False)  # Changed to match exact table name
    title=Column(String(255),nullable=False)
    company=Column(String(255),nullable=False)
    location=Column(String(255),nullable=False)
    type=Column(String(255),nullable=False)
    salary = Column(String(255), nullable=False)
    posted=Column(String(255),nullable=False)
    status=Column(String(255),nullable=False,default="Active")
    skills = Column(JSON, nullable=False) 
    description=Column(String(1000),nullable=False)
    
class JobsCreate(BaseModel):
    title: str
    uid: str
    company: str
    location: str
    type: str
    salary: str
    posted: str
    status: str = "Active"  # Default value
    skills: Dict
    description: str
class JobsResponse(BaseModel):
    id: int
    uid: str
    title: str
    company: str
    location: str
    type: str
    salary: str
    posted: str
    status: str
    skills: dict
    description: str
    class Config:
        from_attributes = True