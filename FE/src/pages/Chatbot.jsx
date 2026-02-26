import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSend, MdPerson, MdSmartToy, MdLanguage } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import './Pages.css';
import { API_BASE } from '../config';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'नमस्ते! मैं आपका शिक्षक सहायक हूँ। मैं बिहार बोर्ड कक्षा 1-8 के विषयों, शिक्षण विधियों या शिक्षा विभाग से जुड़ी जानकारी में आपकी कैसे मदद कर सकता हूँ?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Create history from previous messages (excluding the newest one which is userMessage)
            const history = messages.filter(m => m.role !== 'system');

            const response = await fetch(`${API_BASE}/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content, history })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ त्रुटि: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ नेटवर्क त्रुटि। कृपया बाद में प्रयास करें।' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const prompts = [
        "कक्षा 5 विज्ञान के लिए चुंबकत्व पाठ कैसे पढ़ाएं?",
        "NEP 2020 के अनुसार कक्षा 3 में गणित कैसे पढ़ाएं?",
        "कक्षा 8 हिंदी व्याकरण में समास के उदाहरण दें।"
    ];

    return (
        <div className="page-container chat-container">
            <div className="chat-header glass-panel">
                <div className="chat-title-row">
                    <MdSmartToy size={28} className="text-saffron" />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>AI शिक्षक सहायक</h2>
                        <span className="chat-status">ऑनलाइन (Online)</span>
                    </div>
                </div>
                <button className="btn-icon" title="Language Toggle (English/Hindi Support Built-in)">
                    <MdLanguage size={24} />
                </button>
            </div>

            <div className="chat-messages glass-panel">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            className={`message-wrapper ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="message-avatar">
                                {msg.role === 'user' ? <MdPerson /> : <MdSmartToy />}
                            </div>
                            <div className="message-content">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div className="message-wrapper message-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="message-avatar"><MdSmartToy /></div>
                            <div className="message-content typing-indicator">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-suggestions">
                {prompts.map((p, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => setInput(p)}>
                        {p}
                    </button>
                ))}
            </div>

            <form className="chat-input-form glass-panel" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="अपना प्रश्न यहां लिखें (Write your question here)..."
                    disabled={isLoading}
                />
                <button type="submit" className="btn btn-primary send-btn" disabled={isLoading || !input.trim()}>
                    <MdSend size={20} />
                </button>
            </form>
        </div>
    );
}
