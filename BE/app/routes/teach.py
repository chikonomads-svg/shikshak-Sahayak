"""
शिक्षक सहायक — Teach Module Route
GET  /teach/subjects   — List all subjects for all classes
POST /teach/generate   — AI-generated MCQ questions
"""
import os
from fastapi import APIRouter
from pydantic import BaseModel
from openai import AzureOpenAI
from app.data.subjects_data import SUBJECTS, get_topics

router = APIRouter(prefix="/teach", tags=["पढ़ाएं (Teach)"])


class GenerateRequest(BaseModel):
    subject: str
    class_num: int
    topic: str = ""
    count: int = 5
    difficulty: str = "medium"  # easy, medium, hard


@router.get("/subjects")
async def list_subjects():
    """List all subjects with their classes and topics."""
    result = {}
    for key, subj in SUBJECTS.items():
        result[key] = {
            "name": subj["name"],
            "icon": subj["icon"],
            "classes": {
                str(c): topics for c, topics in subj["topics"].items()
            },
        }
    return {"subjects": result}


@router.post("/generate")
async def generate_questions(req: GenerateRequest):
    """Generate MCQ questions for a given class/subject/topic using AI."""
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    api_key = os.getenv("AZURE_OPENAI_API_KEY", "")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-5-mini")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")

    subj = SUBJECTS.get(req.subject)
    if not subj:
        return {"error": f"विषय '{req.subject}' नहीं मिला"}

    topics = get_topics(req.subject, req.class_num)
    if not topics:
        return {"error": f"कक्षा {req.class_num} के लिए '{subj['name']}' में कोई विषय नहीं"}

    topic_str = req.topic if req.topic else ", ".join(topics[:3])

    difficulty_map = {"easy": "आसान", "medium": "मध्यम", "hard": "कठिन"}
    diff_hindi = difficulty_map.get(req.difficulty, "मध्यम")

    if not endpoint or not api_key:
        return {"error": "Azure OpenAI credentials not configured", "questions": _fallback_questions(req)}

    prompt = f"""कक्षा {req.class_num} के विषय {subj['name']} के लिए {req.count} बहुविकल्पीय प्रश्न (MCQ) बनाएं।

विषय/टॉपिक: {topic_str}
कठिनाई स्तर: {diff_hindi}

प्रत्येक प्रश्न के लिए निम्न JSON प्रारूप में उत्तर दें:
[
  {{
    "question": "प्रश्न यहां",
    "options": ["विकल्प अ", "विकल्प ब", "विकल्प स", "विकल्प द"],
    "correct": 0,
    "topic": "टॉपिक",
    "explanation": "संक्षिप्त व्याख्या"
  }}
]

नियम:
- सभी प्रश्न हिंदी में हों
- correct फ़ील्ड में सही उत्तर का इंडेक्स (0-3) हो
- कक्षा {req.class_num} के स्तर के अनुसार प्रश्न हों
- बिहार बोर्ड पाठ्यक्रम के अनुसार
- केवल JSON array दें, कोई अन्य टेक्स्ट नहीं"""

    try:
        client = AzureOpenAI(
            azure_endpoint=endpoint, api_key=api_key, api_version=api_version,
        )
        response = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": "आप एक शिक्षा विशेषज्ञ हैं। केवल valid JSON array दें।"},
                {"role": "user", "content": prompt},
            ],
            max_completion_tokens=3000,
        )
        reply = response.choices[0].message.content or "[]"
        # Strip markdown code fences if present
        reply = reply.strip()
        if reply.startswith("```"):
            reply = reply.split("\n", 1)[1] if "\n" in reply else reply[3:]
        if reply.endswith("```"):
            reply = reply[:-3]
        reply = reply.strip()

        import json
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


def _fallback_questions(req):
    return [
        {
            "question": f"कक्षा {req.class_num} — यह एक नमूना प्रश्न है।",
            "options": ["विकल्प अ", "विकल्प ब", "विकल्प स", "विकल्प द"],
            "correct": 0,
            "topic": req.topic or "सामान्य",
            "explanation": "यह एक नमूना उत्तर है।",
        }
    ]
