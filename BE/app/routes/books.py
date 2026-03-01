"""
Updated Books Route for FastAPI - Integrated with Bihar Board Scraper
"""
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional, List
import os
from pathlib import Path

# Import our custom data manager
from app.data.books_data import BooksDataManager, get_all_books, get_book_by_id

router = APIRouter(prefix="/books", tags=["किताबें (Books)"])

# Initialize data manager
data_manager = BooksDataManager()


@router.get("/list")
async def list_books(
    class_num: Optional[int] = None,
    subject: Optional[str] = None,
    search: Optional[str] = None
):
    """
    List all books with optional filters
    """
    books = data_manager.get_all_books()
    
    # Apply filters
    if class_num is not None:
        books = [b for b in books if data_manager._extract_class_number(b.get('class', '')) == class_num]
    
    if subject:
        books = [b for b in books if subject.lower() in b.get('subject', '').lower()]
    
    if search:
        books = data_manager.search_books(search)
    
    # Format for API
    formatted_books = [data_manager.format_for_api(book) for book in books]
    
    return {
        "total": len(formatted_books),
        "books": formatted_books
    }


@router.get("/statistics")
async def get_statistics():
    """Get statistics about the books database"""
    return data_manager.get_statistics()


@router.get("/classes")
async def get_classes():
    """Get list of all available classes"""
    stats = data_manager.get_statistics()
    classes = []
    
    for class_name, data in stats['classes'].items():
        classes.append({
            'class_name': class_name,
            'class_num': data_manager._extract_class_number(class_name),
            'total_books': data['books'],
            'subjects': data['subjects']
        })
    
    classes.sort(key=lambda x: x['class_num'])
    return {"classes": classes}


@router.get("/subjects")
async def get_subjects(class_num: Optional[int] = None):
    """Get list of all available subjects"""
    if class_num:
        subjects = data_manager.get_subjects_by_class(class_num)
        return {
            "class_num": class_num,
            "subjects": subjects
        }
    
    stats = data_manager.get_statistics()
    return {"subjects": stats['subjects']}


@router.get("/search/")
async def search_books(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Maximum results to return")
):
    """Search books by title, subject, or class"""
    results = data_manager.search_books(q)
    formatted_results = [data_manager.format_for_api(book) for book in results[:limit]]
    
    return {
        "query": q,
        "total_found": len(results),
        "returned": len(formatted_results),
        "results": formatted_results
    }

# Health check endpoint
@router.get("/health")
async def health_check():
    """Check if books database is loaded and accessible"""
    total_books = len(data_manager.get_all_books())
    
    return {
        "status": "healthy",
        "books_loaded": total_books > 0,
        "total_books": total_books,
        "data_file": data_manager.data_file
    }

@router.get("/{book_id}")
async def get_book(book_id: str):
    """Get a single book's details"""
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली (Book not found)")
    
    formatted_book = data_manager.format_for_api(book_data)
    return {"book": formatted_book}

