"""
शिक्षक सहायक — AI Chatbot Route (Hindi + English)
POST /chat/ask — AI chatbot for Bihar Board teachers
"""
import os
from fastapi import APIRouter
from pydantic import BaseModel
from openai import AzureOpenAI

router = APIRouter(prefix="/chat", tags=["चैटबॉट (Chatbot)"])

SYSTEM_PROMPT = """आप एक AI शिक्षक सहायक हैं जो बिहार बोर्ड के सरकारी शिक्षकों की मदद करते हैं।

आपकी विशेषज्ञता:
- कक्षा 1 से 8 तक के सभी विषय (हिंदी, अंग्रेज़ी, गणित, विज्ञान, सामाजिक विज्ञान, संस्कृत)
- NCERT और बिहार बोर्ड पाठ्यक्रम
- शिक्षण विधियां और कक्षा प्रबंधन
- NEP 2020 कार्यान्वयन
- शिक्षक प्रशिक्षण और पेशेवर विकास

नियम:
1. प्रश्न हिंदी में हो तो हिंदी में उत्तर दें, अंग्रेज़ी में हो तो अंग्रेज़ी में
2. उत्तर संक्षिप्त और व्यावहारिक रखें (200-400 शब्द)
3. बुलेट पॉइंट और छोटे वाक्य उपयोग करें
4. विषय-विशिष्ट उत्तर दें — कक्षा स्तर का ध्यान रखें
5. शिक्षण के व्यावहारिक सुझाव दें
6. बिहार बोर्ड के संदर्भ में उत्तर दें

प्रारूप: विषय · मुख्य बिंदु · शिक्षण सुझाव · अभ्यास गतिविधि"""


class ChatRequest(BaseModel):
    message: str
    history: list = []


class ChatResponse(BaseModel):
    reply: str
    error: str = None


@router.post("/ask", response_model=ChatResponse)
async def chat_ask(req: ChatRequest):
    """AI chatbot — ask any teaching question (Hindi/English)."""
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    api_key = os.getenv("AZURE_OPENAI_API_KEY", "")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-5-mini")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")

    if not endpoint or not api_key:
        return ChatResponse(reply="", error="Azure OpenAI credentials not configured")

    try:
        client = AzureOpenAI(
            azure_endpoint=endpoint, api_key=api_key, api_version=api_version,
        )
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in req.history[-10:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        messages.append({"role": "user", "content": req.message})

        response = client.chat.completions.create(
            model=deployment, messages=messages, max_completion_tokens=3000,
        )
        reply = response.choices[0].message.content
        if not reply:
            choice = response.choices[0]
            if hasattr(choice.message, "refusal") and choice.message.refusal:
                reply = f"AI ने उत्तर देने से मना किया: {choice.message.refusal}"
            else:
                reply = "⚠️ AI ने खाली उत्तर दिया। कृपया सरल प्रश्न पूछें।"
        return ChatResponse(reply=reply)
    except Exception as e:
        return ChatResponse(reply="", error=f"AI सेवा त्रुटि: {str(e)}")
