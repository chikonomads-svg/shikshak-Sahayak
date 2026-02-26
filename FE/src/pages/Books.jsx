import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenuBook, MdExpandMore, MdExpandLess } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import './Pages.css';
import { API_BASE } from '../config';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('all');

    const [activeBook, setActiveBook] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState('');
    const [loadingChapter, setLoadingChapter] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/books/list`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books || []);
                setLoading(false);
            });
    }, []);

    const loadBookDetails = async (bookId) => {
        if (activeBook?.id === bookId) {
            setActiveBook(null); // toggle off
            return;
        }
        const res = await fetch(`${API_BASE}/books/${bookId}`);
        const data = await res.json();
        if (data.book) {
            setActiveBook(data.book);
            setActiveChapter(null);
        }
    };

    const loadChapterContent = async (bookId, chapterId) => {
        setLoadingChapter(true);
        setActiveChapter(chapterId);

        // Simulate slight delay for realistic feeling
        setTimeout(async () => {
            const res = await fetch(`${API_BASE}/books/${bookId}/chapter/${chapterId}`);
            const data = await res.json();
            if (data.chapter) {
                setChapterContent(data.chapter.content);
            }
            setLoadingChapter(false);
        }, 500);
    };

    const filteredBooks = selectedClass === 'all'
        ? books
        : books.filter(b => b.class_num === parseInt(selectedClass));

    const classes = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>डिजिटल किताबें</h1>
                    <p>बिहार बोर्ड कक्षा 1-8 की पाठ्यपुस्तकें और अध्याय</p>
                </div>
                <MdMenuBook size={48} className="text-saffron opacity-50" />
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
                                <div className="book-icon">{book.icon}</div>
                                <div className="book-info">
                                    <span className="book-subject">{book.subject_name} — कक्षा {book.class_num}</span>
                                    <h3 className="book-title">{book.title}</h3>
                                    <span className="book-chapter-count">{book.chapter_count} अध्याय</span>
                                </div>
                                <div className="ml-auto text-xl text-gray-400">
                                    {activeBook?.id === book.id ? <MdExpandLess /> : <MdExpandMore />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {activeBook?.id === book.id && (
                                    <motion.div
                                        className="book-details mt-4 border-t pt-4"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <h4 className="font-semibold mb-2 text-sm text-gray-500">विषय सूची (Index):</h4>
                                        <div className="chapter-buttons">
                                            {activeBook.chapters.map(ch => (
                                                <button
                                                    key={ch.id}
                                                    className={`btn-link chapter-btn ${activeChapter === ch.id ? 'text-saffron font-bold' : ''}`}
                                                    onClick={() => loadChapterContent(book.id, ch.id)}
                                                >
                                                    {ch.title}
                                                </button>
                                            ))}
                                        </div>

                                        {activeChapter && (
                                            <div className="chapter-reader mt-4 p-4 bg-white rounded-lg border border-gray-100 shadow-inner">
                                                {loadingChapter ? (
                                                    <div className="text-center py-4 text-gray-400">खोल रहा है...</div>
                                                ) : (
                                                    <div className="markdown-reader prose prose-orange max-w-none">
                                                        <ReactMarkdown>{chapterContent}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
