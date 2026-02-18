import os
import logging
import uuid
from typing import List, Literal
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv

# Конфигурация
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BekzhanTravelAPI")

app = FastAPI(title="Kazakhstan Travel AI by Bekzhan")

# Қауіпсіздік баптаулары
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Продакшнда нақты доменді жазу керек
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq клиенті
try:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    logger.error(f"API Key Error: {e}")

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=2000)

class ChatRequest(BaseModel):
    history: List[Message]

# СЕНІҢ ПРӨФЕССИОНАЛДЫ ПРОМПТЫҢ
SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "SYSTEM ROLE: Kazakhstan Travel Assistant\n"
        "You are a professional AI travel assistant specialized exclusively in Kazakhstan.\n"
        "Your goal is to provide practical, structured, and realistic travel guidance.\n"
        "Rules: Reply in user's language. Never provide fictional places. Be neutral and practical.\n"
        "Structure: 📍 Overview, 🗓 Duration, 🗺 Itinerary, 💰 Budget, 🚗 Transport, 🍽 Food, 📸 Photo Spots, ⚠ Safety, 🌦 Best Season."
    )
}

@app.post("/api/chat")
async def chat_handler(request: ChatRequest):
    req_id = str(uuid.uuid4())[:8]
    logger.info(f"[{req_id}] Processing request...")
    
    try:
        # Контекстті шектеу (Token optimization)
        trimmed_history = request.history[-10:]
        messages = [SYSTEM_PROMPT] + [m.model_dump() for m in trimmed_history]

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.35, # Галлюцинацияны азайту
            max_tokens=2048,
            top_p=1
        )
        
        response_content = completion.choices[0].message.content
        if not response_content:
            raise ValueError("AI returned empty string")

        logger.info(f"[{req_id}] Success.")
        return {"response": response_content}

    except Exception as e:
        logger.error(f"[{req_id}] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Серверде ақау шықты. Қайта байқап көріңіз."
        )

@app.get("/health")
def health():
    return {"status": "online", "developer": "Bekzhan"}
