#!/usr/bin/env python3
"""
Bihar Board Books - Quick Start Script
Run this to scrape and download Bihar Board textbooks
"""

import sys
import json
from pathlib import Path
import argparse

def check_dependencies():
    """Check if all required packages are installed"""
    required = ['requests', 'bs4', 'fastapi']
    missing = []
    
    for package in required:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print("❌ Missing dependencies:")
        for pkg in missing:
            print(f"   - {pkg}")
        print("\n💡 Install with: pip install -r requirements.txt")
        return False
    
    return True


def scrape_books(limit_classes=None):
    """Scrape books from website"""
    print("\n" + "="*60)
    print("📚 SCRAPING BIHAR BOARD BOOKS")
    print("="*60)
    
    try:
        from bihar_books_scraper import BiharBoardBooksScraper
        
        scraper = BiharBoardBooksScraper()
        
        # Optionally limit to specific classes
        if limit_classes:
            scraper.CLASSES = {k: v for k, v in scraper.CLASSES.items() 
                             if any(str(c) in k for c in limit_classes)}
            print(f"Limiting to classes: {', '.join(map(str, limit_classes))}")
        
        # Scrape
        books = scraper.scrape_all_books()
        
        # Save
        scraper.save_to_json()
        
        # Summary
        summary = scraper.generate_summary()
        print("\n" + "="*60)
        print("✅ SCRAPING COMPLETE!")
        print("="*60)
        print(f"Total Books: {summary['total_books']}")
        print(f"Total PDFs: {summary['total_pdfs']}")
        print(f"\nData saved to: bihar_board_books.json")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during scraping: {e}")
        return False


def download_books(limit_books=None):
    """Download PDFs for all or specific books"""
    print("\n" + "="*60)
    print("⬇️  DOWNLOADING PDFS")
    print("="*60)
    
    # Check if books data exists
    if not Path('bihar_board_books.json').exists():
        print("❌ Books data not found!")
        print("   Run with --scrape first to fetch book metadata")
        return False
    
    try:
        from pdf_downloader import BiharBooksDownloader
        
        # Load books data
        with open('bihar_board_books.json', 'r', encoding='utf-8') as f:
            books_data = json.load(f)
        
        if limit_books:
            books_data = books_data[:limit_books]
            print(f"Limiting to first {limit_books} books")
        
        # Download
        downloader = BiharBooksDownloader(base_download_dir='bihar_board_books')
        summary = downloader.download_all_books(books_data)
        
        # Summary
        print("\n" + "="*60)
        print("✅ DOWNLOAD COMPLETE!")
        print("="*60)
        print(f"Books Downloaded: {summary['total_books']}")
        print(f"PDFs Downloaded: {summary['total_pdfs_downloaded']}")
        print(f"Failed: {summary['total_pdfs_failed']}")
        print(f"\nFiles saved to: {downloader.base_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during download: {e}")
        import traceback
        traceback.print_exc()
        return False


def show_statistics():
    """Show statistics from scraped data"""
    if not Path('bihar_board_books.json').exists():
        print("❌ Books data not found! Run with --scrape first")
        return
    
    try:
        from books_data_manager import BooksDataManager
        
        manager = BooksDataManager()
        stats = manager.get_statistics()
        
        print("\n" + "="*60)
        print("📊 BIHAR BOARD BOOKS STATISTICS")
        print("="*60)
        print(f"\nTotal Books: {stats['total_books']}")
        print(f"Total PDFs: {stats['total_pdfs']}")
        
        print(f"\nSubjects ({len(stats['subjects'])}):")
        for subject in sorted(stats['subjects']):
            print(f"  • {subject}")
        
        print(f"\nBooks by Class:")
        for class_name, data in sorted(stats['classes'].items()):
            print(f"\n  {class_name}:")
            print(f"    Books: {data['books']}")
            print(f"    PDFs: {data['pdfs']}")
            print(f"    Subjects: {', '.join(sorted(data['subjects']))}")
        
    except Exception as e:
        print(f"❌ Error showing statistics: {e}")


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='Bihar Board Books Scraper & Downloader',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Scrape all books
  python run_scraper.py --scrape
  
  # Scrape specific classes
  python run_scraper.py --scrape --classes 1 2 3
  
  # Download PDFs (after scraping)
  python run_scraper.py --download
  
  # Download limited number
  python run_scraper.py --download --limit 5
  
  # Full workflow
  python run_scraper.py --scrape --download
  
  # Show statistics
  python run_scraper.py --stats
        """
    )
    
    parser.add_argument('--scrape', action='store_true', 
                       help='Scrape books from website')
    parser.add_argument('--download', action='store_true',
                       help='Download PDFs')
    parser.add_argument('--stats', action='store_true',
                       help='Show statistics')
    parser.add_argument('--classes', type=int, nargs='+',
                       help='Limit to specific classes (e.g., --classes 1 2 3)')
    parser.add_argument('--limit', type=int,
                       help='Limit number of books to download')
    parser.add_argument('--check', action='store_true',
                       help='Check dependencies')
    
    args = parser.parse_args()
    
    # Show help if no arguments
    if len(sys.argv) == 1:
        parser.print_help()
        return
    
    # Check dependencies
    if args.check or args.scrape or args.download:
        print("🔍 Checking dependencies...")
        if not check_dependencies():
            sys.exit(1)
        print("✅ All dependencies installed\n")
    
    # Execute actions
    success = True
    
    if args.scrape:
        success = scrape_books(limit_classes=args.classes)
        if not success:
            sys.exit(1)
    
    if args.download:
        success = download_books(limit_books=args.limit)
        if not success:
            sys.exit(1)
    
    if args.stats:
        show_statistics()
    
    if success and (args.scrape or args.download):
        print("\n✨ All operations completed successfully!")
        print("\n📚 Next steps:")
        if args.scrape and not args.download:
            print("   - Run with --download to download PDFs")
        print("   - Run with --stats to see detailed statistics")
        print("   - Integrate updated_books_route.py into your FastAPI app")


if __name__ == "__main__":
    main()
