import os
import uvicorn
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

# 1. КОНФИГУРАЦИЯ ЖӘНЕ ЛОГТАР
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VKO-TRAVEL-PRO")

app = FastAPI(
    title="VKO TRAVEL PRO API",
    description="Advanced Travel Backend by Bekzhan",
    version="2.0.0"
)

# 2. CORS БАПТАУЛАРЫ (Бұлсыз фронтенд қосылмайды!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production-да нақты доменді жазуға болады
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. AI КЛИЕНТІ
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 4. SYSTEM PROMPT (AI-дың "мінезін" анықтау)
SYSTEM_ROLE = """
SYSTEM ROLE: Kazakhstan Travel Architect (Developed by Bekzhan)
You are an expert guide specialized ONLY in Kazakhstan.
Your goal: Provide premium, safe, and exciting travel advice.

RESPONSE STRUCTURE:
📍 DESTINATION: Name of the place.
🗓 DURATION: Recommended days.
🗺 ITINERARY: Step-by-step plan.
💰 BUDGET: Estimated cost in KZT (₸).
🚗 TRANSPORT: How to get there.
🍽 FOOD: Local dishes to try.
📸 PHOTO SPOTS: Best locations for photos.
⚠️ SAFETY: Important warnings.
🌦 BEST SEASON: When to visit.

Always answer in the language used by the user (Kazakh, Russian, or English).
"""

# 5. ДЕРЕКТЕР МОДЕЛІ (Pydantic)
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048

# 6. ЭНДПОИНТТАР (API ROUTES)

@app.get("/")
async def root():
    """Бэкендтің тірі екенін тексеру"""
    return {
        "status": "online",
        "system": "VKO TRAVEL PRO",
        "architect": "Bekzhan",
        "endpoint": "/api/chat"
    }

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """AI Planner-мен байланыс орнату"""
    try:
        logger.info(f"Received chat request with {len(request.history)} messages")
        
        # Groq-қа сұраныс жіберу
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": SYSTEM_ROLE}] + [
                {"role": m.role, "content": m.content} for m in request.history
            ],
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            top_p=1,
            stream=False,
            stop=None,
        )

        response_content = completion.choices[0].message.content
        return {"response": response_content}

    except Exception as e:
        logger.error(f"AI Error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI сервері жауап бермеді. Қайта көріңіз.")

@app.get("/api/health")
async def health_check():
    """Render үшін Health Check"""
    return {"status": "healthy", "version": "2.0.1"}

# 7. ҚАТЕЛЕРДІ ӨҢДЕУ
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return {
        "error": True,
        "message": exc.detail,
        "architect_note": "Check your API keys and Render logs - Bekzhan"
    }

# 8. СЕРВЕРДІ ІСКЕ ҚОСУ
if __name__ == "__main__":
    # Локалды тексеру үшін: python main.py
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
