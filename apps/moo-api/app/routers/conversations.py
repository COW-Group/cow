"""
Conversation API Endpoints
Handles saving, loading, and managing chat conversations
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..database.models import Conversation, Message, Project, DisciplineEnum, ModeEnum

router = APIRouter(prefix="/conversations", tags=["conversations"])

# Pydantic models for API
class MessageCreate(BaseModel):
    role: str
    content: str

class ConversationCreate(BaseModel):
    title: Optional[str] = None
    mode: str = "learning"
    discipline: str = "all"
    project_id: Optional[int] = None
    user_id: Optional[str] = None
    messages: List[MessageCreate] = []

class ConversationResponse(BaseModel):
    id: int
    title: str
    mode: str
    discipline: str
    is_anonymous: bool
    created_at: datetime
    updated_at: datetime
    message_count: int

    class Config:
        from_attributes = True

class ConversationDetail(BaseModel):
    id: int
    title: str
    mode: str
    discipline: str
    is_anonymous: bool
    created_at: datetime
    messages: List[dict]

    class Config:
        from_attributes = True

@router.post("/", response_model=ConversationResponse)
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new conversation (anonymous or authenticated)
    """
    # Auto-generate title from first message if not provided
    title = conversation.title
    if not title and conversation.messages:
        title = conversation.messages[0].content[:50] + "..." if len(conversation.messages[0].content) > 50 else conversation.messages[0].content
    else:
        title = "New Conversation"

    # Create conversation
    db_conversation = Conversation(
        user_id=conversation.user_id,
        project_id=conversation.project_id,
        title=title,
        mode=ModeEnum[conversation.mode],
        discipline=DisciplineEnum[conversation.discipline],
        is_anonymous=conversation.user_id is None
    )

    db.add(db_conversation)
    db.flush()  # Get the ID

    # Add messages
    for msg in conversation.messages:
        db_message = Message(
            conversation_id=db_conversation.id,
            role=msg.role,
            content=msg.content
        )
        db.add(db_message)

    db.commit()
    db.refresh(db_conversation)

    return ConversationResponse(
        id=db_conversation.id,
        title=db_conversation.title,
        mode=db_conversation.mode.value,
        discipline=db_conversation.discipline.value,
        is_anonymous=db_conversation.is_anonymous,
        created_at=db_conversation.created_at,
        updated_at=db_conversation.updated_at,
        message_count=len(conversation.messages)
    )

@router.get("/{conversation_id}", response_model=ConversationDetail)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific conversation with all messages"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()

    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        mode=conversation.mode.value,
        discipline=conversation.discipline.value,
        is_anonymous=conversation.is_anonymous,
        created_at=conversation.created_at,
        messages=[
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]
    )

@router.get("/", response_model=List[ConversationResponse])
def list_conversations(
    user_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List conversations for a user"""
    query = db.query(Conversation)

    if user_id:
        query = query.filter(Conversation.user_id == user_id)

    conversations = query.order_by(Conversation.updated_at.desc()).offset(skip).limit(limit).all()

    return [
        ConversationResponse(
            id=conv.id,
            title=conv.title,
            mode=conv.mode.value,
            discipline=conv.discipline.value,
            is_anonymous=conv.is_anonymous,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=len(conv.messages)
        )
        for conv in conversations
    ]

@router.post("/{conversation_id}/messages")
def add_message(
    conversation_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """Add a message to an existing conversation"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db_message = Message(
        conversation_id=conversation_id,
        role=message.role,
        content=message.content
    )

    db.add(db_message)
    conversation.updated_at = datetime.utcnow()
    db.commit()

    return {"status": "success", "message_id": db_message.id}

@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    """Delete a conversation and all its messages"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conversation)
    db.commit()

    return {"status": "deleted"}
