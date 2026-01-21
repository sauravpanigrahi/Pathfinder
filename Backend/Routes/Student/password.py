from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from Schema.student import Users
from Routes.Student.authentication import (
    get_current_student,
    verify_password,
    hash_password,
    get_db,
)

router = APIRouter(
    prefix="/student",
    tags=["password"]
)

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

@router.put("/password/update")
async def update_password(
    password_data: PasswordUpdate,
    current_user: Users = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Update student password
    """
    # Validate that new password and confirm password match
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="New password and confirm password do not match"
        )
    
    # Validate password length
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters long"
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(
            status_code=401,
            detail="Current password is incorrect"
        )
    
    # Check if new password is same as current password
    if verify_password(password_data.new_password, current_user.password):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password"
        )
    
    # Update password
    try:
        current_user.password = hash_password(password_data.new_password)
        db.commit()
        db.refresh(current_user)
        
        return {
            "message": "Password updated successfully",
            "success": True
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update password: {str(e)}"
        )
