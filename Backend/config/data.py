from sqlalchemy.orm import Session
from config.db import engine
from Schema.company import Company

allJobs = [
    { "id": 1, "title": "Frontend Developer", "company": "Aster Labs", "location": "Remote", "type": "Full-time", "salary": "$90k - $120k", "posted": "2d ago", "status": "open", "tags": ["React", "Tailwind", "TypeScript"] },
    { "id": 2, "title": "Backend Engineer", "company": "Nimbus Tech", "location": "Bengaluru", "type": "Full-time", "salary": "$100k - $140k", "posted": "1d ago", "status": "open", "tags": ["Node.js", "PostgreSQL", "REST"] },
    { "id": 3, "title": "Data Scientist", "company": "QuantIQ", "location": "Remote", "type": "Contract", "salary": "$60/hr", "posted": "5d ago", "status": "open", "tags": ["Python", "ML", "Pandas"] },
    { "id": 4, "title": "Mobile Developer", "company": "Wave Apps", "location": "Delhi", "type": "Full-time", "salary": "$80k - $110k", "posted": "3d ago", "status": "open", "tags": ["React Native", "iOS", "Android"] },
    { "id": 5, "title": "DevOps Engineer", "company": "SkyNet", "location": "Remote", "type": "Full-time", "salary": "$110k - $150k", "posted": "1d ago", "status": "open", "tags": ["AWS", "Kubernetes", "Terraform"] },
    { "id": 6, "title": "Product Designer", "company": "PixelWorks", "location": "Mumbai", "type": "Full-time", "salary": "$70k - $100k", "posted": "4d ago", "status": "open", "tags": ["Figma", "UX", "UI"] },
    { "id": 7, "title": "Full Stack Engineer", "company": "Crestflow", "location": "Remote", "type": "Full-time", "salary": "$120k - $160k", "posted": "6d ago", "status": "open", "tags": ["React", "Node.js", "GraphQL"] },
    { "id": 8, "title": "AI Engineer", "company": "NeuraAI", "location": "Hyderabad", "type": "Full-time", "salary": "$140k - $190k", "posted": "7h ago", "status": "open", "tags": ["LLMs", "Python", "MLOps"] },
    { "id": 9, "title": "Security Engineer", "company": "Sentri", "location": "Remote", "type": "Full-time", "salary": "$120k - $160k", "posted": "3d ago", "status": "open", "tags": ["AppSec", "Cloud", "Threat Modeling"] },
    { "id": 10, "title": "QA Automation", "company": "Testify", "location": "Pune", "type": "Full-time", "salary": "$70k - $95k", "posted": "2d ago", "status": "open", "tags": ["Cypress", "Selenium", "CI/CD"] },
]

def seed_data():
    with Session(engine) as session:
        for job in allJobs:
            company=Company(
                title=job["title"],
                company=job["company"],
                location=job["location"],
                type=job["type"],
                salary=job["salary"],
                posted=job["posted"],
                status=job["status"],
                skills=job["tags"]
            )
            session.add(company)
        session.commit()
    print("Data seeded successfully")

if __name__=="__main__":
    seed_data()    