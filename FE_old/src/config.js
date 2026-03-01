// Use the injected Vercel environment variable, or dynamically infer local IP for mobile LAN testing
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.');
const localApiBase = `http://${window.location.hostname}:8001`;

export const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? localApiBase : window.location.origin);
