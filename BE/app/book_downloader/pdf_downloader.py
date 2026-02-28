"""
PDF Download Manager for Bihar Board Books
Downloads and organizes PDFs into proper folder structure
"""

import os
import requests
from pathlib import Path
import json
from typing import List, Dict
import logging
from urllib.parse import urlparse
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BiharBooksDownloader:
    """Download and organize Bihar Board textbook PDFs"""
    
    def __init__(self, base_download_dir: str = "downloaded_books"):
        self.base_dir = Path(base_download_dir)
        self.base_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.download_log = []
        
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename to be filesystem-safe"""
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        
        # Limit length
        if len(filename) > 200:
            filename = filename[:200]
        
        return filename.strip()
    
    def get_filename_from_url(self, url: str, default_name: str = "book.pdf") -> str:
        """Extract filename from URL"""
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        
        if not filename or not filename.endswith('.pdf'):
            # Generate from hash if no good filename
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            filename = f"{self.sanitize_filename(default_name)}_{url_hash}.pdf"
        
        return filename
    
    def create_folder_structure(self, class_name: str, subject: str, book_title: str) -> Path:
        """Create organized folder structure"""
        # Create: downloaded_books/Class_I/Mathematics/Book_Name/
        class_folder = self.base_dir / self.sanitize_filename(class_name)
        subject_folder = class_folder / self.sanitize_filename(subject)
        book_folder = subject_folder / self.sanitize_filename(book_title)
        
        book_folder.mkdir(parents=True, exist_ok=True)
        return book_folder
    
    def download_pdf(self, url: str, save_path: Path, filename: str = None) -> bool:
        """Download a single PDF file"""
        try:
            if not filename:
                filename = self.get_filename_from_url(url)
            
            file_path = save_path / filename
            
            # Skip if already exists
            if file_path.exists():
                logger.info(f"✓ Already exists: {filename}")
                return True
            
            logger.info(f"Downloading: {filename}")
            response = self.session.get(url, timeout=60, stream=True)
            response.raise_for_status()
            
            # Download in chunks
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            file_size = file_path.stat().st_size / (1024 * 1024)  # MB
            logger.info(f"✓ Downloaded: {filename} ({file_size:.2f} MB)")
            
            self.download_log.append({
                'url': url,
                'filepath': str(file_path),
                'filename': filename,
                'size_mb': round(file_size, 2),
                'status': 'success'
            })
            
            return True
            
        except Exception as e:
            logger.error(f"✗ Failed to download {url}: {e}")
            self.download_log.append({
                'url': url,
                'filename': filename,
                'status': 'failed',
                'error': str(e)
            })
            return False
    
    def download_book(self, book_data: Dict, download_chapters: bool = True) -> Dict:
        """Download all PDFs for a single book"""
        class_name = book_data['class']
        subject = book_data['subject']
        book_title = book_data['book_title']
        
        logger.info(f"\n{'='*60}")
        logger.info(f"Downloading: {class_name} - {subject} - {book_title}")
        logger.info(f"{'='*60}")
        
        # Create folder structure
        book_folder = self.create_folder_structure(class_name, subject, book_title)
        
        downloaded_count = 0
        failed_count = 0
        
        # Download chapter-wise PDFs
        if download_chapters and book_data.get('chapters'):
            for chapter in book_data['chapters']:
                chapter_name = chapter['chapter_name']
                logger.info(f"\nChapter: {chapter_name}")
                
                # Create chapter subfolder
                chapter_folder = book_folder / self.sanitize_filename(chapter_name)
                chapter_folder.mkdir(exist_ok=True)
                
                for pdf in chapter['pdfs']:
                    pdf_title = pdf.get('title', 'chapter.pdf')
                    filename = self.sanitize_filename(pdf_title) + '.pdf'
                    
                    if self.download_pdf(pdf['url'], chapter_folder, filename):
                        downloaded_count += 1
                    else:
                        failed_count += 1
        
        # Download all other PDFs
        if book_data.get('all_pdfs'):
            for pdf in book_data['all_pdfs']:
                pdf_title = pdf.get('title', 'unknown')
                filename = self.sanitize_filename(pdf_title) + '.pdf'
                
                if self.download_pdf(pdf['url'], book_folder, filename):
                    downloaded_count += 1
                else:
                    failed_count += 1
        
        # Save book metadata
        metadata_file = book_folder / 'metadata.json'
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(book_data, f, indent=2, ensure_ascii=False)
        
        result = {
            'book_title': book_title,
            'folder': str(book_folder),
            'downloaded': downloaded_count,
            'failed': failed_count,
            'total': downloaded_count + failed_count
        }
        
        logger.info(f"\n✓ Book complete: {downloaded_count} downloaded, {failed_count} failed")
        return result
    
    def download_all_books(self, books_data: List[Dict]) -> Dict:
        """Download all books from scraped data"""
        logger.info(f"\nStarting download of {len(books_data)} books...")
        
        results = []
        total_downloaded = 0
        total_failed = 0
        
        for i, book in enumerate(books_data, 1):
            logger.info(f"\n[{i}/{len(books_data)}]")
            result = self.download_book(book)
            results.append(result)
            
            total_downloaded += result['downloaded']
            total_failed += result['failed']
        
        summary = {
            'total_books': len(books_data),
            'total_pdfs_downloaded': total_downloaded,
            'total_pdfs_failed': total_failed,
            'books': results
        }
        
        # Save download log
        log_file = self.base_dir / 'download_log.json'
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(self.download_log, f, indent=2, ensure_ascii=False)
        
        # Save summary
        summary_file = self.base_dir / 'download_summary.json'
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        return summary


def main():
    """Main function to download books"""
    # Load scraped books data
    with open('bihar_board_books.json', 'r', encoding='utf-8') as f:
        books_data = json.load(f)
    
    # Create downloader
    downloader = BiharBooksDownloader(base_download_dir='bihar_board_books')
    
    # Download all books
    summary = downloader.download_all_books(books_data)
    
    # Print final summary
    print("\n" + "="*60)
    print("DOWNLOAD COMPLETE!")
    print("="*60)
    print(f"Total Books: {summary['total_books']}")
    print(f"PDFs Downloaded: {summary['total_pdfs_downloaded']}")
    print(f"PDFs Failed: {summary['total_pdfs_failed']}")
    print(f"\nFiles saved to: {downloader.base_dir}")


if __name__ == "__main__":
    main()
