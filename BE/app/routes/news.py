"""
शिक्षक सहायक — News Feed (Tavily Search API)
GET /news/feed — Bihar teacher & education news in Hindi
"""
import os, time, httpx
from fastapi import APIRouter

router = APIRouter(prefix="/news", tags=["समाचार (News)"])

_cache = {"data": None, "ts": 0}
CACHE_TTL = 900

TAVILY_URL = "https://api.tavily.com/search"

QUERIES = [
    {"label": "📚 बिहार शिक्षा समाचार", "query": "Bihar education teacher school news Hindi 2026", "max": 5},
    {"label": "🇮🇳 भारत शिक्षा समाचार", "query": "India education teacher NCERT school policy news Hindi 2026", "max": 4},
    {"label": "📋 सरकारी योजनाएं", "query": "Bihar government teacher salary scheme policy 2026 Hindi", "max": 3},
]


async def _search(client, api_key, query, max_results):
    try:
        resp = await client.post(TAVILY_URL, json={
            "api_key": api_key, "query": query, "search_depth": "basic",
            "max_results": max_results, "include_answer": False,
            "include_raw_content": False, "topic": "news",
        })
        resp.raise_for_status()
        data = resp.json()
        return [
            {
                "title": item.get("title", ""), "url": item.get("url", ""),
                "snippet": item.get("content", "")[:300],
                "source": item.get("url", "").split("/")[2] if "/" in item.get("url", "") else "",
                "score": item.get("score", 0),
                "published_date": item.get("published_date", ""),
            }
            for item in data.get("results", [])
        ]
    except Exception:
        return []


@router.get("/feed")
async def news_feed():
    """Fetch Bihar teacher & education news via Tavily."""
    now = time.time()
    if _cache["data"] and (now - _cache["ts"]) < CACHE_TTL:
        return {"source": "cache", "sections": _cache["data"]}

    api_key = os.getenv("TAVILY_API_KEY", "")
    if not api_key:
        return {"error": "TAVILY_API_KEY not set", "sections": _fallback()}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            sections = []
            for q in QUERIES:
                results = await _search(client, api_key, q["query"], q["max"])
                sections.append({"label": q["label"], "results": results})
        _cache["data"] = sections
        _cache["ts"] = now
        return {"source": "tavily", "sections": sections}
    except Exception as e:
        return {"source": "fallback", "error": str(e), "sections": _fallback()}


def _fallback():
    return [
        {"label": "📚 बिहार शिक्षा समाचार", "results": [
            {"title": "बिहार में शिक्षकों की नई भर्ती प्रक्रिया शुरू", "url": "#", "snippet": "बिहार सरकार ने प्राथमिक और मध्य विद्यालयों में 50,000 शिक्षकों की भर्ती की घोषणा की है...", "source": "bhaskar.com", "score": 0.9, "published_date": ""},
            {"title": "बिहार बोर्ड: कक्षा 8 की परीक्षा में नए बदलाव", "url": "#", "snippet": "बिहार विद्यालय परीक्षा समिति ने कक्षा 8 की वार्षिक परीक्षा में कई महत्वपूर्ण बदलाव किए हैं...", "source": "jagran.com", "score": 0.85, "published_date": ""},
        ]},
        {"label": "🇮🇳 भारत शिक्षा समाचार", "results": [
            {"title": "NEP 2020: स्कूली शिक्षा में बड़े बदलाव", "url": "#", "snippet": "राष्ट्रीय शिक्षा नीति 2020 के तहत पाठ्यक्रम में व्यापक बदलाव किए जा रहे हैं...", "source": "ndtv.com", "score": 0.8, "published_date": ""},
        ]},
        {"label": "📋 सरकारी योजनाएं", "results": [
            {"title": "शिक्षकों के लिए नई पेंशन योजना की घोषणा", "url": "#", "snippet": "केंद्र सरकार ने शिक्षकों के लिए एक नई पेंशन योजना की घोषणा की है...", "source": "gov.in", "score": 0.75, "published_date": ""},
        ]},
    ]
