from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from config.db import Base, engine, Sessionlocal
from dotenv import load_dotenv
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from utils.rate_limiter import limiter

from Routes.Student.authentication import router as authentication_route
from Routes.Student.application import router as application_router
from Routes.Student.profile import router as profile_router
from Routes.Student.jobs import router as job_router
from Routes.Student.resume import router as resume_router
from Routes.Student.notifications import router as notification_router
from Routes.Student.project  import router as project_router
from Routes.Student.experience import router as experiences_router
from Routes.Student.apiquestion import router as apiquestion_router
from Routes.Student.review import router as smartreview_router
from Routes.Student.blog import router as blog_router
from Routes.Student.bookmark import router as bookmark_router
from Routes.Student.password import router as password_router

from Routes.Company.authentication import router as authentication_route_company
from Routes.Company.interview import router as interview_router_company
from Routes.Company.application import router as application_router_company
from Routes.Company.profile import router as profile_router_company
from Routes.Company.jobcreate import router as jobcreate_router_company
from Routes.Company.analytics import router as analytics_router_company
load_dotenv()
app = FastAPI()
# Load the .env file

# origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pathfinder-a2a7f.web.app",
                   "http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

app.state.limiter=limiter
app.add_exception_handler(RateLimitExceeded,_rate_limit_exceeded_handler)

app.include_router(authentication_route)
app.include_router(application_router)
app.include_router(profile_router)
app.include_router(job_router)
app.include_router(resume_router)
app.include_router(authentication_route_company)
app.include_router(interview_router_company)
app.include_router(application_router_company)
app.include_router(notification_router)
app.include_router(project_router)
app.include_router(experiences_router)
app.include_router(apiquestion_router)
app.include_router(profile_router_company)
app.include_router(smartreview_router)
app.include_router(jobcreate_router_company)
app.include_router(blog_router)
app.include_router(bookmark_router)
app.include_router(password_router)
app.include_router(analytics_router_company)

@app.get("/")
def home():
    return {"message": "Pathfinder API is running", "status": "healthy"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Explicit OPTIONS handler for CORS preflight
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"status": "ok"}
# if __name__ == "__main__":
#     uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True,debug=True)

