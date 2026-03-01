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
        if (priority === 'high') return 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-500/20';
        if (priority === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200 ring-1 ring-amber-500/20';
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 ring-1 ring-emerald-500/20';
    };

    // Full screen modal for a notice
    const NoticeModal = ({ notice, onClose }) => {
        if (!notice) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(notice.priority)} flex items-center gap-1.5`}>
                                {notice.category_icon} {notice.category}
                            </span>
                            <span className="text-sm font-medium text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200">{notice.date}</span>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors shrink-0" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 prose prose-brand max-w-none">
                        <ReactMarkdown>{notice.content}</ReactMarkdown>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-surface pb-12 relative">
            <div className="bg-red-600 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-md shadow-red-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                            <MdCampaign className="hidden sm:block text-4xl" /> महत्वपूर्ण सूचनाएं
                        </h1>
                        <p className="text-red-100 text-sm md:text-base max-w-xl font-medium">शिक्षा विभाग आदेश, परिपत्र और नोटिस</p>
                    </div>
                    <MdCampaign className="text-white/20 text-6xl md:text-8xl hidden sm:block" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">सूचनाएं लोड हो रही हैं...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {notices.map((notice, idx) => {
                            const url = extractUrl(notice.content);
                            return (
                                <motion.a
                                    key={notice.id}
                                    href={url || '#'}
                                    target={url ? "_blank" : "_self"}
                                    rel={url ? "noopener noreferrer" : ""}
                                    onClick={!url ? (e) => { e.preventDefault(); setSelectedNotice(notice); } : undefined}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 sm:items-center justify-between cursor-pointer group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: Math.min(idx * 0.1, 0.5) }}
                                >
                                    <div className="flex-1">
                                        <div className="flex flex-wrap gap-2 items-center mb-3">
                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${getPriorityColor(notice.priority)} flex items-center gap-1.5`}>
                                                {notice.category_icon} {notice.category}
                                            </span>
                                            {notice.priority === 'high' && <MdWarning className="text-red-500 animate-pulse text-lg" />}
                                            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 ml-auto sm:ml-2 font-mono">
                                                {notice.date}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors leading-snug pr-4">{notice.title}</h3>
                                        <p className="text-sm font-medium text-gray-600 line-clamp-2 mb-4 pr-4">{notice.summary}</p>
                                        <div className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 inline-flex items-center gap-2 rounded-lg border border-gray-200">
                                            <span className="opacity-70">प्रेषक:</span> <span className="text-gray-700">{notice.source}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 flex-none self-start sm:self-center w-full sm:w-auto">
                                        <button className="w-full sm:w-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold py-2.5 px-5 rounded-xl transition-colors active:scale-95 flex justify-center items-center">
                                            विस्तार से पढ़ें
                                        </button>
                                    </div>
                                </motion.a>
                            );
                        })}
                    </div>
                )}

                <AnimatePresence>
                    {selectedNotice && (
                        <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
