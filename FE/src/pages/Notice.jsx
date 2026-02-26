import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCampaign, MdWarning } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import './Pages.css';
import { API_BASE } from '../config';

export default function Notice() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotice, setSelectedNotice] = useState(null);

    const extractUrl = (content) => {
        const match = content?.match(/\((https?:\/\/[^\s]+)\)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        fetch(`${API_BASE}/notice/feed`)
            .then(res => res.json())
            .then(data => {
                setNotices(data.notices || []);
                setLoading(false);
            });
    }, []);

    const getPriorityColor = (priority) => {
        if (priority === 'high') return 'badge-high';
        if (priority === 'medium') return 'badge-medium';
        return 'badge-low';
    };

    // Full screen modal for a notice
    const NoticeModal = ({ notice, onClose }) => {
        if (!notice) return null;
        return (
            <div className="modal-backdrop backdrop-blur p-4 flex items-center justify-center fixed inset-0 z-[100] bg-black/40">
                <motion.div
                    className="modal-content glass-panel bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                    <div className="sticky top-0 bg-white border-b pb-3 mb-4 flex justify-between items-center z-10">
                        <div>
                            <span className={`badge ${getPriorityColor(notice.priority)}`}>
                                {notice.category_icon} {notice.category}
                            </span>
                            <span className="text-sm text-gray-500 ml-3">{notice.date}</span>
                        </div>
                        <button className="btn btn-outline p-2 h-auto" onClick={onClose}>✕</button>
                    </div>

                    <div className="markdown-reader prose prose-red max-w-none">
                        <ReactMarkdown>{notice.content}</ReactMarkdown>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="page-container relative">
            <div className="page-header alert-header mb-8 pb-4 border-b">
                <div>
                    <h1 className="text-red-700 flex items-center gap-2">
                        <MdCampaign /> महत्वपूर्ण सूचनाएं
                    </h1>
                    <p>शिक्षा विभाग आदेश, परिपत्र और नोटिस</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
            ) : (
                <div className="notices-list flex flex-col gap-4">
                    {notices.map((notice, idx) => (
                        <motion.a
                            href={extractUrl(notice.content)}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={notice.id}
                            className="notice-card glass-panel flex flex-col sm:flex-row gap-4 sm:items-center justify-between cursor-pointer hover:border-red-200 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="flex-1">
                                <div className="flex gap-2 items-center mb-2">
                                    <span className={`badge ${getPriorityColor(notice.priority)}`}>
                                        {notice.category_icon} {notice.category}
                                    </span>
                                    {notice.priority === 'high' && <MdWarning className="text-red-500 animate-pulse" />}
                                    <span className="text-xs text-gray-400 font-mono ml-auto sm:ml-2">{notice.date}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{notice.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{notice.summary}</p>
                                <div className="text-xs text-gray-400 mt-2 font-medium bg-gray-50 px-2 py-1 inline-block rounded border">
                                    प्रेषक: {notice.source}
                                </div>
                            </div>
                            <div>
                                <button className="btn text-blue-600 whitespace-nowrap bg-blue-50 border border-blue-100 hover:bg-blue-100">
                                    विस्तार से पढ़ें
                                </button>
                            </div>
                        </motion.a>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedNotice && (
                    <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
