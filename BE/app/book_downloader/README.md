# Bihar Board Books Scraper & Downloader

Complete solution to scrape, download, and serve Bihar Board textbooks from https://bepclots.bihar.gov.in/

## 📚 Features

- ✅ **Scrape all textbooks** from Bihar Board e-LOTS website (Classes 1-12)
- ✅ **Download PDFs** with organized folder structure
- ✅ **FastAPI integration** for serving books through your API
- ✅ **Search and filter** books by class, subject, or keywords
- ✅ **Chapter-wise organization** when available
- ✅ **Background tasks** for scraping and downloading
- ✅ **Detailed logging** and progress tracking

## 🗂️ File Structure

```
bihar_books_scraper/
├── bihar_books_scraper.py      # Main scraper
├── pdf_downloader.py            # PDF download manager
├── books_data_manager.py        # Data models & API helpers
├── updated_books_route.py       # FastAPI routes
├── requirements.txt             # Python dependencies
├── run_scraper.py              # Quick start script
└── README.md                    # This file
```

## 📦 Installation

```bash
# Install required packages
pip install requests beautifulsoup4 fastapi uvicorn

# Or use requirements.txt
pip install -r requirements.txt
```

## 🚀 Quick Start

### Step 1: Scrape Books Metadata

```bash
python bihar_books_scraper.py
```

This will:
- Scrape all book metadata from the website
- Save to `bihar_board_books.json`
- Generate summary in `bihar_board_books_summary.json`

**Output:**
```
bihar_board_books.json           # Complete books database
bihar_board_books_summary.json   # Statistics summary
```

### Step 2: Download PDFs (Optional)

```bash
python pdf_downloader.py
```

This will:
- Read `bihar_board_books.json`
- Download all PDFs in organized folders
- Save to `bihar_board_books/` directory

**Folder Structure:**
```
bihar_board_books/
├── Class_I/
│   ├── English/
│   │   └── Blossom/
│   │       ├── Chapter_1.pdf
│   │       ├── Chapter_2.pdf
│   │       └── metadata.json
│   └── Mathematics/
│       └── Ganit/
│           └── ...
├── Class_II/
└── ...
```

### Step 3: Integrate with FastAPI

Replace your existing `books_route.py` with the updated version:

```python
# In your main FastAPI app
from updated_books_route import router as books_router

app.include_router(books_router)
```

## 📖 API Endpoints

### List Books
```http
GET /books/list?class_num=1&subject=Math
```

**Query Parameters:**
- `class_num` (optional): Filter by class (1-12)
- `subject` (optional): Filter by subject
- `search` (optional): Search query

**Response:**
```json
{
  "total": 5,
  "books": [
    {
      "id": "class_i_mathematics_ganit",
      "class_num": 1,
      "class_name": "Class I",
      "subject": "Mathematics",
      "title": "गणित (Ganit)",
      "url": "https://...",
      "total_pdfs": 15,
      "chapters": [...]
    }
  ]
}
```

### Get Book Details
```http
GET /books/{book_id}
```

### Get Chapters
```http
GET /books/{book_id}/chapters
```

### Get Chapter Content
```http
GET /books/{book_id}/chapter/{chapter_id}
```

### Search Books
```http
GET /books/search/?q=mathematics&limit=10
```

### Statistics
```http
GET /books/statistics
```

### Update Database (Background Task)
```http
POST /books/scrape/update
```

### Download Book PDFs (Background Task)
```http
POST /books/download/{book_id}
```

## 🔧 Configuration

### Scraper Configuration

Edit `bihar_books_scraper.py`:

```python
class BiharBoardBooksScraper:
    # Base URL
    BASE_URL = "https://bepclots.bihar.gov.in"
    
    # Classes to scrape (can customize)
    CLASSES = {
        "Class I": "/category/class-i/",
        "Class II": "/category/class-ii/",
        # ... add or remove classes
    }
```

### Download Configuration

Edit `pdf_downloader.py`:

```python
# Change download directory
downloader = BiharBooksDownloader(base_download_dir='my_books')

# Skip existing files (default: True)
# Timeout for downloads (default: 60 seconds)
```

## 📊 Data Structure

### Books JSON Schema

```json
{
  "class": "Class I",
  "subject": "Mathematics",
  "book_title": "गणित (Ganit)",
  "book_url": "https://bepclots.bihar.gov.in/...",
  "chapters": [
    {
      "chapter_name": "Chapter 1: Numbers",
      "pdfs": [
        {
          "url": "https://...",
          "title": "Download PDF"
        }
      ]
    }
  ],
  "all_pdfs": [...],
  "total_pdfs": 15
}
```

