from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

from config.db import Sessionlocal
from Schema.student import Users, UserCreate, UserLogin, UserResponse

# ===============================
# ENV & CONFIG
# ===============================
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

# Increase expiry to avoid sudden logout
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 1 day

COOKIE_NAME = "student_access_token"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/student",
    tags=["Student Auth"]
)

# ===============================
# DB DEPENDENCY
# ===============================
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# PASSWORD UTILS
# ===============================
def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ===============================
# JWT UTILS
# ===============================
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        print("JWT decode error:", e)
        return None

# ===============================
# AUTH DEPENDENCY (COOKIE BASED)
# ===============================
def get_current_student(
    access_token: str | None = Cookie(default=None, alias=COOKIE_NAME),
    db: Session = Depends(get_db)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(access_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    uid = payload.get("sub")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(Users).filter(Users.uid == uid).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# ===============================
# SIGNUP
# ===============================
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    if db.query(Users).filter(Users.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = Users(
        uid=user.uid,
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.uid})

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,          # True in production (HTTPS)
        samesite="lax",
        path="/",              # IMPORTANT
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return new_user

# ===============================
# LOGIN
# ===============================
@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_user.uid})

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,          # True in production
        samesite="lax",
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return db_user

# ===============================
# LOGOUT
# ===============================
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/"
    )
    return {"message": "Logged out successfully"}

# ===============================
# GET CURRENT USER
# ===============================
@router.get("/me", response_model=UserResponse)
def get_me(current_user: Users = Depends(get_current_student)):
    return current_user
