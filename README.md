# शिक्षक सहायक (Shikshak Sahayak) — Bihar Board Teachers App

A real-time educational tool and assistant designed for Bihar Board government teachers, featuring an AI chatbot, news feed, MCQ problem generator, digital books, and important notices.

## 🚀 Quick Start

### Backend (FastAPI - Python)

1. Navigate to the `BE` directory:
   ```bash
   cd BE
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create an environment file:
   Copy `.env.example` to `.env` and fill in your Azure OpenAI and Tavily API keys.

5. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   - API Docs: http://localhost:8001/docs
   - Health Check: http://localhost:8001/health

### Frontend (React + Vite)

1. Navigate to the `FE` directory:
   ```bash
   cd FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   - Access the app at: http://localhost:5173

## 🛠️ Tech Stack
- **Backend**: Python, FastAPI, Uvicorn, Azure OpenAI (for chatbot/MCQ), Tavily API (for news).
- **Frontend**: React, Vite, React Router, Framer Motion, Tailwind-like custom CSS (Glassmorphism layout).

## 🌍 Platform Features
- **डैशबोर्ड (Dashboard)**: At-a-glance view of news, notices, and quick access.
- **चैटबॉट (AI Chatbot)**: Ask any teaching or curriculum-related questions in Hindi or English.
- **समाचार (News)**: Real-time Bihar education sector news.
- **पढ़ाएं (Teach/MCQ)**: AI-powered class 1-8 syllabus-based quiz generator.
- **किताबें (Books)**: Read digital copies of textbooks for all subjects.
- **सूचना (Notice)**: Important circulars from the Bihar Education Department.
