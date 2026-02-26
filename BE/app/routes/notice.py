"""
शिक्षक सहायक — Notice Route
Important Bihar Education Dept notices for teachers fetched via Tavily
"""
import os, time, httpx
from fastapi import APIRouter

router = APIRouter(prefix="/notice", tags=["सूचना (Notice)"])

from typing import Any
_cache: dict[str, Any] = {"data": None, "ts": 0}
CACHE_TTL = 3600 # 1 hour cache for notices

TAVILY_URL = "https://api.tavily.com/search"

# Target specific government domains provided by user
DOMAINS = [
    "eshikshakosh.bihar.gov.in",
    "state.bihar.gov.in/educationbihar/",
    "edu-madarsa-board.bihar.gov.in",
    "bpsc.bih.nic.in"
]

NOTICE_QUERY = "Bihar Education Department Teacher Notice latest circular order"

async def _fetch_notices(client, api_key):
    try:
        # We append domains to the query to force Tavily to search them
        query_with_domains = NOTICE_QUERY + " " + " OR ".join([f"site:{d}" for d in DOMAINS])
        
        resp = await client.post(TAVILY_URL, json={
            "api_key": api_key, "query": query_with_domains, "search_depth": "advanced",
            "max_results": 10, "include_answer": False,
            "include_raw_content": False, "topic": "general",
        })
        resp.raise_for_status()
        data = resp.json()
        
        formatted_notices = []
        for i, item in enumerate(data.get("results", [])):
            title = item.get("title", "")
            snippet = item.get("content", "")
            url = item.get("url", "")
            
            if not title or not url: continue
            
            # Extract domain for source mapping
            domain = url.split("/")[2] if "/" in url else "bihar.gov.in"
            if "eshikshakosh" in domain: source = "ई-शिक्षाकोष पोर्टल"
            elif "bpsc" in domain: source = "BPSC"
            elif "madarsa" in domain: source = "मदरसा बोर्ड"
            else: source = "शिक्षा विभाग, बिहार"
            
            # Categorize based on keywords in title/snippet
            category = "शासनादेश"
            icon = "📝"
            text_lower = (title + " " + snippet).lower()
            if "salary" in text_lower or "वेतन" in text_lower:
                category = "वेतन"
                icon = "💰"
            elif "transfer" in text_lower or "स्थानांतरण" in text_lower:
                category = "स्थानांतरण"
                icon = "🔄"
            elif "exam" in text_lower or "परीक्षा" in text_lower:
                category = "परीक्षा"
                icon = "📝"
            elif "training" in text_lower or "प्रशिक्षण" in text_lower:
                category = "प्रशिक्षण"
                icon = "🎓"

            formatted_notices.append({
                "id": f"notice-{i}",
                "title": title[:100] + "..." if len(title) > 100 else title,
                "category": category,
                "category_icon": icon,
                "date": item.get("published_date", "Recently"),
                "source": source,
                "priority": "high" if "urgent" in text_lower or "तत्काल" in text_lower else "medium",
                "summary": snippet[:150] + "...",
                "content": f"## {title}\n\n**Source:** [{source}]({url})\n\n{snippet}\n\n[यहाँ पूरा नोटिस पढ़ें (Click to read full notice)]({url})"
            })
            
        return formatted_notices
    except Exception as e:
        print(f"Error fetching notices: {str(e)}")
        return []

@router.get("/feed")
async def notice_feed(category: str | None = None):
    """Get all notices fetched dynamically, optionally filtered by category."""
    now = time.time()
    
    api_key = os.getenv("TAVILY_API_KEY", "")
    if not api_key:
        from app.data.notice_data import get_all_notices
        notices = get_all_notices()
        return {"notices": notices, "source": "mock_fallback"}

    # Use cache if valid
    if _cache["data"] and (now - _cache["ts"]) < CACHE_TTL:
        notices = _cache["data"]
    else:
        async with httpx.AsyncClient(timeout=20) as client:
            fetched_notices = await _fetch_notices(client, api_key)
            if fetched_notices:
                _cache["data"] = fetched_notices
                _cache["ts"] = now
                notices = fetched_notices
            else:
                # Fallback to mock if API fails to find anything
                from app.data.notice_data import get_all_notices
                notices = get_all_notices()

    if category and category != "सभी":
        notices = [n for n in notices if n.get("category") == category]
        
    return {"notices": notices}


@router.get("/{notice_id}")
async def get_notice(notice_id: str):
    """Get a single notice with full content."""
    # Since notices are dynamically generated, we pull from cache to find the ID.
    notices = _cache.get("data")
    if not notices:
        from app.data.notice_data import get_notice_by_id
        notice = get_notice_by_id(notice_id)
        if notice: return {"notice": notice}
        return {"error": "सूचना नहीं मिली"}

    for n in notices:
        if n["id"] == notice_id:
            return {"notice": n}
            
    # Fallback to mock if not in cache (e.g. server restarted)
    from app.data.notice_data import get_notice_by_id
    notice = get_notice_by_id(notice_id)
    if notice: return {"notice": notice}
    
    return {"error": "सूचना नहीं मिली"}
