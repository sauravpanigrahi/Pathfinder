# Schema/student_job_match.py
from sqlalchemy import Column, Integer, String ,ForeignKey, DateTime
from config.db import Base
from datetime import datetime

class StudentJobMatch(Base):
    __tablename__ = "student_job_match"

    id = Column(Integer, primary_key=True)
    student_uid = Column(String(255), index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    match_percentage = Column(Integer, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
