from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.mysql import JSON
from config.db import Base

class CompanyQuestion(Base):
    __tablename__ = "company_questions"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), index=True)
    title = Column(String(255))
    difficulty = Column(String(50))
    description = Column(Text)
    approach = Column(Text)
    topics = Column(JSON)
    requirements = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
