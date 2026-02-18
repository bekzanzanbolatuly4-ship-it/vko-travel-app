from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from groq import Groq

app = FastAPI()

# Frontend (Vercel) серверіне рұқсат беру
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq Клиенті - Сенің API кілтің
client = Groq(api_key="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")

class ChatRequest(BaseModel):
    message: str

# 1. Сервердің тірі екенін тексеру
@app.get("/")
async def root():
    return {"status": "active", "agent": "Kazakhstan Travel AI"}

# 2. Жергілікті деректер қорын алу (places.json)
@app.get("/api/places")
async def get_places():
    try:
        file_path = os.path.join(os.path.dirname(__file__), "places.json")
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"error": "File not found", "details": str(e)}

# 3. ЕҢ МАҢЫЗДЫСЫ: Ақылды ИИ Чат
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # СЕН БЕРГЕН КӘСІБИ SYSTEM ROLE
        system_instructions = """
        SYSTEM ROLE: Kazakhstan Travel Assistant
        You are a professional AI travel assistant specialized exclusively in Kazakhstan.
        Your goal is to provide practical, structured, and realistic travel guidance.

        CORE RULES:
        1. Always detect and reply in the user's language (Kazakh, Russian, or English).
        2. If key information is missing (city, duration, budget), ask a short clarifying question.
        3. Structure travel plans with: 📍 Overview, 🗓 Duration, 🗺 Itinerary, 💰 Budget, 🚗 Transport, 🍽 Food, 📸 Photo Spots.
        4. Never provide fictional places.
        5. Stay neutral, informative, and practical. No long-winded philosophy.
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7, # Шығармашылық пен нақтылық тепе-теңдігі
            max_tokens=2048
        )
        
        return {"response": completion.choices[0].message.content}
    
    except Exception as e:
        print(f"Error: {e}")
        return {"response": "Кешіріңіз, қазір байланыс орнату мүмкін болмады. Серверді тексеріп көріңіз."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
