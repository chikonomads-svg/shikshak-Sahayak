"""
शिक्षक सहायक — Auth Routes (Supabase PostgreSQL)
Signup & Login setup adapted from Medgardian
"""
import os
import hashlib
import psycopg2
import psycopg2.extras
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Auth"])

def _get_db():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise Exception("DATABASE_URL is not set. Please add your Supabase connection string to the .env file.")
    # Return a connection with a cursor factory that allows dict-like access (like sqlite3.Row)
    conn = psycopg2.connect(db_url, cursor_factory=psycopg2.extras.DictCursor)
    return conn

def _init_db():
    try:
        conn = _get_db()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"PostgreSQL initialization deferred: {e}")

# Initialize DB on start if DB_URL is present
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

    try:
        conn = _get_db()
    except Exception as e:
        return AuthResponse(success=False, message=str(e))

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, phone, password_hash) VALUES (%s, %s, %s, %s) RETURNING id, name, email, phone",
            (req.name.strip(), req.email.strip().lower(), req.phone.strip(), _hash_password(req.password))
        )
        user = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        return AuthResponse(
            success=True,
            message="खाता सफलतापूर्वक बन गया।",
            user=dict(user) if user else None
        )
    except psycopg2.IntegrityError:
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

    try:
        conn = _get_db()
    except Exception as e:
        return AuthResponse(success=False, message=str(e))

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email, phone, password_hash FROM users WHERE email = %s",
            (req.email.strip().lower(),)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()
    except Exception as e:
        return AuthResponse(success=False, message=f"त्रुटि: {str(e)}")

    if not user:
        return AuthResponse(success=False, message="इस ईमेल से कोई खाता नहीं मिला।")

    if user["password_hash"] != _hash_password(req.password):
        return AuthResponse(success=False, message="गलत पासवर्ड।")

    return AuthResponse(
        success=True,
        message="लॉगिन सफल।",
        user={"id": user["id"], "name": user["name"], "email": user["email"], "phone": user["phone"]}
    )
