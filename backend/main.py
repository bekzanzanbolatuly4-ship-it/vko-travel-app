
import os
import uuid
import logging
from typing import List, Literal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from groq import Groq, GroqError

# --- Configuration ---

class Settings(BaseSettings):
    GROQ_API_KEY: str
    ALLOWED_ORIGINS: List[str] = ["https://vko-travel-app.vercel.app"]
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    MAX_HISTORY_LENGTH: int = 10
    REQUEST_TIMEOUT: float = 30.0

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# --- Logging ---

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s [RequestID: %(request_id)s]"
)
logger = logging.getLogger("production_backend")

# --- Schemas ---

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=2000)

    @validator("content")
    def sanitize_content(cls, v):
        return v.strip()

class ChatRequest(BaseModel):
    history: List[Message]

# --- State & Rate Limiting ---

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = Groq(api_key=settings.GROQ_API_KEY)
    yield

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# --- Logic ---

SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You are a professional Kazakhstan Travel Assistant by BEKZHAN. "
        "Strictly provide factual information about travel in Kazakhstan. "
        "Structure: 📍 Overview, 🗓 Duration, 🗺 Itinerary, 💰 Budget, 🚗 Transport. "
        "Language: Match the user's input language. Be concise."
    )
}

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

@app.post("/api/chat", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def chat(request: Request, payload: ChatRequest):
    request_id = request.state.request_id
    
    try:
        # Hardened history trimming
        trimmed_history = payload.history[-settings.MAX_HISTORY_LENGTH:]
        
        messages = [SYSTEM_PROMPT]
        for msg in trimmed_history:
            messages.append(msg.dict())

        logger.info(f"Processing chat request with {len(messages)} total messages.", extra={"request_id": request_id})

        completion = app.state.client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            temperature=0.3,
            max_tokens=1500,
            timeout=settings.REQUEST_TIMEOUT
        )

        response_text = completion.choices[0].message.content
        if not response_text:
            raise ValueError("Upstream AI returned empty content")

        return {"response": response_text}

    except GroqError as e:
        logger.error(f"Groq API Error: {str(e)}", extra={"request_id": request_id})
        raise HTTPException(status_code=502, detail="AI Gateway unavailable")
    except Exception as e:
        logger.error(f"Internal Error: {str(e)}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail="Service encountered an internal error")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
