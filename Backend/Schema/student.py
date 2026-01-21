from sqlalchemy import Column,Integer,String,ForeignKey,JSON
from sqlalchemy.dialects.mysql import json
from config.db import Base
from pydantic import BaseModel
from sqlalchemy.orm import relationship
class Users(Base):
    __tablename__ = "users"  # Changed from "Users" to "users"
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    uid = Column(String(50), unique=True, nullable=False)  # <-- added uid
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False) 
    resume = relationship("Resume", back_populates="user", cascade="all, delete")
class UserCreate(BaseModel):
    uid: str        # <-- add this line
    name: str       # <-- add this line
    email: str
    password: str
class UserResponse(BaseModel):
    id: int
    uid: str
    name: str
    email: str
    model_config = {
        "from_attributes": True  # Updated from orm_mode to from_attributes
    }  # <-- updated for Pydantic v2

class UserLogin(BaseModel):
    email: str
    password: str
