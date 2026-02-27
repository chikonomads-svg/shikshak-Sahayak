"""
शिक्षक सहायक — Books Route
Bihar Board Class 1–8 textbooks
"""
from fastapi import APIRouter
from app.data.books_data import get_all_books, get_book_by_id, get_chapter_content

from app.logger import logger

router = APIRouter(prefix="/books", tags=["किताबें (Books)"])


@router.get("/list")
async def list_books(class_num: int = None):
    """List all books, optionally filtered by class number."""
    logger.info(f"Fetching books list for class_num: {class_num}")
    books = get_all_books()
    if class_num is not None:
        books = [b for b in books if b["class_num"] == class_num]
    return {"books": books}


@router.get("/{book_id}")
async def get_book(book_id: str):
    """Get a single book's details with chapter list."""
    book = get_book_by_id(book_id)
    if not book:
        return {"error": "पुस्तक नहीं मिली"}
    return {"book": book}


@router.get("/{book_id}/chapter/{chapter_id}")
async def read_chapter(book_id: str, chapter_id: str):
    """Get readable chapter content."""
    logger.info(f"Accessing chapter {chapter_id} in book {book_id}")
    chapter = get_chapter_content(book_id, chapter_id)
    if not chapter:
        logger.warning(f"Chapter NOT FOUND: {chapter_id} in {book_id}")
        return {"error": "अध्याय नहीं मिला"}
    return {"chapter": chapter}
