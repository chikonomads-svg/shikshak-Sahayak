"""
शिक्षक सहायक — Teach Module Route
GET  /teach/subjects        — List all subjects for all classes
POST /teach/generate        — AI-generated questions (MCQ/descriptive/actual)
POST /teach/question-bank   — Full Bihar Board-style question bank with answers
"""
import os
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from openai import AzureOpenAI
from app.data.subjects_data import SUBJECTS, get_topics

router = APIRouter(prefix="/teach", tags=["पढ़ाएं (Teach)"])


# ── Pydantic models ──────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    subject: str
    class_num: int
    topic: str = ""
    count: int = 5
    difficulty: str = "medium"   # easy, medium, hard
    mode: str = "mcq"            # mcq, descriptive, actual


class QuestionBankRequest(BaseModel):
    subject: str
    class_num: int
    topic: str = ""


# ── Helper ───────────────────────────────────────────────────────────────────

def _get_ai_client():
    """Return (client, deployment) or (None, None) if credentials missing."""
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").strip('"').strip("'")
    api_key  = os.getenv("AZURE_OPENAI_API_KEY",  "").strip('"').strip("'")
    if not endpoint or not api_key:
        load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").strip('"').strip("'")
        api_key  = os.getenv("AZURE_OPENAI_API_KEY",  "").strip('"').strip("'")
    if not endpoint or not api_key:
        return None, None, None
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o-mini").strip('"').strip("'")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview").strip('"').strip("'")
    client = AzureOpenAI(azure_endpoint=endpoint, api_key=api_key, api_version=api_version)
    return client, deployment, api_version


def _strip_fences(text: str) -> str:
    """Remove markdown code fences from AI response."""
    text = text.strip()
    # Strip opening fence (e.g. ```json or ```)
    if text.startswith("```"):
        parts = text.split("\n", 1)
        text = parts[1] if len(parts) > 1 else ""
    # Strip closing fence
    if text.endswith("```"):
        text = text.rsplit("```", 1)[0]
    return text.strip()


# ── GET /teach/subjects ──────────────────────────────────────────────────────

@router.get("/subjects")
async def list_subjects():
    """List all subjects with their classes and topics."""
    result = {}
    for key, subj in SUBJECTS.items():
        result[key] = {
            "name": subj["name"],
            "icon": subj["icon"],
            "classes": {str(c): topics for c, topics in subj["topics"].items()},
        }
    return {"subjects": result}


# ── POST /teach/generate ─────────────────────────────────────────────────────

@router.post("/generate")
async def generate_questions(req: GenerateRequest):
    """Generate AI questions (MCQ / descriptive / Bihar Board pastpapers)."""
    client, deployment, _ = _get_ai_client()

    subj = SUBJECTS.get(req.subject)
    if not subj:
        return {"error": f"विषय '{req.subject}' नहीं मिला"}

    topics = get_topics(req.subject, req.class_num)
    if not topics:
        return {"error": f"कक्षा {req.class_num} के लिए '{subj['name']}' में कोई विषय नहीं"}

    topic_str = req.topic if req.topic else ", ".join(topics[:3])
    diff_hindi = {"easy": "आसान", "medium": "मध्यम", "hard": "कठिन"}.get(req.difficulty, "मध्यम")

    if not client:
        return {"error": "Azure OpenAI credentials not configured", "questions": _fallback_questions(req)}

    mode_prompts = {
        "mcq": (
            f"कक्षा {req.class_num} के विषय {subj['name']} के लिए {req.count} बहुविकल्पीय प्रश्न (MCQ) बनाएं।\n\n"
            "प्रत्येक प्रश्न के लिए निम्न JSON प्रारूप:\n"
            '[{"question":"...","options":["अ)...","ब)...","स)...","द)..."],"correct":0,"explanation":"..."}]'
        ),
        "descriptive": (
            f"कक्षा {req.class_num} के विषय {subj['name']} के लिए {req.count} वर्णनात्मक प्रश्न और विस्तृत उत्तर बनाएं।\n\n"
            "प्रत्येक प्रश्न के लिए निम्न JSON प्रारूप:\n"
            '[{"question":"...","answer":"विस्तृत उत्तर (50-100 शब्द)"}]'
        ),
        "actual": (
            f"कक्षा {req.class_num} के विषय {subj['name']} के लिए बिहार बोर्ड परीक्षाओं में पूछे गए "
            f"{req.count} अति-महत्वपूर्ण प्रश्न और उत्तर दें।\n\n"
            "प्रत्येक प्रश्न के लिए निम्न JSON प्रारूप:\n"
            '[{"question":"...","answer":"...","year":"2023"}]'
        ),
    }

    prompt = f"""{mode_prompts.get(req.mode, mode_prompts['mcq'])}

विषय/टॉपिक: {topic_str}
कठिनाई स्तर: {diff_hindi}

नियम:
- सभी प्रश्न शुद्ध हिंदी में हों
- कक्षा {req.class_num} के स्तर के अनुसार प्रश्न हों
- बिहार बोर्ड पाठ्यक्रम के अनुसार
- केवल JSON array दें, कोई अन्य टेक्स्ट नहीं"""

    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": "आप एक शिक्षा विशेषज्ञ हैं। केवल valid JSON array दें।"},
                {"role": "user",   "content": prompt},
            ],
            max_completion_tokens=3000,
        )
        reply = _strip_fences(response.choices[0].message.content or "[]")
        try:
            questions = json.loads(reply)
        except json.JSONDecodeError:
            questions = _fallback_questions(req)

        return {
            "subject": subj["name"],
            "class_num": req.class_num,
            "topic": topic_str,
            "difficulty": diff_hindi,
            "questions": questions,
        }
    except Exception as e:
        return {"error": f"AI सेवा त्रुटि: {str(e)}", "questions": _fallback_questions(req)}


