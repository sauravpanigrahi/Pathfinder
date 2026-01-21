from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from datetime import datetime
from config.db import Base
from pydantic import BaseModel
from typing import Literal,Optional
from sqlalchemy.orm import relationship


class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(
        Integer,
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False
    )
    student_uid = Column(
        String(255),
        ForeignKey("users.uid", ondelete="CASCADE"),
        nullable=False
    )
    company_uid = Column(
        String(255),
        ForeignKey("companydetails.uid", ondelete="CASCADE"),
        nullable=False
    )
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)

    interview_datetime = Column(DateTime, nullable=False)

    platform = Column(
        Enum("google_meet", "zoom", "offline", name="interview_platform"),
        nullable=False
        
    )

    meeting_link = Column(String(500))

    status = Column(
        Enum("scheduled", "rescheduled", "completed", "cancelled", name="interview_status"),
        default="scheduled"
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Applications", back_populates="interview")
    student = relationship("Users", foreign_keys=[student_uid])
    company = relationship("CompanyDetails", foreign_keys=[company_uid])

class InterviewStatusUpdate(BaseModel):
    status: Literal[
        "scheduled",
        "rescheduled",
        "completed",
        "cancelled"
    ]
    interview_datetime: Optional[datetime] = None