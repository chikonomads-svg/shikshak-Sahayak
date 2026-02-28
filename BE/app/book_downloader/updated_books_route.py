"""
Updated Books Route for FastAPI - Integrated with Bihar Board Scraper
"""
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional, List
import os
from pathlib import Path

# Import our custom data manager
from books_data_manager import BooksDataManager, get_all_books, get_book_by_id, get_chapter_content
from bihar_books_scraper import BiharBoardBooksScraper
from pdf_downloader import BiharBooksDownloader

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
    
    - **class_num**: Filter by class number (1-12)
    - **subject**: Filter by subject name
    - **search**: Search in title, subject, or class
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
            'total_pdfs': data['pdfs'],
            'subjects': data['subjects']
        })
    
    # Sort by class number
    classes.sort(key=lambda x: x['class_num'])
    
    return {"classes": classes}


@router.get("/subjects")
async def get_subjects(class_num: Optional[int] = None):
    """
    Get list of all available subjects
    
    - **class_num**: Optional - filter subjects by class
    """
    if class_num:
        subjects = data_manager.get_subjects_by_class(class_num)
        return {
            "class_num": class_num,
            "subjects": subjects
        }
    
    stats = data_manager.get_statistics()
    return {"subjects": stats['subjects']}


@router.get("/{book_id}")
async def get_book(book_id: str):
    """Get a single book's details with chapter list"""
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली (Book not found)")
    
    formatted_book = data_manager.format_for_api(book_data)
    return {"book": formatted_book}


@router.get("/{book_id}/chapters")
async def get_book_chapters(book_id: str):
    """Get all chapters for a book"""
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली")
    
    chapters = data_manager._format_chapters(book_data.get('chapters', []))
    
    return {
        "book_id": book_id,
        "book_title": book_data.get('book_title', ''),
        "total_chapters": len(chapters),
        "chapters": chapters
    }


@router.get("/{book_id}/chapter/{chapter_id}")
async def read_chapter(book_id: str, chapter_id: str):
    """Get readable chapter content with PDF links"""
    chapter = get_chapter_content(book_id, chapter_id)
    
    if not chapter:
        raise HTTPException(status_code=404, detail="अध्याय नहीं मिला (Chapter not found)")
    
    return {"chapter": chapter}


@router.get("/{book_id}/pdfs")
async def get_book_pdfs(book_id: str):
    """Get all PDF links for a book"""
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली")
    
    return {
        "book_id": book_id,
        "book_title": book_data.get('book_title', ''),
        "total_pdfs": book_data.get('total_pdfs', 0),
        "pdfs": book_data.get('all_pdfs', [])
    }


@router.post("/scrape/update")
async def update_books_database(background_tasks: BackgroundTasks):
    """
    Trigger scraping to update the books database
    This runs in the background
    """
    def scrape_and_save():
        scraper = BiharBoardBooksScraper()
        books = scraper.scrape_all_books()
        scraper.save_to_json("bihar_board_books.json")
        
        # Reload data in manager
        data_manager.load_data()
    
    background_tasks.add_task(scrape_and_save)
    
    return {
        "message": "Scraping started in background",
        "status": "processing"
    }


@router.post("/download/{book_id}")
async def download_book_pdfs(book_id: str, background_tasks: BackgroundTasks):
    """
    Download all PDFs for a specific book
    This runs in the background
    """
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली")
    
    def download_book():
        downloader = BiharBooksDownloader()
        downloader.download_book(book_data)
    
    background_tasks.add_task(download_book)
    
    return {
        "message": f"Download started for {book_data.get('book_title')}",
        "book_id": book_id,
        "status": "processing"
    }


@router.get("/search/")
async def search_books(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Maximum results to return")
):
    """
    Search books by title, subject, or class
    
    - **q**: Search query string
    - **limit**: Maximum number of results (1-100)
    """
    results = data_manager.search_books(q)
    formatted_results = [data_manager.format_for_api(book) for book in results[:limit]]
    
    return {
        "query": q,
        "total_found": len(results),
        "returned": len(formatted_results),
        "results": formatted_results
    }


@router.get("/local/{book_id}/pdf/{filename}")
async def serve_local_pdf(book_id: str, filename: str):
    """
    Serve locally downloaded PDF file
    Requires PDFs to be downloaded first
    """
    book_data = data_manager.get_book_by_id(book_id)
    
    if not book_data:
        raise HTTPException(status_code=404, detail="पुस्तक नहीं मिली")
    
    # Construct local file path
    class_name = book_data.get('class', '')
    subject = book_data.get('subject', '')
    book_title = book_data.get('book_title', '')
    
    # Sanitize path components
    def sanitize(s):
        return ''.join(c if c.isalnum() or c in ' -_' else '_' for c in s)
    
    base_path = Path("bihar_board_books")
    file_path = base_path / sanitize(class_name) / sanitize(subject) / sanitize(book_title) / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=404, 
            detail="PDF not found. Please download the book first using /download/{book_id}"
        )
    
    return FileResponse(
        path=file_path,
        media_type='application/pdf',
        filename=filename
    )


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
