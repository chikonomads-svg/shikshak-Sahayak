import json
from bs4 import BeautifulSoup

def parse_html():
    file_path = "BE/app/data/bihar_board_books.html"
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html_content = f.read()
            
        soup = BeautifulSoup(html_content, 'html.parser')
        
        links = soup.find_all('a')
        res = []
        for a in links:
            text = a.text.strip()
            href = a.get("href")
            if text and href:
                res.append({"text": text, "href": href})
        
        with open("links_output.json", "w", encoding="utf-8") as out:
            json.dump(res, out, indent=2, ensure_ascii=False)
            
        print(f"Extracted {len(res)} links.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parse_html()
