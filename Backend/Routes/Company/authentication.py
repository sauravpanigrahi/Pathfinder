from fastapi import HTTPException, APIRouter, Depends, Response, Cookie
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

from config.db import Sessionlocal
from Schema.companysignup import CompanyDetails, CompanyCreate, CompanyResponse, CompanyLogin

load_dotenv()

# ===============================
# CONFIG
# ===============================
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 1 day
COOKIE_NAME = "company_access_token"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/company",
    tags=["Company Auth"]
)

# ===============================
# DB
# ===============================
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# PASSWORD
# ===============================
def get_password_hash(password: str):
    return pwd_context.hash(password[:72])

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# ===============================
# JWT
# ===============================
def create_access_token(data: dict):
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
        print("JWT error:", e)
        return None

# ===============================
# AUTH DEPENDENCY
# ===============================
def get_current_company(
    access_token: str | None = Cookie(default=None, alias=COOKIE_NAME),
    db: Session = Depends(get_db)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(access_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    uid = payload.get("sub")
    company = db.query(CompanyDetails).filter(CompanyDetails.uid == uid).first()

    if not company:
        raise HTTPException(status_code=401, detail="Company not found")

    return company

# ===============================
# SIGNUP
# ===============================
@router.post("/signup", response_model=CompanyResponse)
def signup_company(
    company: CompanyCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    if db.query(CompanyDetails).filter(
        CompanyDetails.workEmail == company.workEmail
    ).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    db_company = CompanyDetails(
        uid=company.uid,
        workEmail=company.workEmail,
        password=get_password_hash(company.password),
        companyName=company.companyName,
        website=company.website,
        industry=company.industry,
        companySize=company.companySize,
        locations=company.locations,
        description=company.description,
        contactNumber=company.contactNumber,
        foundedYear=company.foundedYear,
        logoURL=company.logoURL[:255] if company.logoURL else None,
        coverImageURL=company.coverImageURL[:255] if company.coverImageURL else None,
        linkedinURL=company.linkedinURL[:255] if company.linkedinURL else None,
        address=company.address,
    )

    db.add(db_company)
    db.commit()
    db.refresh(db_company)

    token = create_access_token({"sub": db_company.uid})

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,       # True in production
        samesite="lax",
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return db_company

# ===============================
# LOGIN
# ===============================
@router.post("/login", response_model=CompanyResponse)
def login_company(
    company: CompanyLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    db_company = db.query(CompanyDetails).filter(
        CompanyDetails.workEmail == company.workEmail
    ).first()

    if not db_company or not verify_password(company.password, db_company.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_company.uid})

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return db_company

# ===============================
# LOGOUT
# ===============================
@router.post("/logout")
def logout_company(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Logged out successfully"}

# ===============================
# CURRENT COMPANY
# ===============================
@router.get("/me", response_model=CompanyResponse)
def get_me(current_company: CompanyDetails = Depends(get_current_company)):
    return current_company

# ===============================
# GET BY UID (PUBLIC)
# ===============================
@router.get("/{uid}", response_model=CompanyResponse)
def get_company_by_uid(uid: str, db: Session = Depends(get_db)):
    company = db.query(CompanyDetails).filter(
        CompanyDetails.uid == uid
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
