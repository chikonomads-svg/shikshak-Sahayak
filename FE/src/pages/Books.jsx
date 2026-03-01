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
        <div className="page-container">
            <div className="page-header relative">
                <div>
                    <h1>डिजिटल किताबें</h1>
                    <p>बिहार बोर्ड कक्षा 1-8 की पाठ्यपुस्तकें और पीडीएफ</p>
                </div>
                <MdMenuBook size={48} className="text-saffron opacity-50 absolute right-4 top-4" />
            </div>

            <div className="class-filters mb-8 glass-panel p-4 flex gap-2 overflow-x-auto">
                <button
                    className={`btn ${selectedClass === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSelectedClass('all')}
                >
                    सभी कक्षाएं
                </button>
                {classes.map(c => (
                    <button
                        key={c}
                        className={`btn ${selectedClass === c.toString() ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedClass(c.toString())}
                    >
                        कक्षा {c}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
            ) : filteredBooks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p>किताबें नहीं मिलीं। कृपया बाद में पुनः प्रयास करें या 'सिंक करें' पर क्लिक करें।</p>
                </div>
            ) : (
                <div className="books-grid">
                    {filteredBooks.map((book, idx) => (
                        <motion.div
                            key={book.id}
                            className={`book-card glass-panel ${activeBook?.id === book.id ? 'active-book' : ''}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div
                                className="book-header cursor-pointer"
                                onClick={() => loadBookDetails(book.id)}
                            >
                                <div className="book-icon text-3xl mr-4">{getSubjectIcon(book.subject)}</div>
                                <div className="book-info flex-1">
                                    <span className="book-subject text-xs font-bold text-saffron uppercase tracking-wider">{book.subject} — {book.class_name}</span>
                                    <h3 className="book-title text-lg font-bold text-gray-800 leading-tight mt-1">{book.title}</h3>
                                </div>
                                <div className="ml-auto text-2xl text-gray-400 p-2">
                                    {activeBook?.id === book.id ? <MdExpandLess /> : <MdExpandMore />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {activeBook?.id === book.id && (
                                    <motion.div
                                        className="book-details mt-4 border-t border-gray-100 pt-4"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <div className="flex flex-col gap-3">
                                            {activeBook.book_url && (
                                                <a
                                                    href={activeBook.book_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary w-full justify-center flex items-center gap-2 py-3"
                                                >
                                                    <MdFileDownload size={20} /> किताब डाउनलोड करें (Download Book)
                                                </a>
                                            )}
                                            {activeBook.solution_url && (
                                                <a
                                                    href={activeBook.solution_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50 w-full justify-center flex items-center gap-2 py-3"
                                                >
                                                    <MdFileDownload size={20} /> प्रश्न उत्तर डाउनलोड करें (Download Solutions)
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