## 🎯 Usage Examples

### Example 1: Scrape Specific Classes

```python
from bihar_books_scraper import BiharBoardBooksScraper

scraper = BiharBoardBooksScraper()

# Only scrape Classes 1-5
scraper.CLASSES = {
    "Class I": "/category/class-i/",
    "Class II": "/category/class-ii/",
    "Class III": "/category/class-iii/",
    "Class IV": "/category/class-iv/",
    "Class V": "/category/class-v/",
}

books = scraper.scrape_all_books()
scraper.save_to_json()
```

### Example 2: Download Specific Subject

```python
from pdf_downloader import BiharBooksDownloader
import json

# Load books
with open('bihar_board_books.json', 'r') as f:
    all_books = json.load(f)

# Filter Mathematics books
math_books = [b for b in all_books if 'math' in b['subject'].lower()]

# Download only math books
downloader = BiharBooksDownloader()
for book in math_books:
    downloader.download_book(book)
```

### Example 3: Custom API Integration

```python
from books_data_manager import BooksDataManager

# Initialize
manager = BooksDataManager('bihar_board_books.json')

# Get books for Class 6
class_6_books = manager.get_books_by_class(6)

# Search
results = manager.search_books('science')

# Get statistics
stats = manager.get_statistics()
print(f"Total books: {stats['total_books']}")
print(f"Total PDFs: {stats['total_pdfs']}")
```

## ⚡ Performance Tips

1. **Rate Limiting**: Add delays between requests
   ```python
   time.sleep(1)  # 1 second delay between pages
   ```

2. **Parallel Downloads**: Use threading for faster downloads
   ```python
   from concurrent.futures import ThreadPoolExecutor
   
   with ThreadPoolExecutor(max_workers=5) as executor:
       executor.map(download_pdf, pdf_urls)
   ```

3. **Resume Downloads**: Check if files exist before downloading
   ```python
   if not file_path.exists():
       download_pdf(url, file_path)
   ```

## 🛠️ Troubleshooting

### Issue: Scraper not finding PDFs

**Solution:** The website may use dynamic content. Check if JavaScript is loading PDFs.

```python
# Use Selenium for dynamic content
from selenium import webdriver
driver = webdriver.Chrome()
driver.get(url)
# ... extract PDFs from rendered page
```

### Issue: Download fails with timeout

**Solution:** Increase timeout or retry failed downloads

```python
response = self.session.get(url, timeout=120)  # 2 minutes
```

### Issue: PDF links are broken

**Solution:** Some links may be relative. Use `urljoin`:

```python
from urllib.parse import urljoin
full_url = urljoin(base_url, pdf_link)
```

## 📝 Logging

All operations are logged. Check logs for debugging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Logs include:
- Scraping progress
- Download status
- Errors and warnings
- Success/failure counts

## 🤝 Integration with Your FastAPI App

### Current Route Structure
```python
@router.get("/list")
async def list_books(class_num: int = None):
    # Your existing code
```

### Updated Route Structure
```python
@router.get("/list")
async def list_books(
    class_num: Optional[int] = None,
    subject: Optional[str] = None,
    search: Optional[str] = None
):
    # Uses scraped data from JSON
    books = data_manager.get_all_books()
    # ... filtering logic
```

## 📈 Statistics

After running the scraper, you'll get:

```json
{
  "total_books": 150,
  "total_pdfs": 2500,
  "by_class": {
    "Class I": {
      "books": 5,
      "pdfs": 75,
      "subjects": ["Hindi", "English", "Math"]
    }
  }
}
```

## 🔐 Best Practices

1. **Respect the website**: Add delays, don't overload the server
2. **Handle errors**: Use try-catch for network issues
3. **Save progress**: Save data incrementally
4. **Verify downloads**: Check file sizes and integrity
5. **Update regularly**: Run scraper periodically for new books

## 🆘 Support

For issues or questions:
1. Check logs for error messages
2. Verify internet connection
3. Ensure website structure hasn't changed
4. Try with smaller dataset first (one class)

## 📜 License

Free to use for educational purposes.

## 🙏 Credits

Data source: Bihar Education Project Council (BEPC)
Website: https://bepclots.bihar.gov.in/

---

**Note**: This scraper is for educational purposes. Always respect the website's terms of service and robots.txt.
