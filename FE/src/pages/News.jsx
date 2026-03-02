import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdRefresh, MdOpenInNew, MdNewspaper } from 'react-icons/md';
import './Pages.css';
import { API_BASE } from '../config';

const sectionGradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-violet-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
];

const sectionAccentColors = [
    { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', hoverBorder: 'hover:border-blue-300' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-300' },
    { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', hoverBorder: 'hover:border-amber-300' },
    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', hoverBorder: 'hover:border-purple-300' },
    { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', hoverBorder: 'hover:border-rose-300' },
    { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', hoverBorder: 'hover:border-cyan-300' },
];

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
                const sortedSections = data.sections.map(section => {
                    const sortedResults = section.results && Array.isArray(section.results)
                        ? [...section.results].sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0))
                        : [];
                    return { ...section, results: sortedResults };
                });
                setSections(sortedSections);
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
        <div className="min-h-screen bg-surface pb-12">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-lg shadow-brand-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-30%] left-[10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">📰 शिक्षक समाचार</h1>
                        <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">बिहार शिक्षा जगत और देश की महत्वपूर्ण खबरें</p>
                    </div>
                    <button
                        className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 self-start sm:self-auto"
                        onClick={fetchNews}
                        disabled={loading}
                    >
                        <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} /> रिफ्रेश करें
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm">
                        <p className="text-red-700 font-medium m-0 flex items-center gap-2">
                            <span className="text-xl">⚠️</span> {error}
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium text-lg">ताज़ा खबरें लोड हो रही हैं...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {sections.map((section, idx) => {
                            const accent = sectionAccentColors[idx % sectionAccentColors.length];
                            const gradient = sectionGradients[idx % sectionGradients.length];
                            return (
                                <div key={idx} className="mb-8">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${gradient}`}></div>
                                        <h2 className="text-2xl font-black text-gray-900">{section.label}</h2>
                                    </div>

                                    {/* News Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {section.results?.length > 0 ? (
                                            section.results.map((news, nIdx) => (
                                                <motion.a
                                                    key={nIdx}
                                                    href={news.url !== '#' ? news.url : null}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${accent.hoverBorder} hover:shadow-lg transition-all flex flex-col cursor-pointer group h-full overflow-hidden`}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: Math.min(nIdx * 0.08, 0.4) }}
                                                    whileHover={{ y: -4 }}
                                                >
                                                    {/* Colored top bar */}
                                                    <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>

                                                    <div className="p-5 flex flex-col flex-1">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className={`text-xs font-bold ${accent.text} ${accent.bg} px-2.5 py-1 rounded-lg border ${accent.border} uppercase tracking-wider`}>
                                                                {news.source || 'स्थानीय समाचार'}
                                                            </span>
                                                            {news.published_date && (
                                                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                                    {new Date(news.published_date).toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">{news.title}</h3>
                                                        <p className="text-sm font-medium text-gray-500 line-clamp-3 mb-5 flex-1">{news.snippet}</p>
                                                        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                                                            <span className={`text-sm font-bold ${accent.text} flex items-center gap-1.5 group-hover:underline`}>
                                                                पढ़ें <MdOpenInNew size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                                <p className="text-gray-500 font-medium">इस श्रेणी में कोई ताज़ा खबर नहीं मिली।</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
