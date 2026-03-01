# Shikshak Sahayak (शिक्षक सहायक)
**The Ultimate Digital Companion for Bihar Board Teachers**

Shikshak Sahayak is a state-of-the-art educational application tailored specifically for the educators of the Bihar School Examination Board (BSEB). Built on modern architecture (FastAPI Backend + React Frontend + PostgreSQL), it leverages cutting-edge AI and advanced data capabilities to bring the entire Bihar education ecosystem into the palms of teachers' hands.

---

## 🌟 Value Proposition for the Bihar Board
As the Bihar Board rapidly modernizes its digital infrastructure, **Shikshak Sahayak** provides a ready-made, highly scalable tool to empower its largest asset: **The Teachers**.

By consolidating lesson planning, textbook access, departmental notices, and AI assistance into a single unified dashboard, Shikshak Sahayak dramatically reduces administrative overhead, allowing teachers to focus entirely on what matters most—student outcomes in the classroom.

### Core Objectives:
1. **Reduce Preparation Time:** AI-generated lesson plans and quizzes.
2. **Centralize Information:** Instant access to departmental notices, transfer orders, salary updates, and educational news.
3. **Universal Access:** A complete, mapped digital library of all BSEB prescribed textbooks and solutions from Class 1 to 8.

---

## 🚀 Key Features

### 1. 🤖 AI Teaching Assistant (चैटबॉट / Chatbot)
- **Context-Aware Assistance:** Powered by advanced Large Language Models, the bot answers curriculum-specific queries, explains complex pedagogical concepts, and helps draft school communications.
- **24/7 Availability:** A virtual peer available to guide teachers around the clock.

### 2. 📝 Automated Lesson Planner (पढ़ाएं / Teach)
- **MCQ & Quiz Generation:** Automatically generates multiple-choice questions, descriptive assignments, and grading keys tailored for specified grade levels and subjects.
- **Smart Rubrics:** Provides AI-backed suggestions for evaluation metrics.

### 3. 📚 Comprehensive Digital Library (डिजिटल किताबें)
- **Classes 1-8 Covered:** Complete digital repository mapped to official BSEB textbooks (e.g., *Radiance, Blossom, Kislay, Amrita*).
- **One-Click Downloads:** Direct links to officially hosted PDFs for both the course materials and their respective solutions.
- **Integrated Storage:** Beautiful UI mappings removing the complexity of external website navigations.

### 4. 📢 Real-Time Notice Board & News Tracker (सूचना और समाचार)
- **Live Aggregator:** Automatically fetches, cleans, and structures live notices from the Bihar government education portals.
- **Categorized Updates:** Separates generic news from urgent notices (holidays, salary dispatches, transfer policies).

### 5. 🔒 Robust Security & User Profiles
- **PostgreSQL Powered:** A highly secure cloud database manages educator profiles and authentication.
- **Encrypted Credentials:** State-of-the-art SHA-256 password hashing.

---

## 🛠 Technology Stack

### Backend
- **Framework:** Python / FastAPI
- **Database:** PostgreSQL (Supabase integration)
- **AI/LLM:** Localized Chat/AI Engine proxying
- **Utilities:** BeautifulSoup4 (Web Scraping), Uvicorn

### Frontend
- **Framework:** React / Vite
- **Styling:** Vanilla CSS + Tailwind CSS utilities with Glassmorphism UI
- **Animations:** Framer Motion for premium UX

---

## 💻 Running the Project

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- A valid PostgreSQL database URL

### Start the Backend
```bash
cd BE
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set DATABASE_URL and LLM API KEYS in .env
uvicorn app.main:app --reload --port 8000
```

### Start the Frontend
```bash
cd FE
npm install
npm run dev
```

---

*For business inquiries, demo requests, and integration potentials with BSEB server infrastructures, please refer to the deployment instructions or contact the lead architect.*
