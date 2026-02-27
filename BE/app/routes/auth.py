"""
शिक्षक सहायक — Auth Routes (SQLite)
Signup & Login setup adapted from Medgardian
"""
import os
import hashlib
import sqlite3
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

# DB inside app directory
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "shikshak.db")


def _get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _init_db():
    conn = _get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


_init_db()


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# ── Models ──

class SignupRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: dict = None


# ── Routes ──

@router.post("/signup", response_model=AuthResponse)
def signup(req: SignupRequest):
    """Register a new user."""
    if not req.name or not req.email or not req.phone or not req.password:
        return AuthResponse(success=False, message="सभी फ़ील्ड आवश्यक हैं।")

    if len(req.password) < 6:
        return AuthResponse(success=False, message="पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।")

    conn = _get_db()
    try:
        conn.execute(
            "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
            (req.name.strip(), req.email.strip().lower(), req.phone.strip(), _hash_password(req.password))
        )
        conn.commit()

        user = conn.execute("SELECT id, name, email, phone FROM users WHERE email = ?",
                            (req.email.strip().lower(),)).fetchone()
        conn.close()

        return AuthResponse(
            success=True,
            message="खाता सफलतापूर्वक बन गया।",
            user=dict(user)
        )
    except sqlite3.IntegrityError:
        conn.close()
        return AuthResponse(success=False, message="यह ईमेल पहले से पंजीकृत है। कृपया लॉग इन करें।")
    except Exception as e:
        conn.close()
        return AuthResponse(success=False, message=f"त्रुटि: {str(e)}")


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    """Authenticate user."""
    if not req.email or not req.password:
        return AuthResponse(success=False, message="ईमेल और पासवर्ड आवश्यक हैं।")

    conn = _get_db()
    user = conn.execute(
        "SELECT id, name, email, phone, password_hash FROM users WHERE email = ?",
        (req.email.strip().lower(),)
    ).fetchone()
    conn.close()

    if not user:
        return AuthResponse(success=False, message="इस ईमेल से कोई खाता नहीं मिला।")

    if user["password_hash"] != _hash_password(req.password):
        return AuthResponse(success=False, message="गलत पासवर्ड।")

    return AuthResponse(
        success=True,
        message="लॉगिन सफल।",
        user={"id": user["id"], "name": user["name"], "email": user["email"], "phone": user["phone"]}
    )
