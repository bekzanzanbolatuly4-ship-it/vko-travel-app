import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Баптау (Сен берген промпт осында)
SYSTEM_PROMPT = """
SYSTEM ROLE: Kazakhstan Travel Assistant
You are a professional AI travel assistant specialized exclusively in Kazakhstan.
Your goal is to provide practical, structured, and realistic travel guidance. 
1. Always detect and reply in the user's language.
2. If key information is missing, ask short clarifying questions.
3. Use the exact structure: 📍 Overview, 🗓 Duration, 🗺 Itinerary, 💰 Budget, 🚗 Transport, 🍽 Food, 📸 Photo Spots, ⚠ Safety, 🌦 Season.
"""

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    history: list

@app.post("/api/chat")
async def chat(request: ChatRequest):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + request.history
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )
    return {"response": completion.choices[0].message.content}
