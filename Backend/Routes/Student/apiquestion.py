
from fastapi import FastAPI, HTTPException, Request, logger,File, UploadFile,Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi import Depends, Cookie,Response
from config.db import Base, engine, Sessionlocal
from Schema.interview_questions import InterviewQuestion
from Schema.coding_questions import CodingQuestion
from Schema.company_question import CompanyQuestion
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["api"]
)
@router.get("/interview-questions")
def get_interview_questions(
    domain: str | None = None,
    difficulty: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(InterviewQuestion)

    if domain:
        query = query.filter(InterviewQuestion.domain == domain)

    if difficulty:
        query = query.filter(InterviewQuestion.difficulty == difficulty)

    return query.order_by(InterviewQuestion.created_at.desc()).all()
@router.get("/coding-questions")
def get_coding_questions(
    category: str | None = None,
    difficulty: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(CodingQuestion)

    if category:
        query = query.filter(CodingQuestion.category == category)

    if difficulty:
        query = query.filter(CodingQuestion.difficulty == difficulty)

    return query.order_by(CodingQuestion.created_at.desc()).all()

@router.get("/company-questions")
def get_company_questions(
    company_slug: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(CompanyQuestion)
        .filter(CompanyQuestion.company_name == company_slug)
        .order_by(CompanyQuestion.created_at.desc())
        .all()
    )