# ── POST /teach/question-bank ────────────────────────────────────────────────

@router.post("/question-bank")
async def generate_question_bank(req: QuestionBankRequest):
    """
    Generate a complete Bihar Board-style question bank with answers.
    Includes: MCQ (10), Short-answer (5), Long-answer (3).
    """
    client, deployment, _ = _get_ai_client()

    subj = SUBJECTS.get(req.subject)
    if not subj:
        return {"error": f"विषय '{req.subject}' नहीं मिला"}

    topics = get_topics(req.subject, req.class_num)
    if not topics:
        return {"error": f"कक्षा {req.class_num} के लिए '{subj['name']}' में कोई विषय नहीं"}

    topic_str = req.topic if req.topic else ", ".join(topics)

    if not client:
        return {"error": "Azure OpenAI credentials not configured"}

    prompt = f"""आप बिहार बोर्ड के एक वरिष्ठ शिक्षा विशेषज्ञ हैं।
कक्षा {req.class_num} के विषय **{subj['name']}** के लिए एक पूर्ण प्रश्न बैंक (Question Bank) बनाएं।
टॉपिक/अध्याय: {topic_str}

निम्न JSON प्रारूप में उत्तर दें (केवल JSON, कोई अन्य टेक्स्ट नहीं):
{{
  "mcq": [
    {{
      "question": "प्रश्न यहां",
      "options": ["अ) विकल्प एक", "ब) विकल्प दो", "स) विकल्प तीन", "द) विकल्प चार"],
      "answer": 0,
      "explanation": "संक्षिप्त व्याख्या"
    }}
  ],
  "short": [
    {{
      "question": "लघु उत्तरीय प्रश्न यहां",
      "answer": "उत्तर यहां (40-60 शब्द में)"
    }}
  ],
  "long": [
    {{
      "question": "दीर्घ उत्तरीय प्रश्न यहां",
      "answer": "विस्तृत उत्तर यहां (100-150 शब्द में)"
    }}
  ]
}}

आवश्यकताएं:
- वस्तुनिष्ठ प्रश्न (MCQ): 10 प्रश्न — सभी बिहार बोर्ड परीक्षा पैटर्न के अनुसार
- लघु उत्तरीय प्रश्न: 5 प्रश्न — 2 अंक वाले (40-60 शब्द उत्तर)
- दीर्घ उत्तरीय प्रश्न: 3 प्रश्न — 5 अंक वाले (100-150 शब्द उत्तर)
- सभी प्रश्न और उत्तर शुद्ध हिंदी में हों
- कक्षा {req.class_num} के स्तर के अनुसार
- बिहार बोर्ड एनसीईआरटी पाठ्यक्रम के अनुसार
- answer field में MCQ के लिए index (0-3) दें"""

    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "आप एक अनुभवी बिहार बोर्ड शिक्षा विशेषज्ञ हैं। "
                        "केवल valid JSON object दें, कोई markdown नहीं।"
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_completion_tokens=6000,
        )
        reply = _strip_fences(response.choices[0].message.content or "{}")
        try:
            bank = json.loads(reply)
        except json.JSONDecodeError:
            return {"error": "AI ने सही प्रारूप में उत्तर नहीं दिया। कृपया पुनः प्रयास करें।"}

        return {
            "subject": subj["name"],
            "class_num": req.class_num,
            "topic": topic_str,
            "mcq":   bank.get("mcq",   []),
            "short": bank.get("short", []),
            "long":  bank.get("long",  []),
        }
    except Exception as e:
        return {"error": f"AI सेवा त्रुटि: {str(e)}"}


# ── Fallback ─────────────────────────────────────────────────────────────────

def _fallback_questions(req):
    return [
        {
            "question": f"कक्षा {req.class_num} — यह एक नमूना प्रश्न है।",
            "options": ["अ) विकल्प एक", "ब) विकल्प दो", "स) विकल्प तीन", "द) विकल्प चार"],
            "correct": 0,
            "topic": req.topic or "सामान्य",
            "explanation": "यह एक नमूना उत्तर है।",
        }
    ]
