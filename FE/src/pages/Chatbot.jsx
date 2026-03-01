import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowUpward, MdPerson, MdSmartToy, MdLanguage } from 'react-icons/md';
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
        <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto bg-surface relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm rounded-t-2xl z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        <MdSmartToy size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 leading-tight">AI शिक्षक सहायक</h2>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ऑनलाइन (Online)
                        </div>
                    </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Language Toggle (English/Hindi Support Built-in)">
                    <MdLanguage size={22} />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
                <AnimatePresence>
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        return (
                            <motion.div
                                key={idx}
                                className={`flex items-end gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-brand-100 text-brand-700' : 'bg-white border border-gray-200 text-gray-600 shadow-sm'}`}>
                                    {isUser ? <MdPerson size={18} /> : <MdSmartToy size={18} />}
                                </div>
                                <div className={`relative px-5 py-3.5 rounded-2xl text-[15px] shadow-sm ${isUser ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                                    <ReactMarkdown className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        );
                    })}

                    {isLoading && (
                        <motion.div
                            className="flex items-end gap-3 max-w-[85%] mr-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-sm shrink-0">
                                <MdSmartToy size={18} />
                            </div>
                            <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-bl-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 relative">
                {/* Suggestions */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                    {prompts.map((p, i) => (
                        <button
                            key={i}
                            className="whitespace-nowrap px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-sm rounded-full transition-colors font-medium border border-brand-100/50"
                            onClick={() => setInput(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <form className="relative flex items-center" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="अपना प्रश्न यहां लिखें (Write your question here)..."
                        disabled={isLoading}
                        className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-gray-800 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={`absolute right-2.5 p-2.5 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isLoading
                                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <MdArrowUpward size={20} className={input.trim() && !isLoading ? 'animate-pulse' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
}
