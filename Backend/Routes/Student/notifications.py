from fastapi import HTTPException,APIRouter
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import  Sessionlocal
from Schema.notifications import Notification

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)
@router.get("/{userUID}")
def get_notifications(userUID: str, db: Session = Depends(get_db)):
    """
    Get all notifications for a user, ordered by most recent first.
    """
    try:
        notifications = db.query(Notification).filter(
            Notification.user_uid == userUID
        ).order_by(Notification.created_at.desc()).all()
        return jsonable_encoder(notifications)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")

@router.get("/{userUID}/unread-count")
def get_unread_count(userUID: str, db: Session = Depends(get_db)):
    """
    Get count of unread notifications for a user.
    """
    try:
        count = db.query(Notification).filter(
            Notification.user_uid == userUID,
            Notification.is_read == False
        ).count()
        return {"unread_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get unread count: {str(e)}")

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    """
    Mark a notification as read.
    """
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return {"message": "Notification marked as read", "notification": jsonable_encoder(notification)}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to mark notification as read: {str(e)}")

@router.patch("/{userUID}/read-all")
def mark_all_notifications_read(userUID: str, db: Session = Depends(get_db)):
    """
    Mark all notifications as read for a user.
    """
    try:
        notifications = db.query(Notification).filter(
            Notification.user_uid == userUID,
            Notification.is_read == False
        ).all()
        
        for notification in notifications:
            notification.is_read = True
        
        db.commit()
        return {"message": f"Marked {len(notifications)} notifications as read"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to mark all notifications as read: {str(e)}")

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    """
    Delete a notification.
    """
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        db.delete(notification)
        db.commit()
        return {"message": "Notification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete notification: {str(e)}")