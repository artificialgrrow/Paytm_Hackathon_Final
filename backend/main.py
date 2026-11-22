"""
FastAPI Server for Paytm AI Hub
Provides unified REST API for Paytm ONE (Action Mode) & Paytm Resolve (Dispute Mode)
"""
import os
import sys

# Ensure repository root is on sys.path so 'backend' can be imported regardless of execution cwd
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.orchestrator import orchestrate_query
from backend.graph_orchestrator import execute_paytm_graph
from backend.agents.sarvam_agent import generate_sarvam_speech

app = FastAPI(
    title="Paytm AI Hub API",
    description="Backend Multi-Agent Service for Paytm Hackathon Mumbai",
    version="2.0.0"
)

# Enable CORS for frontend web clients (supports Vercel, localhost, and custom domains)
cors_env = os.getenv("CORS_ORIGINS", "")
custom_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
base_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://localhost:3000",
    "https://localhost:5173"
]
allowed_origins = list(set(base_origins + custom_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "paytm_user_01"
    language: Optional[str] = "auto"


class TTSRequest(BaseModel):
    text: str
    language_code: Optional[str] = "hi-IN"
    speaker: Optional[str] = "priya"


@app.get("/")
def root():
    return {
        "status": "online",
        "product": "Paytm AI Hub",
        "sponsor_integrations": ["SerpApi", "You.com", "Nexconn Chat SDK", "Sarvam AI"]
    }


@app.post("/api/tts")
def handle_tts(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    audio = generate_sarvam_speech(req.text, req.language_code, req.speaker)
    if audio:
        return {"status": "success", "audio_base64": audio}
    return {"status": "error", "message": "Failed to generate audio"}


@app.post("/api/chat")
def handle_chat_query(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        # 1. Execute LangGraph StateGraph pipeline backed by SQLite
        result = execute_paytm_graph(req.query, req.user_id, language=req.language or "auto")
        return result
    except Exception as e:
        print("LangGraph error, falling back to orchestrator:", e)
        # 2. Fallback to orchestrator if needed
        result = orchestrate_query(req.query, req.user_id, language=req.language or "auto")
        return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True, app_dir=ROOT_DIR)
