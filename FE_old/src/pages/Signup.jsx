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
        <div className="auth-container">
            <motion.div
                className="auth-card glass-panel sign-up-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="auth-header">
                    <span className="auth-icon">✨</span>
                    <h2 className="title-saffron">नया खाता बनाएं</h2>
                    <p>शिक्षक सहायक से जुड़ें</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>पूरा नाम (Full Name)</label>
                        <div className="input-wrapper">
                            <MdPerson className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="अपना नाम दर्ज करें"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>ईमेल (Email)</label>
                        <div className="input-wrapper">
                            <MdEmail className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="अपना ईमेल दर्ज करें"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>मोबाइल नंबर (Phone)</label>
                        <div className="input-wrapper">
                            <MdPhone className="input-icon" />
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="अपना मोबाइल नंबर दर्ज करें"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>पासवर्ड (Password)</label>
                        <div className="input-wrapper">
                            <MdLock className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="कम से कम 6 अक्षर"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4 auth-btn" disabled={loading}>
                        {loading ? <span className="spinner-small" /> : <><MdPersonAdd /> रजिस्टर करें</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>पहले से खाता है? <Link to="/login" className="auth-link">लॉग इन करें</Link></p>
                </div>
            </motion.div>
        </div>
    );
}
