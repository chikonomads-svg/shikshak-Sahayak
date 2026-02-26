// Use the injected Vercel environment variable, or default to the local backend URL directly
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001';
