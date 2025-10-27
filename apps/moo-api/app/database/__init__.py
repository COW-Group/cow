"""Database initialization and session management"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

# SQLite database path
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./moo.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

# Dependency for getting DB session
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
