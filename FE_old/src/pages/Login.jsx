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
        <div className="auth-container">
            <motion.div
                className="auth-card glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="auth-header">
                    <span className="auth-icon">📚</span>
                    <h2 className="title-saffron">शिक्षक सहायक</h2>
                    <p>अपने खाते में प्रवेश करें</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>ईमेल (Email)</label>
                        <div className="input-wrapper">
                            <MdEmail className="input-icon" />
                            <input
                                type="email"
                                required
                                placeholder="अपना ईमेल दर्ज करें"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>पासवर्ड (Password)</label>
                        <div className="input-wrapper">
                            <MdLock className="input-icon" />
                            <input
                                type="password"
                                required
                                placeholder="पासवर्ड दर्ज करें"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4 auth-btn" disabled={loading}>
                        {loading ? <span className="spinner-small" /> : <><MdLogin /> लॉग इन करें</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>खाता नहीं है? <Link to="/signup" className="auth-link">नया खाता बनाएं</Link></p>
                </div>
            </motion.div>
        </div>
    );
}
