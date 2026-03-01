import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdPhone, MdLock, MdPersonAdd } from 'react-icons/md';
import { API_BASE } from '../config';

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password.length < 6) {
            setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                // Auto-login after successful registration
                localStorage.setItem('shikshak_user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data.message || 'पंजीकरण विफल रहा।');
            }
        } catch (err) {
            setError('सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden py-12">
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
                        ✨
                    </div>
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-500 tracking-tight">
                        नया खाता बनाएं
                    </h2>
                    <p className="text-brand-700 mt-2 font-medium">शिक्षक सहायक से जुड़ें</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3">
                        <span className="text-lg">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSignup}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 font-semibold text-sm ml-1">पूरा नाम (Full Name)</label>
                        <div className="relative flex items-center">
                            <MdPerson className="absolute left-4 text-gray-400 text-xl" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="अपना नाम दर्ज करें"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 font-semibold text-sm ml-1">ईमेल (Email)</label>
                        <div className="relative flex items-center">
                            <MdEmail className="absolute left-4 text-gray-400 text-xl" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="अपना ईमेल दर्ज करें"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 font-semibold text-sm ml-1">मोबाइल नंबर (Phone)</label>
                        <div className="relative flex items-center">
                            <MdPhone className="absolute left-4 text-gray-400 text-xl" />
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="अपना मोबाइल नंबर दर्ज करें"
                                value={formData.phone}
                                onChange={handleChange}
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
                                name="password"
                                required
                                placeholder="कम से कम 6 अक्षर"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100 text-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <><MdPersonAdd className="text-xl -ml-1" /> रजिस्टर करें</>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        पहले से खाता है? <Link to="/login" className="text-brand-600 font-bold hover:text-brand-700 hover:underline underline-offset-4">लॉग इन करें</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
