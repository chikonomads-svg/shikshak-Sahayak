import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenuBook, MdExpandMore, MdExpandLess, MdFileDownload, MdCloudDownload } from 'react-icons/md';
import './Pages.css';
import { API_BASE } from '../config';

const subjectStyles = {
    math: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-300' },
    science: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300' },
    hindi: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', hoverBorder: 'hover:border-amber-300' },
    english: { gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-300' },
    social: { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', hoverBorder: 'hover:border-rose-300' },
    sanskrit: { gradient: 'from-cyan-500 to-sky-600', bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', hoverBorder: 'hover:border-cyan-300' },
    default: { gradient: 'from-gray-500 to-slate-600', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', hoverBorder: 'hover:border-gray-300' },
};

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('all');
    const [activeBook, setActiveBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        setLoading(true);
        fetch(`${API_BASE}/books/list`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching books:", err);
                setLoading(false);
            });
    };

    const loadBookDetails = async (bookId) => {
        if (activeBook?.id === bookId) {
            setActiveBook(null);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/books/${bookId}`);
            const data = await res.json();
            if (data.book) {
                setActiveBook(data.book);
            }
        } catch (err) {
            console.error("Error loading book details:", err);
        }
    };

    const filteredBooks = selectedClass === 'all'
        ? books
        : books.filter(b => b.class_num === parseInt(selectedClass));

    const classes = [1, 2, 3, 4, 5, 6, 7, 8];

    const getSubjectIcon = (subject) => {
        const sub = subject.toLowerCase();
        if (sub.includes('math')) return '🔢';
        if (sub.includes('science')) return '🔬';
        if (sub.includes('hindi')) return '📖';
        if (sub.includes('english')) return 'A';
        if (sub.includes('social')) return '🌍';
        if (sub.includes('sanskrit')) return '🕉️';
        if (sub.includes('urdu')) return '☪️';
        return '📚';
    };

    const getSubjectStyle = (subject) => {
        const sub = subject.toLowerCase();
        if (sub.includes('math')) return subjectStyles.math;
        if (sub.includes('science')) return subjectStyles.science;
        if (sub.includes('hindi')) return subjectStyles.hindi;
        if (sub.includes('english')) return subjectStyles.english;
        if (sub.includes('social')) return subjectStyles.social;
        if (sub.includes('sanskrit')) return subjectStyles.sanskrit;
        return subjectStyles.default;
    };

    return (
        <div className="min-h-screen bg-surface pb-12">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-lg shadow-brand-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-30%] left-[10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">📚 डिजिटल किताबें</h1>
                        <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">बिहार बोर्ड कक्षा 1-8 की पाठ्यपुस्तकें और पीडीएफ</p>
                    </div>
                    <MdMenuBook className="text-white/15 text-6xl md:text-8xl hidden sm:block" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Class Filter Pills */}
                <div className="mb-8 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                    <button
                        className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedClass === 'all' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setSelectedClass('all')}
                    >
                        सभी कक्षाएं
                    </button>
                    {classes.map(c => (
                        <button
                            key={c}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedClass === c.toString() ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                            onClick={() => setSelectedClass(c.toString())}
                        >
                            कक्षा {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium text-lg">किताबें लोड हो रही हैं...</p>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium text-lg">किताबें नहीं मिलीं। कृपया बाद में पुनः प्रयास करें।</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {filteredBooks.map((book, idx) => {
                            const style = getSubjectStyle(book.subject);
                            return (
                                <motion.div
                                    key={book.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${style.hoverBorder} hover:shadow-lg transition-all cursor-pointer flex flex-col h-full group overflow-hidden ${activeBook?.id === book.id ? 'ring-2 ring-brand-500/30 border-brand-400' : ''}`}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                                    whileHover={{ y: -4 }}
                                    onClick={() => loadBookDetails(book.id)}
                                >
                                    {/* Gradient top bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${style.gradient}`}></div>

                                    <div className="p-4 md:p-5 flex flex-col flex-1">
                                        {/* Tags */}
                                        <div className="flex justify-between items-start mb-3 flex-wrap gap-1">
                                            <span className={`text-xs font-bold ${style.text} ${style.bg} px-2 py-0.5 rounded-lg border ${style.border} uppercase tracking-wider leading-tight`}>
                                                {book.subject}
                                            </span>
                                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                {book.class_name}
                                            </span>
                                        </div>

                                        {/* Icon + Title */}
                                        <div className="flex flex-col items-center justify-center flex-1 mb-4 mt-1">
                                            <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center text-2xl border ${style.border} mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                                                {getSubjectIcon(book.subject)}
                                            </div>
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 text-center leading-snug line-clamp-2">{book.title}</h3>
                                        </div>

                                        {/* Expand / Collapse */}
                                        <div className="mt-auto w-full flex flex-col justify-end">
                                            {!activeBook || activeBook.id !== book.id ? (
                                                <div className={`pt-3 border-t border-gray-50 flex items-center justify-center ${style.text} font-bold text-xs group-hover:underline`}>
                                                    विवरण <MdExpandMore size={18} className="ml-0.5" />
                                                </div>
                                            ) : (
                                                <div className="pt-3 border-t border-gray-50 flex items-center justify-center text-gray-500 font-bold text-xs hover:text-gray-700">
                                                    कम करें <MdExpandLess size={18} className="ml-0.5" />
                                                </div>
                                            )}

                                            <AnimatePresence>
                                                {activeBook?.id === book.id && (
                                                    <motion.div
                                                        className="mt-3 flex flex-col gap-2"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        {activeBook.book_url && (
                                                            <a
                                                                href={activeBook.book_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-3 rounded-xl transition-colors shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-[0.98] w-full text-xs"
                                                            >
                                                                <MdFileDownload className="text-base" /> डाउनलोड
                                                            </a>
                                                        )}
                                                        {activeBook.solution_url && (
                                                            <a
                                                                href={activeBook.solution_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-[0.98] w-full text-xs"
                                                            >
                                                                <MdCloudDownload className="text-base" /> उत्तर
                                                            </a>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
