import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdRefresh, MdCheckCircle, MdCancel, MdSchool } from 'react-icons/md';
import './Pages.css';

export default function Teach() {
    const [subjectsData, setSubjectsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);

    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedSubject, setSelectedSubject] = useState('math');
    const [topic, setTopic] = useState('');

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetch('/api/teach/subjects')
            .then(res => res.json())
            .then(data => setSubjectsData(data.subjects))
            .catch(err => console.error(err));
    }, []);

    const generateQuestions = async (e) => {
        e.preventDefault();
        setLoading(true);
        setQuestions([]);
        setAnswers({});
        setSubmitted(false);

        try {
            const res = await fetch('/api/teach/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: selectedSubject,
                    class_num: parseInt(selectedClass),
                    topic,
                    count: 5,
                    difficulty: 'medium'
                })
            });
            const data = await res.json();
            if (data.questions) {
                setQuestions(data.questions);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    if (!subjectsData) return <div className="loading-state">लोड हो रहा है...</div>;

    const classesList = [1, 2, 3, 4, 5, 6, 7, 8];

    // Get topics for selected class/subject
    const availableTopics = subjectsData[selectedSubject]?.classes[selectedClass] || [];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>पढ़ाएं (MCQ जनरेटर)</h1>
                    <p>AI द्वारा कक्षा अनुसार प्रश्नोत्तरी बनाएं</p>
                </div>
                <MdSchool size={48} className="text-saffron opacity-50" />
            </div>

            <div className="generator-controls glass-panel mb-8">
                <form className="generator-form" onSubmit={generateQuestions}>
                    <div className="form-group">
                        <label>कक्षा (Class)</label>
                        <select value={selectedClass} onChange={e => {
                            setSelectedClass(e.target.value);
                            setTopic('');
                        }}>
                            {classesList.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>विषय (Subject)</label>
                        <select value={selectedSubject} onChange={e => {
                            setSelectedSubject(e.target.value);
                            setTopic('');
                        }} className="capitalize">
                            {Object.entries(subjectsData).map(([key, subj]) => (
                                // Only show if subject exists for this class
                                subj.classes[selectedClass] ? (
                                    <option key={key} value={key}>{subj.icon} {subj.name}</option>
                                ) : null
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>टॉपिक / अध्याय (Topic)</label>
                        <select value={topic} onChange={e => setTopic(e.target.value)}>
                            <option value="">सभी (All Topics)</option>
                            {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-generate" disabled={loading}>
                        {loading ? <span className="spinner-small" /> : <MdRefresh />} प्रश्न बनाएं
                    </button>
                </form>
            </div>

            {loading && (
                <div className="loading-state glass-panel">
                    <div className="spinner"></div>
                    <p>AI आपके लिए प्रश्न तैयार कर रहा है...</p>
                </div>
            )}

            {questions.length > 0 && !loading && (
                <motion.div className="quiz-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="quiz-header">
                        <h3>प्रश्नोत्तरी तैयार है!</h3>
                        <span className="badge badge-medium">{questions.length} प्रश्न</span>
                    </div>

                    <div className="questions-list">
                        {questions.map((q, qIdx) => (
                            <div key={qIdx} className={`question-card glass-panel ${submitted ? (answers[qIdx] === q.correct ? 'correct-bg' : 'wrong-bg') : ''}`}>
                                <div className="q-badge">प्रश्न {qIdx + 1}</div>
                                <h4 className="q-text">{q.question}</h4>

                                <div className="options-grid">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = answers[qIdx] === optIdx;
                                        const isCorrect = submitted && optIdx === q.correct;
                                        const isWrong = submitted && isSelected && !isCorrect;

                                        let btnClass = "btn btn-outline opt-btn text-left";
                                        if (isSelected && !submitted) btnClass = "btn btn-primary opt-btn text-left";
                                        if (isCorrect) btnClass = "btn opt-btn text-left bg-green-100 border-green-500 text-green-800";
                                        if (isWrong) btnClass = "btn opt-btn text-left bg-red-100 border-red-500 text-red-800";

                                        return (
                                            <button
                                                key={optIdx}
                                                className={btnClass}
                                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                disabled={submitted}
                                            >
                                                {opt}
                                                {isCorrect && <MdCheckCircle className="ml-auto text-green-600" />}
                                                {isWrong && <MdCancel className="ml-auto text-red-600" />}
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
                            </div>
                        ))}
                    </div>

                    {!submitted ? (
                        <button
                            className="btn btn-primary w-full mt-6 py-3 text-lg"
                            onClick={() => setSubmitted(true)}
                            disabled={Object.keys(answers).length < questions.length}
                        >
                            उत्तर जांचें
                        </button>
                    ) : (
                        <div className="quiz-result glass-panel mt-6 text-center">
                            <h2 className="title-saffron mb-2">स्कोर: {calculateScore()} / {questions.length}</h2>
                            <p>बहुत बढ़िया! आप चाहें तो इन प्रश्नों को छात्रों के साथ साझा कर सकते हैं।</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
