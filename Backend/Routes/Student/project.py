from fastapi import  HTTPException,APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from config.db import Sessionlocal
from Schema.project import ProjectDetails,ProjectDetailsResponse,ProjectDetailsBulkCreate,ProjectBulkResponse,ProjectUpdate

from typing import List
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/project",
    tags=["project"]
)
@router.post("/add/{userID}",  response_model=ProjectBulkResponse)
def add_project(
    userID: str,
    data: ProjectDetailsBulkCreate,
    db: Session = Depends(get_db)
):
    try:
        new_projects = []
        for project in data.projects:
            new_project = ProjectDetails(
                stud_uid=userID,
                Title=project.Title,
                description=project.description,
                tech_stack=project.tech_stack,
                link=project.link
            )
            db.add(new_project)
            new_projects.append(new_project)

        db.commit()

        return {
            "message": "Projects added successfully",
            "added_count": len(new_projects)
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/{userID}", response_model=List[ProjectDetailsResponse])
def get_projects(userID: str,db: Session = Depends(get_db)):
    try:
        projects = db.query(ProjectDetails).filter(ProjectDetails.stud_uid == userID).all()
        return projects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  
@router.put("/update/{userID}/{id}")
def update_project(
    userID: str,
    id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db)
):
    project = db.query(ProjectDetails).filter(
        ProjectDetails.stud_uid == userID,
        ProjectDetails.id == id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.Title = data.Title
    project.description = data.description
    project.tech_stack = data.tech_stack
    project.link = data.link

    db.commit()
    db.refresh(project)

    return {
        "message": "Project updated successfully",
        "project": {
            "id": project.id,
            "Title": project.Title,
            "description": project.description,
            "tech_stack": project.tech_stack,
            "link": project.link
        }
    }
@router.delete("/delete/{userID}/{id}")
def delete_project(
    userID: str,
    id: int,
    db: Session = Depends(get_db)
):
    try:
        project = db.query(ProjectDetails).filter(
            ProjectDetails.stud_uid == userID,
            ProjectDetails.id == id
        ).first()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        db.delete(project)
        db.commit()

        return {"message": "Project deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))    