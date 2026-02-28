# 🚀 QUICK START GUIDE

## Bihar Board Books Scraper - Complete Solution

### 📦 What You Got

✅ **Complete scraper** to fetch all Bihar Board books (Classes 1-12)  
✅ **PDF downloader** with organized folder structure  
✅ **FastAPI integration** ready to use  
✅ **Data management** system  
✅ **Easy-to-use** command-line tool  

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Scrape Books
```bash
python run_scraper.py --scrape
```

This creates `bihar_board_books.json` with all book metadata.

### Step 3: Download PDFs (Optional)
```bash
python run_scraper.py --download
```

This downloads all PDFs to `bihar_board_books/` folder.

---

## 📁 Files Included

| File | Purpose |
|------|---------|
| `bihar_books_scraper.py` | Main scraper - fetches book metadata |
| `pdf_downloader.py` | Downloads PDFs in organized folders |
| `books_data_manager.py` | Data models & API helpers |
| `updated_books_route.py` | FastAPI routes (replace your existing) |
| `run_scraper.py` | **Easy command-line tool** ⭐ |
| `requirements.txt` | Python dependencies |
| `README.md` | Complete documentation |

---

## 🎯 Common Usage

### Scrape Specific Classes
```bash
# Only scrape Classes 1, 2, 3
python run_scraper.py --scrape --classes 1 2 3
```

### Download Limited Books (Testing)
```bash
# Download only first 5 books
python run_scraper.py --download --limit 5
```

### Full Workflow
```bash
# Scrape and download in one command
python run_scraper.py --scrape --download
```

### View Statistics
```bash
python run_scraper.py --stats
```

---

## 🔧 FastAPI Integration

### Replace Your Books Route

**Current file:** `app/routes/books_route.py`

**Replace with:** `updated_books_route.py`

```python
# In your main app
from updated_books_route import router as books_router

app.include_router(books_router)
```

### New API Endpoints Available

```
GET  /books/list              # List all books (with filters)
GET  /books/statistics         # Get stats
GET  /books/classes            # List all classes
GET  /books/subjects           # List all subjects
GET  /books/{book_id}          # Get book details
GET  /books/search/?q=math     # Search books
POST /books/scrape/update      # Update database
POST /books/download/{book_id} # Download book PDFs
```

---

## 📊 Expected Output

### After Scraping
```
bihar_board_books.json           ← Complete database
bihar_board_books_summary.json   ← Statistics
```

### After Downloading
```
bihar_board_books/
├── Class_I/
│   ├── English/
│   │   └── Blossom/
│   │       ├── chapter_1.pdf
│   │       ├── chapter_2.pdf
│   │       └── metadata.json
│   └── Mathematics/
├── Class_II/
└── ...
```

---

## 💡 Pro Tips

### 1. Start Small
Test with a few classes first:
```bash
python run_scraper.py --scrape --classes 1
python run_scraper.py --download --limit 3
```

### 2. Check Progress
View statistics after scraping:
```bash
python run_scraper.py --stats
```

### 3. Resume Downloads
Already downloaded PDFs are skipped automatically.

### 4. Check Dependencies
```bash
python run_scraper.py --check
```

---

## 🛠️ Troubleshooting

### Problem: "Module not found"
**Solution:**
```bash
pip install -r requirements.txt
```

### Problem: "Books data not found"
**Solution:** Run scraper first:
```bash
python run_scraper.py --scrape
```

### Problem: Download is slow
**Solution:** This is normal. PDFs are large. Be patient! ☕

### Problem: Some PDFs fail
**Solution:** Website might be temporarily down. Check logs and retry.

---

## 📈 What to Expect

### Scraping Time
- **Classes 1-12**: ~10-20 minutes
- **Single class**: ~1-2 minutes

### Download Time
- **All books**: Several hours (depends on internet)
- **Single class**: ~30-60 minutes

### Storage Space
- **JSON data**: ~5-10 MB
- **All PDFs**: ~5-10 GB (estimated)

---

## 🎓 Example Workflow

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Test with Class 1 only
python run_scraper.py --scrape --classes 1

# 3. Check what you got
python run_scraper.py --stats

# 4. Download Class 1 books
python run_scraper.py --download

# 5. If all good, scrape everything
python run_scraper.py --scrape

# 6. Download everything (run overnight)
nohup python run_scraper.py --download &
```

---

## 📚 Data Structure

### Books JSON Format
Each book contains:
- Class name (e.g., "Class I")
- Subject (e.g., "Mathematics")
- Book title
- URL to book page
- Chapters (if available)
- All PDF links
- Total PDF count

### API Response Format
```json
{
  "id": "class_i_mathematics_ganit",
  "class_num": 1,
  "subject": "Mathematics",
  "title": "गणित (Ganit)",
  "total_pdfs": 15,
  "chapters": [...]
}
```

---

## 🚨 Important Notes

1. **Be Respectful**: The scraper includes delays. Don't modify them.
2. **Internet Required**: Both scraping and downloading need stable internet.
3. **Storage Space**: Ensure you have enough disk space (~10 GB).
4. **Time Required**: Full download takes hours. Use `nohup` to run in background.
5. **Legal**: This is for educational purposes. Respect website's terms of service.

---

## 🆘 Need Help?

1. **Check Logs**: All operations are logged
2. **Read README.md**: Complete documentation
3. **Test Small**: Start with 1-2 classes
4. **Check Website**: Ensure https://bepclots.bihar.gov.in/ is accessible

---

## ✨ Next Steps

After successful scraping and downloading:

1. ✅ Integrate `updated_books_route.py` into your FastAPI app
2. ✅ Test the API endpoints
3. ✅ Build your frontend to consume the API
4. ✅ Schedule regular updates (weekly/monthly)

---

## 🎉 You're All Set!

Start with:
```bash
python run_scraper.py --scrape --classes 1
```

Good luck! 🚀
