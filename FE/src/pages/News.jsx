import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdRefresh, MdOpenInNew } from 'react-icons/md';
import './Pages.css';
import { API_BASE } from '../config';

export default function News() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNews = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/news/feed`);
            const data = await res.json();
            if (data.sections) {
                setSections(data.sections);
            } else {
                setError(data.error || 'समाचार लोड करने में विफल');
            }
        } catch (err) {
            setError('नेटवर्क त्रुटि');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>शिक्षक समाचार</h1>
                    <p>बिहार शिक्षा जगत और देश की महत्वपूर्ण खबरें</p>
                </div>
                <button className="btn btn-outline" onClick={fetchNews} disabled={loading}>
                    <MdRefresh className={loading ? 'spin' : ''} /> रिफ्रेश करें
                </button>
            </div>

            {error && (
                <div className="alert error">
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>ताज़ा खबरें लोड हो रही हैं...</p>
                </div>
            ) : (
                <div className="news-sections">
                    {sections.map((section, idx) => (
                        <div key={idx} className="news-section mb-8">
                            <h2 className="section-title title-saffron">{section.label}</h2>
                            <div className="news-grid">
                                {section.results?.length > 0 ? (
                                    section.results.map((news, nIdx) => (
                                        <motion.a
                                            key={nIdx}
                                            href={news.url !== '#' ? news.url : null}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="news-card glass-panel"
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: nIdx * 0.1 }}
                                            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                        >
                                            <div className="news-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <div className="news-source">{news.source || 'स्थानीय समाचार'}</div>
                                                {news.published_date && (
                                                    <div className="news-date" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                        {new Date(news.published_date).toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="news-title">{news.title}</h3>
                                            <p className="news-snippet">{news.snippet}</p>
                                            <div className="news-footer">
                                                <span>पढ़ें <MdOpenInNew size={14} /></span>
                                            </div>
                                        </motion.a>
                                    ))
                                ) : (
                                    <p className="no-news">इस श्रेणी में कोई ताज़ा खबर नहीं मिली।</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
