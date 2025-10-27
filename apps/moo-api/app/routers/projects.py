"""
Projects API Endpoints
Handles creating and managing projects (folders for conversations)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..database.models import Project, Conversation, DisciplineEnum

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    discipline: str = "all"
    user_id: str

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    discipline: str
    created_at: datetime
    conversation_count: int

    class Config:
        from_attributes = True

@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project"""
    db_project = Project(
        user_id=project.user_id,
        name=project.name,
        description=project.description,
        discipline=DisciplineEnum[project.discipline]
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return ProjectResponse(
        id=db_project.id,
        name=db_project.name,
        description=db_project.description,
        discipline=db_project.discipline.value,
        created_at=db_project.created_at,
        conversation_count=0
    )

@router.get("/", response_model=List[ProjectResponse])
def list_projects(
    user_id: str,
    db: Session = Depends(get_db)
):
    """List all projects for a user"""
    projects = db.query(Project).filter(Project.user_id == user_id).order_by(Project.updated_at.desc()).all()

    return [
        ProjectResponse(
            id=proj.id,
            name=proj.name,
            description=proj.description,
            discipline=proj.discipline.value,
            created_at=proj.created_at,
            conversation_count=len(proj.conversations)
        )
        for proj in projects
    ]

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific project"""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        discipline=project.discipline.value,
        created_at=project.created_at,
        conversation_count=len(project.conversations)
    )

@router.put("/{project_id}")
def update_project(
    project_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update a project"""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if name:
        project.name = name
    if description is not None:
        project.description = description

    project.updated_at = datetime.utcnow()
    db.commit()

    return {"status": "updated"}

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Delete a project and all its conversations"""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {"status": "deleted"}
