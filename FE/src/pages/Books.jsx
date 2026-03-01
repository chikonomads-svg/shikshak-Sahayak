import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenuBook, MdExpandMore, MdExpandLess, MdFileDownload, MdCloudDownload } from 'react-icons/md';
import './Pages.css';
import { API_BASE } from '../config';

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
            setActiveBook(null); // toggle off
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

    // Helper function to map subject to icon
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

    return (
        <div className="min-h-screen bg-surface pb-12">
            <div className="bg-brand-600 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-md shadow-brand-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">डिजिटल किताबें</h1>
                        <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">बिहार बोर्ड कक्षा 1-8 की पाठ्यपुस्तकें और पीडीएफ</p>
                    </div>
                    <MdMenuBook className="text-white/20 text-6xl md:text-8xl hidden sm:block" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex gap-3 overflow-x-auto scrollbar-hide">
                    <button
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedClass === 'all' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setSelectedClass('all')}
                    >
                        सभी कक्षाएं
                    </button>
                    {classes.map(c => (
                        <button
                            key={c}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedClass === c.toString() ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                            onClick={() => setSelectedClass(c.toString())}
                        >
                            कक्षा {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">किताबें लोड हो रही हैं...</p>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium text-lg">किताबें नहीं मिलीं। कृपया बाद में पुनः प्रयास करें।</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map((book, idx) => (
                            <motion.div
                                key={book.id}
                                className={`bg-white rounded-2xl p-6 shadow-sm border transition-shadow cursor-pointer ${activeBook?.id === book.id ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-100 hover:shadow-md'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                                onClick={() => loadBookDetails(book.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl border border-brand-100 shrink-0">
                                            {getSubjectIcon(book.subject)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">{book.subject} — {book.class_name}</span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-2 leading-tight">{book.title}</h3>
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        {activeBook?.id === book.id ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {activeBook?.id === book.id && (
                                        <motion.div
                                            className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3"
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
                                                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-[0.98] w-full"
                                                >
                                                    <MdFileDownload className="text-xl" /> किताब डाउनलोड करें
                                                </a>
                                            )}
                                            {activeBook.solution_url && (
                                                <a
                                                    href={activeBook.solution_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-[0.98] w-full"
                                                >
                                                    <MdCloudDownload className="text-xl" /> प्रश्न उत्तर डाउनलोड करें
                                                </a>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

