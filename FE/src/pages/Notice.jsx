import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCampaign, MdWarning, MdOpenInNew } from 'react-icons/md';
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

    const getPriorityStyles = (priority) => {
        if (priority === 'high') return {
            badge: 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-500/20',
            gradient: 'from-red-500 to-rose-600',
            hoverBorder: 'hover:border-red-300',
            accent: 'text-red-600',
        };
        if (priority === 'medium') return {
            badge: 'bg-amber-100 text-amber-800 border-amber-200 ring-1 ring-amber-500/20',
            gradient: 'from-amber-500 to-orange-600',
            hoverBorder: 'hover:border-amber-300',
            accent: 'text-amber-600',
        };
        return {
            badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 ring-1 ring-emerald-500/20',
            gradient: 'from-emerald-500 to-teal-600',
            hoverBorder: 'hover:border-emerald-300',
            accent: 'text-emerald-600',
        };
    };

    // Full screen modal for a notice
    const NoticeModal = ({ notice, onClose }) => {
        if (!notice) return null;
        const styles = getPriorityStyles(notice.priority);
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Gradient bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${styles.gradient}`}></div>

                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles.badge} flex items-center gap-1.5`}>
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
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-lg shadow-red-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-30%] left-[10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                            <MdCampaign className="hidden sm:block text-4xl" /> महत्वपूर्ण सूचनाएं
                        </h1>
                        <p className="text-red-100 text-sm md:text-base max-w-xl font-medium">शिक्षा विभाग आदेश, परिपत्र और नोटिस</p>
                    </div>
                    <MdCampaign className="text-white/15 text-6xl md:text-8xl hidden sm:block" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium text-lg">सूचनाएं लोड हो रही हैं...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {notices.map((notice, idx) => {
                            const url = extractUrl(notice.content);
                            const styles = getPriorityStyles(notice.priority);
                            return (
                                <motion.a
                                    key={notice.id}
                                    href={url || '#'}
                                    target={url ? "_blank" : "_self"}
                                    rel={url ? "noopener noreferrer" : ""}
                                    onClick={!url ? (e) => { e.preventDefault(); setSelectedNotice(notice); } : undefined}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${styles.hoverBorder} hover:shadow-lg transition-all flex flex-col cursor-pointer group h-full overflow-hidden`}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.08, 0.4) }}
                                    whileHover={{ y: -4 }}
                                >
                                    {/* Gradient top bar based on priority */}
                                    <div className={`h-1.5 bg-gradient-to-r ${styles.gradient}`}></div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${styles.badge} flex items-center gap-1.5`}>
                                                {notice.category_icon} {notice.category}
                                            </span>
                                            <div className="flex flex-col items-end gap-1">
                                                {notice.priority === 'high' && <MdWarning className="text-red-500 animate-pulse text-lg" title="High Priority" />}
                                                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 font-mono">
                                                    {notice.date}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className={`text-base font-bold text-gray-900 mb-3 group-hover:${styles.accent.replace('text-', 'text-')} transition-colors leading-snug line-clamp-2`}>{notice.title}</h3>
                                        <p className="text-sm font-medium text-gray-500 line-clamp-3 mb-5 flex-1">{notice.summary}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-xs font-bold text-gray-400 inline-flex items-center gap-1.5">
                                                <span className="opacity-70">प्रेषक:</span> <span className="text-gray-600 truncate max-w-[100px]">{notice.source}</span>
                                            </div>
                                            <span className={`text-sm font-bold ${styles.accent} flex items-center gap-1 group-hover:underline shrink-0`}>
                                                पढ़ें <MdCampaign size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
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
