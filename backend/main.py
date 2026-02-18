from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from groq import Groq

app = FastAPI()

# CORS - Vercel-мен байланыс үшін
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API кілтін Render-ден аламыз
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"status": "ok", "message": "VKO Travel API is running!"}

@app.get("/api/places")
async def get_places():
    try:
        # Папка ішіндегі файлды дұрыс табу
        file_path = os.path.join(os.path.dirname(__file__), "places.json")
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return []

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Сен Шығыс Қазақстанның кәсіби гидісің. Пайдаланушыға көрікті жерлер туралы қызықты, эмоционалды және пайдалы мәлімет бер. Қазақ тілінде сөйле."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": "Кешіріңіз, қазір байланыс қиындап тұр. Сәлден соң қайталаңыз."}
