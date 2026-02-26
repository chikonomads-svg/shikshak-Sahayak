"""
शिक्षक सहायक — Notice Route
Important Bihar Education Dept notices for teachers
"""
from fastapi import APIRouter
from app.data.notice_data import get_all_notices, get_notice_by_id

router = APIRouter(prefix="/notice", tags=["सूचना (Notice)"])


@router.get("/feed")
async def notice_feed(category: str = None):
    """Get all notices, optionally filtered by category."""
    notices = get_all_notices()
    if category:
        notices = [n for n in notices if n["category"] == category]
    return {"notices": notices}


@router.get("/{notice_id}")
async def get_notice(notice_id: str):
    """Get a single notice with full content."""
    notice = get_notice_by_id(notice_id)
    if not notice:
        return {"error": "सूचना नहीं मिली"}
    return {"notice": notice}
