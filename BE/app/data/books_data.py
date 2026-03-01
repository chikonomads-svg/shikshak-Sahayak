"""
Data models and database helper for Bihar Board Books
Adapted for Shikshak Sahayak
"""

import json
from typing import List, Dict, Optional
from pathlib import Path
import re

class BooksDataManager:
    """Manage books data for FastAPI integration"""
    
    def __init__(self, data_file: str = None):
        if data_file is None:
            # Resolve to BE/app/data/bihar_board_books.json
            base_dir = Path(__file__).parent
            self.data_file = str(base_dir / "bihar_board_books.json")
        else:
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
        self.load_data()
        return self.books_data
    
    def get_books_by_class(self, class_num: int) -> List[Dict]:
        """Get books filtered by class number"""
        self.load_data()
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
        """Get a single book by ID"""
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
                    'subjects': set()
                }
            
            stats['classes'][class_name]['books'] += 1
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
        """Convert integer to Roman numeral"""
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
            'book_url': book.get('book_url', ''),
            'solution_url': book.get('solution_url', '')
        }
    
    def _extract_class_number(self, class_str: str) -> int:
        """Extract numeric class number from class string"""
        match = re.search(r'\d+', class_str)
        if match:
            return int(match.group())
        
        roman_map = {
            'XII': 12, 'XI': 11, 'IX': 9, 'VIII': 8, 'VII': 7, 
            'VI': 6, 'IV': 4, 'V': 5, 'III': 3, 'II': 2, 'I': 1, 'X': 10
        }
        
        class_upper = class_str.upper()
        # Sort by length descending to match XII before X, etc.
        for roman in sorted(roman_map.keys(), key=len, reverse=True):
            if roman in class_upper.split():
                return roman_map[roman]
                
        return 0
    
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
