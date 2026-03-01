import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';
import { API_BASE } from '../config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('shikshak_user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data.message || 'लॉगिन विफल रहा।');
            }
        } catch (err) {
            setError('सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob animation-delay-4000"></div>

            <motion.div
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 relative z-10"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col items-center mb-8 text-center bg-brand-50 p-6 -mt-8 -mx-8 rounded-t-3xl border-b border-brand-100 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl mb-4 border border-brand-50">
                        📚
                    </div>
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-500 tracking-tight">
                        शिक्षक सहायक
                    </h2>
                    <p className="text-brand-700 mt-2 font-medium">अपने खाते में प्रवेश करें</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 font-semibold text-sm ml-1">ईमेल (Email)</label>
                        <div className="relative flex items-center">
                            <MdEmail className="absolute left-4 text-gray-400 text-xl" />
                            <input
                                type="email"
                                required
                                placeholder="अपना ईमेल दर्ज करें"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 font-semibold text-sm ml-1">पासवर्ड (Password)</label>
                        <div className="relative flex items-center">
                            <MdLock className="absolute left-4 text-gray-400 text-xl" />
                            <input
                                type="password"
                                required
                                placeholder="पासवर्ड दर्ज करें"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100 text-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <><MdLogin className="text-xl group-hover:translate-x-1 transition-transform" /> लॉग इन करें</>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        खाता नहीं है? <Link to="/signup" className="text-brand-600 font-bold hover:text-brand-700 hover:underline underline-offset-4">नया खाता बनाएं</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
