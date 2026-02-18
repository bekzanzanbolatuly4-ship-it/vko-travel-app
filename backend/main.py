import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from groq import Groq

app = FastAPI()

# Қатаң CORS баптауы (бәріне рұқсат беру, бірақ қауіпсіз)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API KEY (Серверде сақталғаны дұрыс, бірақ сен үшін осында қалдырдым)
client = Groq(api_key="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")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[Message]

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Промпты нығайту
        messages = [
            {"role": "system", "content": "You are a professional travel assistant. Reply in the same language as the user."}
        ]
        
        for msg in request.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.5
        )
        
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        # Сервер құлап қалмас үшін қатені ұстаймыз
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"status": "online"}
