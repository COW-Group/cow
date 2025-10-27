"""
Database Models for Moo
Handles conversations, projects, and file uploads
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class DisciplineEnum(enum.Enum):
    """Financial discipline categories"""
    financial_accounting = "financial_accounting"
    cost_accounting = "cost_accounting"
    management_accounting = "management_accounting"
    financial_management = "financial_management"
    all = "all"

class ModeEnum(enum.Enum):
    """Chat modes"""
    learning = "learning"
    project = "project"

class Project(Base):
    """Projects for organizing conversations"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # From Firebase Auth
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    discipline = Column(SQLEnum(DisciplineEnum), default=DisciplineEnum.all)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    conversations = relationship("Conversation", back_populates="project", cascade="all, delete-orphan")

class Conversation(Base):
    """Individual chat conversations"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # From Firebase Auth (nullable for anonymous)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String, nullable=False)  # Auto-generated from first message
    mode = Column(SQLEnum(ModeEnum), default=ModeEnum.learning)
    discipline = Column(SQLEnum(DisciplineEnum), default=DisciplineEnum.all)
    is_anonymous = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    files = relationship("ConversationFile", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    """Individual messages in a conversation"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

class ConversationFile(Base):
    """Files uploaded to conversations"""
    __tablename__ = "conversation_files"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # "excel", "pdf", "markdown"
    file_path = Column(String, nullable=False)  # Path to stored file
    file_size = Column(Integer, nullable=False)  # Size in bytes
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    conversation = relationship("Conversation", back_populates="files")
