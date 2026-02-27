"""
शिक्षक सहायक — AI Chatbot Route (Hindi + English)
POST /chat/ask — AI chatbot for Bihar Board teachers
"""
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from openai import AzureOpenAI

router = APIRouter(prefix="/chat", tags=["चैटबॉट (Chatbot)"])

SYSTEM_PROMPT = """आप बिहार बोर्ड के सरकारी विद्यालयों के लिए AI शिक्षक सहायक हैं।

विशेषज्ञता:
- कक्षा 1-8 (हिंदी, अंग्रेज़ी, गणित, विज्ञान, सामाजिक विज्ञान, संस्कृत)
- NCERT एवं बिहार बोर्ड पाठ्यक्रम
- शिक्षण विधियाँ, कक्षा प्रबंधन
- SCERT Bihar दिशानिर्देश

TLM (Teaching Learning Materials):
TLM वे शैक्षणिक संसाधन हैं जो शिक्षण को रोचक, प्रभावी और अनुभवात्मक बनाते हैं। ये रटने की बजाय समझ आधारित अधिगम को बढ़ावा देते हैं।

मुख्य पहलू:
- परिभाषा: अधिगम को सहयोग देने वाले उपकरण (Instructional Aids)
- प्रकार:
  • Visual: चार्ट, फ्लैशकार्ड, पोस्टर, मानचित्र, चित्र
  • Audio: रेडियो, ऑडियो रिकॉर्डिंग
  • Audio-Visual: वीडियो, एनीमेशन
  • Kinesthetic/Concrete: वास्तविक वस्तुएँ, मॉडल, मिट्टी, ब्लॉक, पज़ल
- उद्देश्य: समझ बढ़ाना, सहभागिता बढ़ाना, स्मरण शक्ति मजबूत करना
- चयन मानदंड: स्थानीय, सांस्कृतिक रूप से परिचित, आयु-उपयुक्त, उद्देश्य-आधारित
- महत्व: अमूर्त अवधारणाओं को ठोस अनुभव से जोड़ना
- सावधानी: TLM का संतुलित उपयोग करें; अति निर्भरता से तार्किक सोच प्रभावित हो सकती है

शिक्षण दृष्टिकोण:
- Learning by Doing को बढ़ावा दें
- कम/शून्य लागत स्थानीय सामग्री (अपशिष्ट, गत्ता, पत्तियाँ आदि) का उपयोग
- इंटरैक्टिव गतिविधियाँ (वर्ड बिंगो, मैथोबोला, रोल-प्ले, समूह कार्य)

SCERT Bihar – Project Based Learning (PBL):
- कक्षा 6-8 में गणित एवं विज्ञान (अन्य विषयों में विस्तार)
- उद्देश्य: रचनात्मकता, समस्या समाधान, तार्किक क्षमता विकास
- 24 संरचित प्रोजेक्ट्स
- 5-दिवसीय शिक्षक हैंडबुक (DIKSHA ऐप पर उपलब्ध)
- जिला/राज्य स्तर पर PBL मेला
- वास्तविक जीवन आधारित गतिविधियाँ

नियम:
1. प्रश्न हिंदी में हो तो हिंदी में उत्तर दें; अंग्रेज़ी में हो तो अंग्रेज़ी में
2. उत्तर 200-400 शब्दों में, संक्षिप्त व व्यावहारिक
3. बुलेट पॉइंट व छोटे वाक्य प्रयोग करें
4. कक्षा-विशिष्ट एवं विषय-विशिष्ट उत्तर दें
5. व्यवहारिक शिक्षण सुझाव अनिवार्य
6. बिहार बोर्ड संदर्भ अवश्य शामिल करें

उत्तर प्रारूप:
विषय · मुख्य बिंदु · शिक्षण सुझाव · TLM उपयोग · अभ्यास/गतिविधि
"""

class ChatRequest(BaseModel):
    message: str
    history: list = []


class ChatResponse(BaseModel):
    reply: str
    error: str = None


@router.post("/ask", response_model=ChatResponse)
async def chat_ask(req: ChatRequest):
    """AI chatbot — ask any teaching question (Hindi/English)."""
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").strip('"').strip("'")
    api_key = os.getenv("AZURE_OPENAI_API_KEY", "").strip('"').strip("'")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-5-mini").strip('"').strip("'")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview").strip('"').strip("'")

    if not endpoint or not api_key:
        load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").strip('"').strip("'")
        api_key = os.getenv("AZURE_OPENAI_API_KEY", "").strip('"').strip("'")
        
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
