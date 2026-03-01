import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdRefresh, MdCheckCircle, MdCancel, MdSchool, MdPrint, MdLibraryBooks, MdClose } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import MermaidViewer from '../components/MermaidViewer';
import { pblProjects } from '../data/pbl_projects';
import './Pages.css';
import { API_BASE } from '../config';

export default function Teach() {
    const [subjectsData, setSubjectsData] = useState(null);
    const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'pbl'
    const [selectedPbl, setSelectedPbl] = useState(null);
    const [filteredPbls, setFilteredPbls] = useState([]);

    // Form state
    const [selectedClass, setSelectedClass] = useState('6');
    const [selectedSubject, setSelectedSubject] = useState('math');
    const [topic, setTopic] = useState('');
    const [mode, setMode] = useState('mcq');
    const [questionCount, setQuestionCount] = useState(5);

    // Quiz state
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Question Bank state
    const [qBank, setQBank] = useState(null);
    const [qBankLoading, setQBankLoading] = useState(false);
    const [qBankError, setQBankError] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/teach/subjects`)
            .then(res => res.json())
            .then(data => setSubjectsData(data.subjects))
            .catch(err => console.error(err));
    }, []);

    // ── प्रश्न बनाएं ─────────────────────────────────────────────────
    const generateQuestions = async (e) => {
        e.preventDefault();
        setLoading(true);
        setQuestions([]);
        setAnswers({});
        setSubmitted(false);
        setQBank(null);

        try {
            const res = await fetch(`${API_BASE}/teach/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: selectedSubject,
                    class_num: parseInt(selectedClass),
                    topic,
                    count: questionCount,
                    difficulty: 'medium',
                    mode,
                }),
            });
            const data = await res.json();
            if (data.questions) setQuestions(data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── प्रश्न बैंक बनाएं ────────────────────────────────────────────
    const generateQBank = async () => {
        setQBankLoading(true);
        setQBank(null);
        setQBankError('');
        setQuestions([]);

        try {
            const res = await fetch(`${API_BASE}/teach/question-bank`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: selectedSubject,
                    class_num: parseInt(selectedClass),
                    topic,
                }),
            });
            const data = await res.json();
            if (data.error) {
                setQBankError(data.error);
            } else {
                setQBank(data);
            }
        } catch (err) {
            setQBankError('नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
        } finally {
            setQBankLoading(false);
        }
    };

    const handleOptionSelect = (qIdx, optIdx) => {
        if (submitted) return;
        setAnswers({ ...answers, [qIdx]: optIdx });
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) score++;
        });
        return score;
    };

    if (!subjectsData) return (
        <div className="loading-state glass-panel">
            <div className="spinner" />
            <p>विषय लोड हो रहे हैं...</p>
        </div>
    );

    const classesList = [1, 2, 3, 4, 5, 6, 7, 8];
    const availableTopics = subjectsData[selectedSubject]?.classes[selectedClass] || [];

    return (
        <div className="min-h-screen bg-surface pb-12">
            <div className="bg-brand-600 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-md shadow-brand-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">📚 पढ़ाएं</h1>
                        <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">AI द्वारा प्रश्न बनाएं या PBL प्रोजेक्ट्स खोजें</p>
                    </div>
                    <MdSchool className="text-white/20 text-6xl md:text-8xl hidden sm:block" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* ── Tabs ── */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 w-full max-w-md mx-auto">
                    <button
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        onClick={() => setActiveTab('quiz')}
                    >
                        प्रश्नोत्तरी / प्रश्न बैंक
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'pbl' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        onClick={() => setActiveTab('pbl')}
                    >
                        प्रोजेक्ट-आधारित शिक्षा
                    </button>
                </div>

                {/* ── PBL Tab Content ── */}
                {activeTab === 'pbl' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Filters for PBL */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">कक्षा</label>
                                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 font-medium outline-none">
                                    {[6, 7, 8].map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">विषय</label>
                                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 font-medium outline-none">
                                    <option value="science">विज्ञान</option>
                                    <option value="math">गणित</option>
                                </select>
                            </div>
                            <div className="flex-none ml-auto">
                                <button type="button" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-brand-500/20 flex items-center gap-2 active:scale-95" onClick={() => {
                                    const results = pblProjects.filter(p =>
                                        p.class_num === `कक्षा ${selectedClass}` &&
                                        (selectedSubject === 'science' ? p.subject === 'विज्ञान' : p.subject === 'गणित')
                                    );
                                    setFilteredPbls(results);
                                }}>
                                    <MdRefresh className="text-xl" /> खोजें
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPbls.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 font-medium">खोजना प्रारंभ करने के लिए ऊपरी 'खोजें' बटन पर क्लिक करें।</p>
                                </div>
                            ) : (
                                filteredPbls.map((p) => (
                                    <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedPbl(p)}>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">{p.title}</h3>
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{p.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">कक्षा {p.class_num.replace('कक्षा ', '')}</span>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">{p.subject}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* PBL Modal */}
                        <AnimatePresence>
                            {selectedPbl && (
                                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPbl(null)}>
                                    <motion.div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                                            <h2 className="text-2xl font-bold text-gray-900 flex-1 pr-4">{selectedPbl.title}</h2>
                                            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors shrink-0" onClick={() => setSelectedPbl(null)}>
                                                <MdClose size={24} />
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-y-auto flex-1">
                                            <div className="prose prose-brand max-w-none">
                                                <ReactMarkdown>{selectedPbl.markdown}</ReactMarkdown>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">प्रक्रिया प्रवाहचित्र (Flowchart)</h3>
                                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 overflow-x-auto">
                                                    <MermaidViewer chart={selectedPbl.mermaid} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── Quiz Generator Tab Content ── */}
                {activeTab === 'quiz' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {/* ── Controls Panel ── */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                            <form onSubmit={generateQuestions} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* प्रश्न का प्रकार */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">प्रश्न का प्रकार</label>
                                    <div className="flex flex-wrap gap-3">
                                        <button type="button"
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'actual' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                            onClick={() => setMode('actual')}>
                                            📚 बिहार बोर्ड
                                        </button>
                                        <button type="button"
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'descriptive' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                            onClick={() => setMode('descriptive')}>
                                            ✍️ वर्णनात्मक
                                        </button>
                                        <button type="button"
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'mcq' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                            onClick={() => setMode('mcq')}>
                                            📝 MCQ
                                        </button>
                                    </div>
                                </div>

                                {/* कक्षा */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">कक्षा</label>
                                    <select value={selectedClass} onChange={e => {
                                        setSelectedClass(e.target.value);
                                        setTopic('');
                                    }} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3.5 font-medium outline-none">
                                        {classesList.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                                    </select>
                                </div>

                                {/* विषय */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">विषय</label>
                                    <select value={selectedSubject} onChange={e => {
                                        setSelectedSubject(e.target.value);
                                        setTopic('');
                                    }} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3.5 font-medium outline-none">
                                        {Object.entries(subjectsData).map(([key, subj]) =>
                                            subj.classes[selectedClass] ? (
                                                <option key={key} value={key}>{subj.icon} {subj.name}</option>
                                            ) : null
                                        )}
                                    </select>
                                </div>

                                {/* टॉपिक */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">टॉपिक / अध्याय</label>
                                    <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3.5 font-medium outline-none">
                                        <option value="">सभी अध्याय</option>
                                        {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                {/* प्रश्नों की संख्या */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">प्रश्नों की संख्या</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={questionCount}
                                        onChange={e => setQuestionCount(Math.max(1, Math.min(30, parseInt(e.target.value) || 5)))}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3.5 font-medium outline-none"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
                                    <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading || qBankLoading}>
                                        {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdRefresh className="text-xl" />}
                                        प्रश्न बनाएं
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        onClick={generateQBank}
                                        disabled={loading || qBankLoading}
                                    >
                                        {qBankLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdLibraryBooks className="text-xl" />}
                                        प्रश्न बैंक बनाएं
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ── Loading States ── */}
                        {(loading || qBankLoading) && (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                                <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">
                                    {loading
                                        ? `AI ${questionCount} प्रश्न तैयार कर रहा है…`
                                        : 'AI पूरा प्रश्न बैंक तैयार कर रहा है… (इसमें थोड़ा समय लग सकता है)'}
                                </p>
                            </div>
                        )}

                        {/* ── Question Bank Error ── */}
                        {qBankError && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                                <p className="text-red-700 font-medium m-0 flex items-center gap-2">
                                    <span className="text-xl">⚠️</span> {qBankError}
                                </p>
                            </div>
                        )}

                        {/* ── Generated Questions ── */}
                        {questions.length > 0 && !loading && (
                            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800">{mode === 'mcq' ? '📝 प्रश्नोत्तरी तैयार है!' : '✅ महत्वपूर्ण प्रश्न तैयार हैं!'}</h3>
                                    <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-bold rounded-full border border-brand-100">{questions.length} प्रश्न</span>
                                </div>

                                <div className="space-y-6">
                                    {questions.map((q, qIdx) => (
                                        <div
                                            key={qIdx}
                                            className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors ${mode === 'mcq' && submitted
                                                ? answers[qIdx] === q.correct
                                                    ? 'bg-emerald-50/50 border-emerald-100'
                                                    : 'bg-red-50/50 border-red-100'
                                                : ''
                                                }`}
                                        >
                                            <div className="flex items-center mb-3">
                                                <span className="font-bold text-gray-500 uppercase tracking-wider text-xs">प्रश्न {qIdx + 1}</span>
                                                {q.year && (
                                                    <span className="ml-3 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">
                                                        वर्ष: {q.year}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-5 leading-snug">{q.question}</h4>

                                            {mode === 'mcq' ? (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {q.options?.map((opt, optIdx) => {
                                                            const isSelected = answers[qIdx] === optIdx;
                                                            const isCorrect = submitted && optIdx === q.correct;
                                                            const isWrong = submitted && isSelected && !isCorrect;
                                                            let cls = 'p-4 rounded-xl text-left transition-all border font-medium text-gray-700 ';

                                                            if (isCorrect) {
                                                                cls += 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20';
                                                            } else if (isWrong) {
                                                                cls += 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-500/20';
                                                            } else if (isSelected && !submitted) {
                                                                cls += 'bg-brand-50 border-brand-500 text-brand-800 ring-2 ring-brand-500/20';
                                                            } else {
                                                                cls += 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300';
                                                            }

                                                            return (
                                                                <button key={optIdx} className={`${cls} flex justify-between items-center outline-none`}
                                                                    onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                                    disabled={submitted}>
                                                                    <span>{opt}</span>
                                                                    {isCorrect && <MdCheckCircle className="text-emerald-600 text-xl ml-2 shrink-0" />}
                                                                    {isWrong && <MdCancel className="text-red-600 text-xl ml-2 shrink-0" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <AnimatePresence>
                                                        {submitted && (
                                                            <motion.div
                                                                className="mt-5 p-4 bg-blue-50/80 rounded-xl text-sm border border-blue-100 text-blue-900"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                            >
                                                                <strong className="text-blue-800 block mb-1">व्याख्या:</strong> {q.explanation}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <div className="mt-4 p-5 bg-emerald-50 rounded-xl text-sm border border-emerald-100 leading-relaxed text-emerald-900">
                                                    <strong className="text-emerald-800 block mb-1">उत्तर:</strong> {q.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {mode === 'mcq' && !submitted ? (
                                    <button
                                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setSubmitted(true)}
                                        disabled={Object.keys(answers).length < questions.length}
                                    >
                                        उत्तर जांचें
                                    </button>
                                ) : mode === 'mcq' ? (
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8 text-center text-gray-800">
                                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-amber-500 mb-3">
                                            स्कोर: {calculateScore()} / {questions.length}
                                        </h2>
                                        <p className="text-gray-500 font-medium text-lg">बहुत बढ़िया! इन प्रश्नों को छात्रों के साथ साझा करें।</p>
                                    </div>
                                ) : null}
                            </motion.div>
                        )}

                        {/* ── Question Bank ── */}
                        {qBank && !qBankLoading && (
                            <motion.div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {/* Header */}
                                <div className="border-b-2 border-brand-500 pb-5 mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">📋 प्रश्न बैंक — {qBank.subject}</h3>
                                    <p className="text-gray-500 font-bold mt-1">कक्षा {qBank.class_num} | {qBank.topic}</p>
                                </div>

                                {/* वस्तुनिष्ठ प्रश्न (MCQ) */}
                                {qBank.mcq?.length > 0 && (
                                    <div className="mb-10 page-break-avoid">
                                        <div className="bg-gray-100 p-3 rounded-lg font-bold text-gray-800 mb-5 border-l-4 border-gray-400">
                                            खण्ड — क: वस्तुनिष्ठ प्रश्न (MCQ) [{qBank.mcq.length} प्रश्न × 1 अंक]
                                        </div>
                                        <div className="space-y-6 pl-2">
                                            {qBank.mcq.map((q, i) => (
                                                <div key={i} className="text-gray-800">
                                                    <div className="font-semibold mb-2">
                                                        प्रश्न {i + 1}. {q.question}
                                                    </div>
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 pl-5 list-[lower-alpha]">
                                                        {q.options?.map((opt, oi) => (
                                                            <li key={oi} className="text-gray-700">{opt}</li>
                                                        ))}
                                                    </ul>
                                                    <div className="text-sm bg-green-50 text-green-800 p-3 rounded-lg border border-green-100 ml-4">
                                                        <span className="font-bold">✅ उत्तर:</span> {q.options?.[q.answer] ?? `विकल्प ${q.answer + 1}`}
                                                        {q.explanation && <span className="block mt-1 text-green-700 opacity-90"><span className="font-semibold">व्याख्या:</span> {q.explanation}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* लघु उत्तरीय */}
                                {qBank.short?.length > 0 && (
                                    <div className="mb-10 page-break-avoid">
                                        <div className="bg-gray-100 p-3 rounded-lg font-bold text-gray-800 mb-5 border-l-4 border-gray-400">
                                            खण्ड — ख: लघु उत्तरीय प्रश्न [{qBank.short.length} प्रश्न × 2 अंक]
                                        </div>
                                        <div className="space-y-6 pl-2">
                                            {qBank.short.map((q, i) => (
                                                <div key={i} className="text-gray-800">
                                                    <div className="font-semibold mb-2">
                                                        प्रश्न {i + 1}. {q.question}
                                                    </div>
                                                    <div className="text-sm bg-blue-50 text-blue-900 p-4 rounded-lg border border-blue-100 ml-4 leading-relaxed">
                                                        <strong className="block mb-1 text-blue-800">उत्तर:</strong> {q.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* दीर्घ उत्तरीय */}
                                {qBank.long?.length > 0 && (
                                    <div className="mb-10 page-break-avoid">
                                        <div className="bg-gray-100 p-3 rounded-lg font-bold text-gray-800 mb-5 border-l-4 border-gray-400">
                                            खण्ड — ग: दीर्घ उत्तरीय प्रश्न [{qBank.long.length} प्रश्न × 5 अंक]
                                        </div>
                                        <div className="space-y-6 pl-2">
                                            {qBank.long.map((q, i) => (
                                                <div key={i} className="text-gray-800">
                                                    <div className="font-semibold mb-2">
                                                        प्रश्न {i + 1}. {q.question}
                                                    </div>
                                                    <div className="text-sm bg-emerald-50 text-emerald-900 p-4 rounded-lg border border-emerald-100 ml-4 leading-relaxed">
                                                        <strong className="block mb-1 text-emerald-800">उत्तर:</strong> {q.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Print Button */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end print:hidden">
                                    <button className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95" onClick={() => window.print()}>
                                        <MdPrint className="text-xl" /> प्रिंट / PDF में सेव करें
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
