import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Frontend-пен байланыс орнату үшін
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY", "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"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]

@app.get("/")
def read_root():
    return {"status": "VKO Travel Backend is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        messages = [
            {"role": "system", "content": "Сен Қазақстан бойынша кәсіби саяхатшы-гидсің. Жауаптарыңды әдемі, құрылымды және қазақ тілінде бер."}
        ] + [m.dict() for m in request.history]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
