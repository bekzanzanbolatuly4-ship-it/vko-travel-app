import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import uvicorn

app = FastAPI()

# CORS шектеулерін алып тастау (Браузер қате бермеуі үшін)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Өзіңнің API кілтің
client = Groq(api_key="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")

class ChatRequest(BaseModel):
    message: str
    lang: str

@app.get("/api/places")
async def get_places():
    try:
        with open('places.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

@app.post("/api/chat")
async def chat(data: ChatRequest):
    # СЕНІҢ ПРЕМІУМ "STRICT" ПРОМПТЫҢ
    system_instruction = f"""
    # You are a professional AI travel guide specialized ONLY in Kazakhstan,your name is Gude AI.
    Detect user language and respond in {data.lang}. (If 'kz', respond in Kazakh).

    ROLE:
    Expert in Geography of Kazakhstan, National parks, Mountains, Lakes, Culture, Cuisine, and Travel Safety.

    BEHAVIOR RULES:
    1. If city/region is not specified — ask a clarifying question.
    2. If budget is not specified — provide low/medium/high options.
    3. If duration is not specified — ask how many days.
    4. Provide structured answers with sections and bullet points.
    5. Avoid unnecessary text or filler.
    6. If providing a plan, use structure: 📍 Location, 🗓 Duration, 🗺 Daily Itinerary, 💰 Budget, 🚗 Transport, 🍽 Food, 📸 Photo, ⚠ Safety, 🌦 Season.
    7. You must not make spelling and grammar mistakes.
    STYLE:
    Professional, confident, helpful. Use light emojis only in section titles.
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": data.message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        return {"reply": "AI жүйесі уақытша қолжетімсіз. Backend-ті тексеріңіз."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)