"""
Bihar Board Books Scraper
Scrapes all textbooks from https://bepclots.bihar.gov.in/
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urljoin, urlparse
import time
from typing import List, Dict, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BiharBoardBooksScraper:
    """Scraper for Bihar Board e-LOTS textbooks"""
    
    BASE_URL = "https://bepclots.bihar.gov.in"
    
    # Class structure with their URLs
    CLASSES = {
        "Class I": "/category/class-i/",
        "Class II": "/category/class-ii/",
        "Class III": "/category/class-iii/",
        "Class IV": "/category/class-iv/",
        "Class V": "/category/class-v/",
        "Class VI": "/category/class-vi/",
        "Class VII": "/category/class-vii/",
        "Class VIII": "/category/class-viii/",
        "Class IX": "/category/class-ix/",
        "Class X": "/category/class-x/",
        "Class XI": "/category/class-xi/",
        "Class XII": "/category/class-xii/",
    }
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.all_books = []
        
    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse a webpage"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def extract_pdf_links(self, soup: BeautifulSoup, base_url: str) -> List[Dict]:
        """Extract all PDF links from a page"""
        pdf_links = []
        
        # Find all links that end with .pdf
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            
            if href.endswith('.pdf') or '.pdf' in href:
                pdf_url = urljoin(base_url, href)
                text = link.get_text(strip=True)
                
                # Get parent context for better naming
                parent = link.find_parent(['div', 'p', 'li', 'td'])
                context = parent.get_text(strip=True) if parent else text
                
                pdf_links.append({
                    'url': pdf_url,
                    'title': text or 'Unnamed PDF',
                    'context': context[:200]  # First 200 chars of context
                })
        
        return pdf_links
    
    def get_book_pages_from_class(self, class_url: str) -> List[str]:
        """Get all book/subject pages from a class listing page"""
        soup = self.fetch_page(class_url)
        if not soup:
            return []
        
        book_pages = []
        
        # Find all article links (book pages)
        for article in soup.find_all('article'):
            link = article.find('a', href=True)
            if link:
                href = link.get('href')
                if href and not href.startswith('#'):
                    book_pages.append(href)
        
        # Also check for direct category links
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href and ('category' in href or class_url.split('/')[-2] in href):
                if href not in book_pages and not href.endswith('.pdf'):
                    book_pages.append(href)
        
        return list(set(book_pages))  # Remove duplicates
    
    def scrape_book_page(self, book_url: str, class_name: str) -> Dict:
        """Scrape a single book page for PDFs and metadata"""
        logger.info(f"Scraping book page: {book_url}")
        
        soup = self.fetch_page(book_url)
        if not soup:
            return None
        
        # Extract metadata
        title_tag = soup.find('h1', class_='entry-title')
        title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"
        
        # Get subject from categories
        subject = "Unknown"
        category_links = soup.find_all('a', rel='category tag')
        for cat in category_links:
            cat_text = cat.get_text(strip=True)
            if class_name.replace('Class ', '').strip() not in cat_text:
                subject = cat_text
                break
        
        # Extract all PDFs
        pdfs = self.extract_pdf_links(soup, book_url)
        
        # Try to extract chapters from accordion/collapsible content
        chapters = []
        for heading in soup.find_all(['h4', 'h3', 'h2']):
            heading_text = heading.get_text(strip=True)
            
            # Find PDFs near this heading
            parent = heading.find_parent(['div', 'section', 'article'])
            if parent:
                chapter_pdfs = []
                for link in parent.find_all('a', href=True):
                    href = link.get('href', '')
                    if href.endswith('.pdf') or '.pdf' in href:
                        chapter_pdfs.append({
                            'url': urljoin(book_url, href),
                            'title': link.get_text(strip=True) or 'Download'
                        })
                
                if chapter_pdfs:
                    chapters.append({
                        'chapter_name': heading_text,
                        'pdfs': chapter_pdfs
                    })
        
        book_data = {
            'class': class_name,
            'subject': subject,
            'book_title': title,
            'book_url': book_url,
            'chapters': chapters if chapters else None,
            'all_pdfs': pdfs,
            'total_pdfs': len(pdfs)
        }
        
        return book_data
    
    def scrape_all_books(self) -> List[Dict]:
        """Scrape all books from all classes"""
        logger.info("Starting to scrape all Bihar Board books...")
        
        all_books_data = []
        
        for class_name, class_path in self.CLASSES.items():
            logger.info(f"\n{'='*60}")
            logger.info(f"Processing {class_name}")
            logger.info(f"{'='*60}")
            
            class_url = urljoin(self.BASE_URL, class_path)
            
            # Get all book pages for this class
            book_pages = self.get_book_pages_from_class(class_url)
            logger.info(f"Found {len(book_pages)} book pages for {class_name}")
            
            for book_page_url in book_pages[:10]:  # Limit for testing
                book_data = self.scrape_book_page(book_page_url, class_name)
                if book_data and book_data['total_pdfs'] > 0:
                    all_books_data.append(book_data)
                    logger.info(f"  ✓ {book_data['book_title']}: {book_data['total_pdfs']} PDFs")
                
                # Be respectful - add delay
                time.sleep(1)
            
            # Delay between classes
            time.sleep(2)
        
        self.all_books = all_books_data
        return all_books_data
    
    def save_to_json(self, filename: str = "bihar_board_books.json"):
        """Save scraped data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.all_books, f, indent=2, ensure_ascii=False)
        logger.info(f"\nSaved {len(self.all_books)} books to {filename}")
    
    def generate_summary(self) -> Dict:
        """Generate summary statistics"""
        summary = {
            'total_books': len(self.all_books),
            'total_pdfs': sum(book['total_pdfs'] for book in self.all_books),
            'by_class': {}
        }
        
        for book in self.all_books:
            class_name = book['class']
            if class_name not in summary['by_class']:
                summary['by_class'][class_name] = {
                    'books': 0,
                    'pdfs': 0,
                    'subjects': set()
                }
            
            summary['by_class'][class_name]['books'] += 1
            summary['by_class'][class_name]['pdfs'] += book['total_pdfs']
            summary['by_class'][class_name]['subjects'].add(book['subject'])
        
        # Convert sets to lists for JSON serialization
        for class_data in summary['by_class'].values():
            class_data['subjects'] = list(class_data['subjects'])
        
        return summary


def main():
    """Main function to run the scraper"""
    scraper = BiharBoardBooksScraper()
    
    # Scrape all books
    books = scraper.scrape_all_books()
    
    # Save to JSON
    scraper.save_to_json("bihar_board_books.json")
    
    # Generate and save summary
    summary = scraper.generate_summary()
    with open("bihar_board_books_summary.json", 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "="*60)
    print("SCRAPING COMPLETE!")
    print("="*60)
    print(f"Total Books: {summary['total_books']}")
    print(f"Total PDFs: {summary['total_pdfs']}")
    print("\nBooks by Class:")
    for class_name, data in summary['by_class'].items():
        print(f"  {class_name}: {data['books']} books, {data['pdfs']} PDFs")
    
    return books


if __name__ == "__main__":
    main()
