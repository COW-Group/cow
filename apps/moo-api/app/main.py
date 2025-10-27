"""
Moo Financial Intelligence Assistant - FastAPI Backend
COW Group - Products Site Integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Literal
import os
from datetime import datetime
from dotenv import load_dotenv

from .services import ClaudeService
from .database import init_db
from .routers import conversations, projects

# Load environment variables
load_dotenv()

# Initialize database
init_db()

app = FastAPI(
    title="Moo API",
    description="Financial Intelligence Assistant for COW Products Site",
    version="1.0.0"
)

# Include routers
app.include_router(conversations.router)
app.include_router(projects.router)

# Initialize Claude service
try:
    claude_service = ClaudeService()
    claude_available = True
except Exception as e:
    print(f"Warning: Claude service not initialized: {e}")
    claude_available = False

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4201",  # products-site dev
        "http://localhost:3000",
        "https://products.cow.io",  # production (update with actual domain)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Type definitions
Discipline = Literal["financial_accounting", "cost_accounting", "management_accounting", "financial_management", "all"]
Mode = Literal["learning", "project"]

class FileMetadata(BaseModel):
    name: str
    type: str
    size: int

class ChatRequest(BaseModel):
    message: str
    mode: Mode = "learning"
    discipline: Discipline = "all"
    conversation_history: Optional[List[dict]] = []
    attachments: Optional[List[FileMetadata]] = []

class ChatResponse(BaseModel):
    response: str
    discipline: Discipline
    mode: Mode
    timestamp: datetime
    tools_used: Optional[List[str]] = []
    sources: Optional[List[str]] = []

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Moo API",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "claude_api": "available" if claude_available else "unavailable",
        "api_key_set": bool(os.getenv("ANTHROPIC_API_KEY")),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for Moo

    Handles both Learning Mode and Project Mode requests
    Integrates with Claude API for responses
    """
    try:
        if not claude_available:
            raise HTTPException(
                status_code=503,
                detail="Claude API service is not available. Please check API key configuration."
            )

        # Get response from Claude
        claude_response = await claude_service.chat(
            message=request.message,
            discipline=request.discipline,
            mode=request.mode,
            conversation_history=request.conversation_history
        )

        # TODO: Integrate calculation tools
        # TODO: Add RAG knowledge retrieval

        return ChatResponse(
            response=claude_response["response"],
            discipline=request.discipline,
            mode=request.mode,
            timestamp=datetime.now(),
            tools_used=[],
            sources=[]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/disciplines")
async def get_disciplines():
    """Get available disciplines with metadata"""
    return {
        "disciplines": [
            {
                "id": "financial_accounting",
                "name": "Financial Accounting",
                "color": "#3b82f6",
                "icon": "FileText",
                "concepts": 8
            },
            {
                "id": "cost_accounting",
                "name": "Cost Accounting",
                "color": "#C77A58",
                "icon": "Calculator",
                "concepts": 8
            },
            {
                "id": "management_accounting",
                "name": "Management Accounting",
                "color": "#00A5CF",
                "icon": "BarChart3",
                "concepts": 8
            },
            {
                "id": "financial_management",
                "name": "Financial Management",
                "color": "#10b981",
                "icon": "Briefcase",
                "concepts": 6
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
