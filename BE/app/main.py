"""
शिक्षक सहायक — FastAPI Application Entry Point
Bihar Board Government Teachers App
Runs at: http://localhost:8001
Docs  at: http://localhost:8001/docs
"""
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, news, teach, books, notice

app = FastAPI(
    title="📚 शिक्षक सहायक API",
    description=(
        "शिक्षक सहायक — बिहार बोर्ड सरकारी शिक्षक सहायक\n\n"
        "चैटबॉट · समाचार · पढ़ाएं · किताबें · सूचना\n\n"
        "**V1: In-memory simulation mode**"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST Routers
app.include_router(chat.router)
app.include_router(news.router)
app.include_router(teach.router)
app.include_router(books.router)
app.include_router(notice.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "शिक्षक सहायक API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "features": ["चैटबॉट", "समाचार", "पढ़ाएं", "किताबें", "सूचना"],
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
