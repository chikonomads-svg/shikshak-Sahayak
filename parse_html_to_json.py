import json
import re
from bs4 import BeautifulSoup
from pathlib import Path

def parse():
    html_file = "BE/app/data/bihar_board_books.html"
    json_file = "BE/app/data/bihar_board_books.json"
    
    with open(html_file, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    books = []
    # Find all solution links mapped by class
    solution_links = {}
    for a in soup.find_all('a'):
        text = a.text.strip()
        href = a.get("href")
        if not text or not href: continue
        
        # e.g., Bihar Board Solutions Class 8
        sol_match = re.search(r'Bihar Board Solutions Class (\d+)', text)
        if sol_match:
            class_num = int(sol_match.group(1))
            solution_links[class_num] = href
            
    for a in soup.find_all('a'):
        text = a.text.strip()
        href = a.get("href")
        if not text or not href: continue
        
        # Extract book info
        # Format: Bihar Board Class 8 Science Book (विज्ञान)
        match = re.search(r'Bihar Board Class (\d+) (.*?) Book \((.*?)\)', text)
        if match:
            class_num = int(match.group(1))
            if 1 <= class_num <= 8:
                subject_eng = match.group(2).strip()
                title_hindi = match.group(3).strip()
                
                # Check if this book already exists to avoid duplicates
                book_id = f"class_{class_num}_{subject_eng.lower().replace(' ', '_')}"
                if not any(b['id'] == book_id for b in books):
                    books.append({
                        "id": book_id,
                        "class": f"Class {class_num}",
                        "subject": subject_eng,
                        "book_title": title_hindi,
                        "book_url": href,
                        "solution_url": solution_links.get(class_num, "")
                    })
    
    # Save the output
    Path(json_file).parent.mkdir(parents=True, exist_ok=True)
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(books)} books to {json_file}")

if __name__ == "__main__":
    parse()
