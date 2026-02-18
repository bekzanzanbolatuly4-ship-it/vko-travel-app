from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from groq import Groq

app = FastAPI()

# Frontend (Vercel) серверге қосылуы үшін рұқсат беру
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Render-де сақталған API кілтін алу
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

# 1. Сервердің жұмысын тексеру жолы
@app.get("/")
async def root():
    return {"status": "ok", "message": "VKO Travel API is running!"}

# 2. Суреттер мен деректерді алу жолы
@app.get("/api/places")
async def get_places():
    try:
        file_path = os.path.join(os.path.dirname(__file__), "places.json")
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return []

# 3. ИИ-мен сөйлесу жолы
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Сен Шығыс Қазақстанның гидісің. Қазақша жауап бер."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": "Қате: ИИ-мен байланыс жоқ."}
