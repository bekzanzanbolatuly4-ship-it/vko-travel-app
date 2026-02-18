import os
from fastapi import FastAPI, HTTPException
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

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Сенің арнайы System Role промптың
SYSTEM_PROMPT = """
SYSTEM ROLE: Kazakhstan Travel Assistant
You are a professional AI travel assistant specialized exclusively in Kazakhstan.
Structure: 📍 Overview, 🗓 Duration, 🗺 Itinerary, 💰 Budget, 🚗 Transport, 🍽 Food, 📸 Photo Spots, ⚠ Safety, 🌦 Season.
Reply in the user's language.
"""

class ChatRequest(BaseModel):
    history: list

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + request.history
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health(): return {"status": "VKO PRO Active"}
