# Moo API - Financial Intelligence Assistant

Backend service for the Moo Financial Intelligence Assistant in COW Products Site.

## Features

- ✅ FastAPI backend with async support
- ✅ Claude 3.5 Sonnet integration
- ✅ Discipline-specific system prompts (4 disciplines)
- ✅ Mode-aware responses (Learning vs Project)
- 🚧 12 calculation tools (Coming soon)
- 🚧 RAG knowledge base with FAISS (Coming soon)

## Setup

### 1. Install Dependencies

```bash
cd apps/moo-api
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run Development Server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Or from the root directory:

```bash
uvicorn apps.moo-api.app.main:app --reload --port 8000
```

## API Endpoints

### Health Check
```
GET /health
```

Returns service status and Claude API availability.

### Chat
```
POST /chat
Content-Type: application/json

{
  "message": "Explain break-even analysis",
  "mode": "learning",
  "discipline": "management_accounting",
  "conversation_history": []
}
```

Returns AI response with discipline-specific insights.

### Get Disciplines
```
GET /disciplines
```

Returns metadata about all available disciplines.

## Disciplines

1. **Financial Accounting** (`financial_accounting`)
   - Color: #3b82f6 (Blue)
   - Focus: External reporting, GAAP/IFRS

2. **Cost Accounting** (`cost_accounting`)
   - Color: #C77A58 (Terra Cotta)
   - Focus: Product costing, overhead allocation

3. **Management Accounting** (`management_accounting`)
   - Color: #00A5CF (Cerulean)
   - Focus: Internal decisions, CVP analysis

4. **Financial Management** (`financial_management`)
   - Color: #10b981 (Emerald)
   - Focus: Capital budgeting, NPV/IRR

## Architecture

```
moo-api/
├── app/
│   ├── main.py              # FastAPI app and endpoints
│   ├── services/
│   │   ├── claude_service.py   # Claude API integration
│   │   ├── tools/              # Calculation tools (TODO)
│   │   └── rag/                # Knowledge base (TODO)
│   └── __init__.py
├── requirements.txt
├── .env.example
└── README.md
```

## Next Steps

- [ ] Implement 12 calculation tools
- [ ] Build RAG system with FAISS
- [ ] Add 40 knowledge base documents (10 per discipline)
- [ ] Connect frontend to backend API
- [ ] Add caching for common queries
- [ ] Implement rate limiting

## Integration with Products Site

Frontend at `apps/products-site` will connect to this API at `http://localhost:8000` in development.

Update MooPage.tsx to replace mock responses with API calls:

```typescript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: input,
    mode,
    discipline,
    conversation_history: messages
  })
});
```
