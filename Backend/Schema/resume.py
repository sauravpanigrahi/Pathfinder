from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime  # <-- Add DateTime here
from datetime import datetime
from config.db import Base
from pydantic import BaseModel
from sqlalchemy.orm import relationship
class Resume(Base):
    __tablename__ = "resume"
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    uid = Column(String(255), ForeignKey("users.uid", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    secure_url = Column(Text, nullable=False)
    public_id = Column(String(500), nullable=False)
    format = Column(String(50), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)  # ✅ Correct
    user = relationship("Users", back_populates="resume")