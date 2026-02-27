"""
शिक्षक सहायक — FastAPI Application Entry Point
Bihar Board Government Teachers App
Runs at: http://localhost:8001
Docs  at: http://localhost:8001/docs
"""
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / "keys.env"
if env_path.exists():
    print(f"Loading .env from: {env_path}")
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Try default .env if keys.env is missing
    load_dotenv()
    print("No keys.env found, using system environment variables.")

print("AZURE_OPENAI_ENDPOINT:", os.getenv("AZURE_OPENAI_ENDPOINT"))
print("AZURE_OPENAI_API_KEY present:", bool(os.getenv("AZURE_OPENAI_API_KEY")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, news, teach, books, notice, auth

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
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST Routers
app.include_router(auth.router)
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
