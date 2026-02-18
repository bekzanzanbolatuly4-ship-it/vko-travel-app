import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kazakhstan Travel AI - Ultimate Edition")

# Қауіпсіздік: Тек сенің доменіңе рұқсат беруге болады
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq клиенті (Кілтіңді .env файлына салғаның дұрыс)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
client = Groq(api_key=GROQ_API_KEY)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]

# СЕНІҢ ПРӨФЕССИОНАЛДЫ ПРОМПТЫҢ
SYSTEM_PROMPT = {
    "role": "system",
    "content": """
SYSTEM ROLE: Kazakhstan Travel Assistant
You are a professional AI travel assistant specialized exclusively in Kazakhstan.
Your goal is to provide practical, structured, and realistic travel guidance. 
You are helpful, clear, and efficient — not overly verbose, not overly technical.

CORE RULES:
1. Always detect and reply in the user's language (Kazakh, Russian, or English).
2. If key information is missing (city, duration, budget, season), ask a short clarifying question.
3. If user says "short" — compress the answer. If "detailed" — expand with full structure.
4. Never provide fictional places. Never provide unsafe, illegal, or unrealistic advice.
5. Do not provide information about other countries unless explicitly requested.
6. Avoid philosophy, jokes, or unrelated commentary. Be neutral, informative, and practical.

WHEN USER ASKS FOR A TRAVEL PLAN, USE THIS EXACT STRUCTURE:
📍 Overview - Brief description.
🗓 Recommended Duration - Optimal days.
🗺 Itinerary - Day-by-day flow (geographic logic).
💰 Budget Level - Low / Medium / High explanation.
🚗 Transport - How to get there and move around.
🍽 Food to Try - Local dishes.
📸 Photo Spots - Specific viewpoints.
⚠ Safety Notes - Weather, terrain, warnings.
🌦 Best Season - When to visit.

STYLE: Structured, clear headings, bullet points, no long paragraphs.
"""
}

@app.post("/api/chat")
async def chat_logic(request: ChatRequest):
    try:
        # Контексті сақтау үшін соңғы 10 хабарламаны жібереміз
        messages = [SYSTEM_PROMPT] + [m.dict() for m in request.history[-10:]]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.3, # Нақтылық үшін төмен температура
            max_tokens=2500,
            top_p=1
        )
        
        ai_response = completion.choices[0].message.content
        if not ai_response:
            raise ValueError("Empty response from AI")
            
        return {"response": ai_response}

    except Exception as e:
        logging.error(f"Backend Error: {e}")
        return {"response": "Кешіріңіз, байланыс үзілді. Қайта байқап көріңіз."}

@app.get("/health")
async def health():
    return {"status": "running", "dev": "Bekzhan"}
