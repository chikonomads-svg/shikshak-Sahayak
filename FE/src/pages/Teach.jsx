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

    // Form state
    const [selectedClass, setSelectedClass] = useState('5');
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
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>📚 पढ़ाएं</h1>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>AI द्वारा प्रश्न बनाएं या PBL प्रोजेक्ट्स खोजें</p>
                </div>
                <MdSchool size={44} className="text-saffron opacity-50 header-icon" />
            </div>

            {/* ── Tabs ── */}
            <div className="tab-controls">
                <button
                    className={`tab-btn ${activeTab === 'quiz' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    प्रश्नोत्तरी / प्रश्न बैंक
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pbl' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('pbl')}
                >
                    प्रोजेक्ट-आधारित शिक्षा (PBL)
                </button>
            </div>

            {/* ── PBL Tab Content ── */}
            {activeTab === 'pbl' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Filters for PBL */}
                    <div className="generator-controls glass-panel mb-8" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                            <label>कक्षा</label>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                {[6, 7, 8].map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                            <label>विषय</label>
                            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                <option value="science">विज्ञान</option>
                                <option value="math">गणित</option>
                            </select>
                        </div>
                    </div>

                    <div className="pbl-grid">
                        {pblProjects
                            .filter(p => String(p.class_num) === String(selectedClass) &&
                                (selectedSubject === 'science' ? p.subject === 'विज्ञान' : p.subject === 'गणित'))
                            .map((p) => (
                                <div key={p.id} className="pbl-card" onClick={() => setSelectedPbl(p)}>
                                    <h3>{p.title}</h3>
                                    <p>{p.description}</p>
                                    <div className="pbl-tag-row">
                                        <span className="badge badge-low">कक्षा {p.class_num}</span>
                                        <span className="badge badge-medium">{p.subject}</span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* PBL Modal */}
                    <AnimatePresence>
                        {selectedPbl && (
                            <motion.div className="pbl-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPbl(null)}>
                                <motion.div className="pbl-modal-content" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 20 }} onClick={e => e.stopPropagation()}>
                                    <div className="pbl-modal-header">
                                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--p-text)' }}>{selectedPbl.title}</h2>
                                        <button className="btn-icon" onClick={() => setSelectedPbl(null)}>
                                            <MdClose size={24} />
                                        </button>
                                    </div>
                                    <div className="pbl-modal-body">
                                        <ReactMarkdown>{selectedPbl.markdown}</ReactMarkdown>
                                        <h3 style={{ marginTop: '2rem' }}>प्रक्रिया प्रवाहचित्र (Flowchart)</h3>
                                        <MermaidViewer chart={selectedPbl.mermaid} />
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
                    <div className="generator-controls glass-panel mb-8">
                        <form onSubmit={generateQuestions}>
                            {/* प्रश्न का प्रकार */}
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>प्रश्न का प्रकार</label>
                                <div className="form-type-buttons">
                                    <button type="button"
                                        className={`btn ${mode === 'actual' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setMode('actual')}>
                                        📚 बिहार बोर्ड
                                    </button>
                                    <button type="button"
                                        className={`btn ${mode === 'descriptive' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setMode('descriptive')}>
                                        ✍️ वर्णनात्मक
                                    </button>
                                    <button type="button"
                                        className={`btn ${mode === 'mcq' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setMode('mcq')}>
                                        📝 MCQ
                                    </button>
                                </div>
                            </div>

                            {/* कक्षा */}
                            <div className="form-group">
                                <label>कक्षा</label>
                                <select value={selectedClass} onChange={e => {
                                    setSelectedClass(e.target.value);
                                    setTopic('');
                                }}>
                                    {classesList.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                                </select>
                            </div>

                            {/* विषय */}
                            <div className="form-group">
                                <label>विषय</label>
                                <select value={selectedSubject} onChange={e => {
                                    setSelectedSubject(e.target.value);
                                    setTopic('');
                                }}>
                                    {Object.entries(subjectsData).map(([key, subj]) =>
                                        subj.classes[selectedClass] ? (
                                            <option key={key} value={key}>{subj.icon} {subj.name}</option>
                                        ) : null
                                    )}
                                </select>
                            </div>

                            {/* टॉपिक */}
                            <div className="form-group">
                                <label>टॉपिक / अध्याय</label>
                                <select value={topic} onChange={e => setTopic(e.target.value)}>
                                    <option value="">सभी अध्याय</option>
                                    {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* प्रश्नों की संख्या */}
                            <div className="form-group">
                                <label>प्रश्नों की संख्या</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={questionCount}
                                    onChange={e => setQuestionCount(Math.max(1, Math.min(30, parseInt(e.target.value) || 5)))}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="btn-generate-row" style={{ gridColumn: '1 / -1' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading || qBankLoading}>
                                    {loading ? <span className="spinner-small" /> : <MdRefresh />}
                                    प्रश्न बनाएं
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={generateQBank}
                                    disabled={loading || qBankLoading}
                                >
                                    {qBankLoading ? <span className="spinner-small" /> : <MdLibraryBooks />}
                                    प्रश्न बैंक बनाएं
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Loading States ── */}
                    {(loading || qBankLoading) && (
                        <div className="loading-state glass-panel">
                            <div className="spinner" />
                            <p>
                                {loading
                                    ? `AI ${questionCount} प्रश्न तैयार कर रहा है…`
                                    : 'AI पूरा प्रश्न बैंक तैयार कर रहा है… (इसमें थोड़ा समय लग सकता है)'}
                            </p>
                        </div>
                    )}

                    {/* ── Question Bank Error ── */}
                    {qBankError && (
                        <div className="glass-panel" style={{ borderLeft: '4px solid #EF4444', padding: '1rem', marginBottom: '1rem' }}>
                            <p style={{ color: '#EF4444', margin: 0, fontSize: '0.9rem' }}>⚠️ {qBankError}</p>
                        </div>
                    )}

                    {/* ── Generated Questions ── */}
                    {questions.length > 0 && !loading && (
                        <motion.div className="quiz-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="quiz-header">
                                <h3>{mode === 'mcq' ? '📝 प्रश्नोत्तरी तैयार है!' : '✅ महत्वपूर्ण प्रश्न तैयार हैं!'}</h3>
                                <span className="badge badge-medium">{questions.length} प्रश्न</span>
                            </div>

                            <div className="questions-list">
                                {questions.map((q, qIdx) => (
                                    <div
                                        key={qIdx}
                                        className={`question-card glass-panel ${mode === 'mcq' && submitted
                                            ? answers[qIdx] === q.correct
                                                ? 'correct-bg'
                                                : 'wrong-bg'
                                            : ''
                                            }`}
                                    >
                                        <div className="q-badge" style={{ display: 'flex', alignItems: 'center' }}>
                                            प्रश्न {qIdx + 1}
                                            {q.year && (
                                                <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0\.5 rounded text-xs">
                                                    वर्ष: {q.year}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="q-text">{q.question}</h4>

                                        {mode === 'mcq' ? (
                                            <>
                                                <div className="options-grid">
                                                    {q.options?.map((opt, optIdx) => {
                                                        const isSelected = answers[qIdx] === optIdx;
                                                        const isCorrect = submitted && optIdx === q.correct;
                                                        const isWrong = submitted && isSelected && !isCorrect;
                                                        let cls = 'btn btn-outline opt-btn text-left';
                                                        if (isSelected && !submitted) cls = 'btn btn-primary opt-btn text-left';
                                                        if (isCorrect) cls = 'btn opt-btn text-left bg-green-100 border-green-500 text-green-800';
                                                        if (isWrong) cls = 'btn opt-btn text-left bg-red-100 border-red-500 text-red-800';
                                                        return (
                                                            <button key={optIdx} className={cls}
                                                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                                disabled={submitted}>
                                                                {opt}
                                                                {isCorrect && <MdCheckCircle className="ml-auto text-green-800" style={{ flexShrink: 0, marginLeft: 'auto' }} />}
                                                                {isWrong && <MdCancel className="ml-auto text-red-800" style={{ flexShrink: 0, marginLeft: 'auto' }} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <AnimatePresence>
                                                    {submitted && (
                                                        <motion.div
                                                            className="q-explanation mt-4 p-3 bg-blue-50 rounded-md text-sm border-l-4 border-blue-400"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                        >
                                                            <strong>व्याख्या:</strong> {q.explanation}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <div className="q-explanation mt-4 p-4 bg-green-50 rounded-md text-sm border-l-4 border-green-500 leading-relaxed">
                                                <strong className="text-green-800">उत्तर:</strong> {q.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {mode === 'mcq' && !submitted ? (
                                <button
                                    className="btn btn-primary w-full mt-6 py-3 text-lg"
                                    onClick={() => setSubmitted(true)}
                                    disabled={Object.keys(answers).length < questions.length}
                                >
                                    उत्तर जांचें
                                </button>
                            ) : mode === 'mcq' ? (
                                <div className="quiz-result glass-panel mt-6 text-center">
                                    <h2 className="title-saffron mb-2">
                                        स्कोर: {calculateScore()} / {questions.length}
                                    </h2>
                                    <p>बहुत बढ़िया! इन प्रश्नों को छात्रों के साथ साझा करें।</p>
                                </div>
                            ) : null}
                        </motion.div>
                    )}

                    {/* ── Question Bank ── */}
                    {qBank && !qBankLoading && (
                        <motion.div className="qbank-container glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Header */}
                            <div className="qbank-header">
                                <h3>📋 प्रश्न बैंक — {qBank.subject}</h3>
                                <p>कक्षा {qBank.class_num} | {qBank.topic}</p>
                            </div>

                            {/* वस्तुनिष्ठ प्रश्न (MCQ) */}
                            {qBank.mcq?.length > 0 && (
                                <div className="qbank-section">
                                    <div className="qbank-section-title">
                                        खण्ड — क: वस्तुनिष्ठ प्रश्न (MCQ) [{qBank.mcq.length} प्रश्न × 1 अंक]
                                    </div>
                                    {qBank.mcq.map((q, i) => (
                                        <div key={i} className="qbank-question">
                                            <div className="qbank-question-text">
                                                प्रश्न {i + 1}. {q.question}
                                            </div>
                                            <ul className="qbank-options">
                                                {q.options?.map((opt, oi) => (
                                                    <li key={oi}>{opt}</li>
                                                ))}
                                            </ul>
                                            <div className="qbank-answer">
                                                ✅ उत्तर: {q.options?.[q.answer] ?? `विकल्प ${q.answer + 1}`}
                                                {q.explanation && ` — ${q.explanation}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* लघु उत्तरीय */}
                            {qBank.short?.length > 0 && (
                                <div className="qbank-section">
                                    <div className="qbank-section-title">
                                        खण्ड — ख: लघु उत्तरीय प्रश्न [{qBank.short.length} प्रश्न × 2 अंक]
                                    </div>
                                    {qBank.short.map((q, i) => (
                                        <div key={i} className="qbank-question">
                                            <div className="qbank-question-text">
                                                प्रश्न {i + 1}. {q.question}
                                            </div>
                                            <div className="qbank-sa-answer">
                                                <strong>उत्तर:</strong> {q.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* दीर्घ उत्तरीय */}
                            {qBank.long?.length > 0 && (
                                <div className="qbank-section">
                                    <div className="qbank-section-title">
                                        खण्ड — ग: दीर्घ उत्तरीय प्रश्न [{qBank.long.length} प्रश्न × 5 अंक]
                                    </div>
                                    {qBank.long.map((q, i) => (
                                        <div key={i} className="qbank-question">
                                            <div className="qbank-question-text">
                                                प्रश्न {i + 1}. {q.question}
                                            </div>
                                            <div className="qbank-sa-answer">
                                                <strong>उत्तर:</strong> {q.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Print Button */}
                            <div className="qbank-print-bar no-print">
                                <button className="btn btn-outline" onClick={() => window.print()}>
                                    <MdPrint size={20} /> प्रिंट / PDF में सेव करें
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
