from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class ProfileDetailsUpdate(BaseModel):
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    qualification: Optional[str] = None
    graduation_year: Optional[int] = None
    college_university: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    details: Optional[ProfileDetailsUpdate] = None
