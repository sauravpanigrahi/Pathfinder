from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase.firbaseinit import auth  # Ensure Firebase Admin is initialized and auth is available

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        # print("Decoded Firebase token:", decoded_token)
        uid = decoded_token['uid']
        # print("Authenticated UID:", uid)  # 🔹 Print UID
        return uid
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
