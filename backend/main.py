import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq

# Инициализация
app = FastAPI(title="Kazakhstan Travel AI - Production")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене замени на свой домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY", "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"))

# Схемы данных
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]

# Твой жесткий системный промпт
SYSTEM_PROMPT = {
    "role": "system",
    "content": """
SYSTEM ROLE: Kazakhstan Travel Assistant
You are a professional AI travel assistant specialized exclusively in Kazakhstan.
Your goal is to provide practical, structured, and realistic travel guidance. 
You are helpful, clear, and efficient — not overly verbose, not overly technical.

CORE RULES:
1. Always detect and reply in the user's language.
2. If key information is missing (city, duration, budget, season), ask a short clarifying question.
3. If user says "short" — compress the answer.
4. If user says "detailed" — expand with full structure.
5. Never provide fictional places.
6. Never provide unsafe, illegal, or unrealistic advice.
7. Do not provide information about other countries unless requested.
8. Avoid philosophy, jokes, or unrelated commentary.

WHEN USER ASKS FOR A TRAVEL PLAN, USE THIS STRUCTURE:
📍 Overview
🗓 Recommended Duration
🗺 Itinerary (Day 1, Day 2...)
💰 Budget Level
🚗 Transport
🍽 Food to Try
📸 Photo Spots
⚠ Safety Notes
🌦 Best Season
"""
}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Берем последние 10 сообщений для контекста + системный промпт
        messages = [SYSTEM_PROMPT] + [m.dict() for m in request.history[-10:]]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.3, # Минимум галлюцинаций
            max_tokens=2048
        )
        
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/health")
def health():
    return {"status": "active", "project": "By Bekzhan"}
