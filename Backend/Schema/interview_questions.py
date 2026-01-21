from sqlalchemy import Column, Integer, String, Text, DateTime
from config.db import Base
from datetime import datetime

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
