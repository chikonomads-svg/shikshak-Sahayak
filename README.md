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
- **समाचार (News)**: Real-time Bihar education sector news strictly filtered in Hindi.
- **पढ़ाएं (Teach/MCQ)**: AI-powered class 1-8 syllabus-based quiz and descriptive question generator.
- **किताबें (Books)**: Read digital copies of textbooks for all subjects.
- **सूचना (Notice)**: Important circulars from the Bihar Education Department.

---

## ☁️ Deployment Guide

### Setting Environment Variables (.env variables)

When deploying to production, local `.env` files are ignored. You must configure these variables explicitly in your hosting provider's dashboard.

#### 1. Backend on Render 🟢
1. Go to your Web Service dashboard on Render.
2. Navigate to **Environment** (or Environment Variables).
3. Add the following keys (copy values from your local `BE/.env`):
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `AZURE_OPENAI_API_VERSION`
   - `TAVILY_API_KEY`
4. Deploy the latest commit.

#### 2. Frontend on Vercel 🔺
1. Go to your Project settings on Vercel.
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<YOUR_RENDER_BACKEND_URL>.onrender.com` *(Make sure to remove any trailing slashes)*
4. Go to **Deployments** and click **Redeploy**.

> *Note: The frontend code relies on the `VITE_API_URL` to know where the backend is hosted. If not set, it will default to `/api` which only works on your local developer machine.*
