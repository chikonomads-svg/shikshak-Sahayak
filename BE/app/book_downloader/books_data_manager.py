"""
Data models and database helper for Bihar Board Books
"""

import json
from typing import List, Dict, Optional
from pathlib import Path
from datetime import datetime


class BooksDataManager:
    """Manage books data for FastAPI integration"""
    
    def __init__(self, data_file: str = "bihar_board_books.json"):
        self.data_file = data_file
        self.books_data = []
        self.load_data()
    
    def load_data(self):
        """Load books data from JSON file"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.books_data = json.load(f)
        except FileNotFoundError:
            self.books_data = []
    
    def save_data(self):
        """Save books data to JSON file"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.books_data, f, indent=2, ensure_ascii=False)
    
    def get_all_books(self) -> List[Dict]:
        """Get all books"""
        return self.books_data
    
    def get_books_by_class(self, class_num: int) -> List[Dict]:
        """Get books filtered by class number"""
        class_name = f"Class {self._int_to_roman(class_num) if class_num <= 10 else class_num}"
        return [
            book for book in self.books_data 
            if class_name.lower() in book.get('class', '').lower()
        ]
    
    def get_books_by_subject(self, subject: str) -> List[Dict]:
        """Get books filtered by subject"""
        return [
            book for book in self.books_data
            if subject.lower() in book.get('subject', '').lower()
        ]
    
    def get_book_by_id(self, book_id: str) -> Optional[Dict]:
        """Get a single book by ID (generated from title)"""
        for book in self.books_data:
            if self._generate_book_id(book) == book_id:
                return book
        return None
    
    def search_books(self, query: str) -> List[Dict]:
        """Search books by title, subject, or class"""
        query = query.lower()
        results = []
        
        for book in self.books_data:
            if (query in book.get('book_title', '').lower() or
                query in book.get('subject', '').lower() or
                query in book.get('class', '').lower()):
                results.append(book)
        
        return results
    
    def get_subjects_by_class(self, class_num: int) -> List[str]:
        """Get all unique subjects for a class"""
        books = self.get_books_by_class(class_num)
        subjects = set(book.get('subject', '') for book in books)
        return sorted(list(subjects))
    
    def get_statistics(self) -> Dict:
        """Get statistics about the books database"""
        stats = {
            'total_books': len(self.books_data),
            'total_pdfs': sum(book.get('total_pdfs', 0) for book in self.books_data),
            'classes': {},
            'subjects': set()
        }
        
        for book in self.books_data:
            class_name = book.get('class', 'Unknown')
            subject = book.get('subject', 'Unknown')
            
            stats['subjects'].add(subject)
            
            if class_name not in stats['classes']:
                stats['classes'][class_name] = {
                    'books': 0,
                    'pdfs': 0,
                    'subjects': set()
                }
            
            stats['classes'][class_name]['books'] += 1
            stats['classes'][class_name]['pdfs'] += book.get('total_pdfs', 0)
            stats['classes'][class_name]['subjects'].add(subject)
        
        # Convert sets to lists
        stats['subjects'] = sorted(list(stats['subjects']))
        for class_data in stats['classes'].values():
            class_data['subjects'] = sorted(list(class_data['subjects']))
        
        return stats
    
    def _generate_book_id(self, book: Dict) -> str:
        """Generate unique ID for a book"""
        title = book.get('book_title', 'unknown')
        class_name = book.get('class', 'unknown')
        subject = book.get('subject', 'unknown')
        
        id_string = f"{class_name}_{subject}_{title}".lower()
        id_string = ''.join(c if c.isalnum() else '_' for c in id_string)
        return id_string
    
    def _int_to_roman(self, num: int) -> str:
        """Convert integer to Roman numeral (for class names)"""
        val = [
            1000, 900, 500, 400,
            100, 90, 50, 40,
            10, 9, 5, 4, 1
        ]
        syms = [
            'M', 'CM', 'D', 'CD',
            'C', 'XC', 'L', 'XL',
            'X', 'IX', 'V', 'IV', 'I'
        ]
        roman_num = ''
        i = 0
        while num > 0:
            for _ in range(num // val[i]):
                roman_num += syms[i]
                num -= val[i]
            i += 1
        return roman_num
    
    def format_for_api(self, book: Dict) -> Dict:
        """Format book data for API response"""
        return {
            'id': self._generate_book_id(book),
            'class_num': self._extract_class_number(book.get('class', '')),
            'class_name': book.get('class', 'Unknown'),
            'subject': book.get('subject', 'Unknown'),
            'title': book.get('book_title', 'Unknown'),
            'url': book.get('book_url', ''),
            'total_pdfs': book.get('total_pdfs', 0),
            'chapters': self._format_chapters(book.get('chapters', [])),
            'all_pdfs': book.get('all_pdfs', [])
        }
    
    def _extract_class_number(self, class_str: str) -> int:
        """Extract numeric class number from class string"""
        import re
        match = re.search(r'\d+', class_str)
        if match:
            return int(match.group())
        
        # Roman to int conversion
        roman_map = {
            'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
            'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
            'XI': 11, 'XII': 12
        }
        
        for roman, num in roman_map.items():
            if roman in class_str.upper():
                return num
        
        return 0
    
    def _format_chapters(self, chapters: List) -> List[Dict]:
        """Format chapters data"""
        if not chapters:
            return []
        
        formatted = []
        for i, chapter in enumerate(chapters, 1):
            formatted.append({
                'chapter_number': i,
                'chapter_name': chapter.get('chapter_name', f'Chapter {i}'),
                'pdfs': chapter.get('pdfs', [])
            })
        
        return formatted


# Example usage functions for FastAPI integration

def get_all_books():
    """Get all books (for FastAPI route)"""
    manager = BooksDataManager()
    return [manager.format_for_api(book) for book in manager.get_all_books()]


def get_book_by_id(book_id: str):
    """Get book by ID (for FastAPI route)"""
    manager = BooksDataManager()
    book = manager.get_book_by_id(book_id)
    if book:
        return manager.format_for_api(book)
    return None


def get_chapter_content(book_id: str, chapter_id: str):
    """Get chapter content (for FastAPI route)"""
    manager = BooksDataManager()
    book = manager.get_book_by_id(book_id)
    
    if not book or not book.get('chapters'):
        return None
    
    try:
        chapter_index = int(chapter_id) - 1
        if 0 <= chapter_index < len(book['chapters']):
            chapter = book['chapters'][chapter_index]
            return {
                'chapter_number': int(chapter_id),
                'chapter_name': chapter.get('chapter_name', ''),
                'pdfs': chapter.get('pdfs', []),
                'book_title': book.get('book_title', '')
            }
    except (ValueError, IndexError):
        pass
    
    return None


if __name__ == "__main__":
    # Test the data manager
    manager = BooksDataManager()
    
    print("Books Database Statistics:")
    print("="*60)
    
    stats = manager.get_statistics()
    print(f"Total Books: {stats['total_books']}")
    print(f"Total PDFs: {stats['total_pdfs']}")
    print(f"\nSubjects: {', '.join(stats['subjects'])}")
    
    print("\nBooks by Class:")
    for class_name, data in stats['classes'].items():
        print(f"  {class_name}: {data['books']} books, {data['pdfs']} PDFs")
        print(f"    Subjects: {', '.join(data['subjects'])}")
