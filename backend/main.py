from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from groq import Groq

app = FastAPI()

# КЕЗ КЕЛГЕН САЙТТАН СҰРАНЫС ҚАБЫЛДАУҒА РҰҚСАТ БЕРУ
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    lang: str

@app.get("/api/places")
async def get_places():
    try:
        with open("places.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

@app.post("/api/chat")
async def chat(req: ChatRequest):
    prompt = "Сен Шығыс Қазақстан бойынша кәсіби гидсің. Тек осы аймақ туралы жауап бер."
    if req.lang == "ru":
        prompt = "Ты профессиональный гид по Восточному Казахстану. Отвечай только про этот регион."
        
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": req.message}
        ],
        model="llama-3.3-70b-versatile",
    )
    return {"reply": chat_completion.choices[0].message.content}
