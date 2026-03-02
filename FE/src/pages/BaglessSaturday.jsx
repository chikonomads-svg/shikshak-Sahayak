import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdBackpack, MdExpandMore, MdExpandLess, MdLocalActivity, MdAutoAwesome, MdClose } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { baglessSaturdayData } from '../data/baglessSaturday';
import { API_BASE } from '../config';

export default function BaglessSaturday() {
    const navigate = useNavigate();

    // LLM Modal State
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [llmResponse, setLlmResponse] = useState('');
    const [isLoadingLlm, setIsLoadingLlm] = useState(false);

    const handleActivityClick = async (activity) => {
        setSelectedActivity(activity);
        setLlmResponse('');
        setIsLoadingLlm(true);

        const prompt = `कक्षा 1 से 8 तक के छात्रों के लिए "बैगलेस सुरक्षित शनिवार" (Bagless Safe Saturday) कार्यक्रम के तहत निम्नलिखित गतिविधि को कैसे कराया जाए, इसका विस्तार से वर्णन करें। शिक्षक के लिए निर्देश, आवश्यक सामग्री (यदि कोई हो), और गतिविधि के लाभ भी बताएं।\n\nगतिविधि का नाम: ${activity.activityName}\nविवरण: ${activity.description}`;

        try {
            const response = await fetch(`${API_BASE}/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt, history: [] })
            });

            const data = await response.json();
            if (data.error) {
                setLlmResponse(`⚠️ त्रुटि: ${data.error}`);
            } else {
                setLlmResponse(data.reply);
            }
        } catch (err) {
            setLlmResponse('⚠️ नेटवर्क त्रुटि। कृपया बाद में प्रयास करें।');
        } finally {
            setIsLoadingLlm(false);
        }
    };

    // Group activities by month to keep the UI clean
    const groupedData = baglessSaturdayData.reduce((acc, current) => {
        if (!acc[current.month]) {
            acc[current.month] = {
                domain: current.domain,
                activities: []
            };
        }
        acc[current.month].activities.push(current);
        return acc;
    }, {});

    // Month keys in regular calendar order (January to December)
    const monthsOrder = [
        "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];

    // Open first month by default
    const [openMonth, setOpenMonth] = useState(monthsOrder[0]);

    const toggleMonth = (month) => {
        setOpenMonth(openMonth === month ? null : month);
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-8">
            {/* Header / Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 rounded-3xl p-8 md:p-10 shadow-lg shadow-indigo-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all text-white border border-white/20"
                >
                    <MdOutlineArrowBackIos className="ml-1.5" size={20} />
                </button>

                <div className="relative z-10 max-w-3xl mt-12 md:mt-4 md:ml-12 text-center md:text-left">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-bold text-white bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
                        <MdBackpack size={18} />
                        बैगलेस सुरक्षित शनिवार
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        हर शनिवार<br className="md:hidden" /> एक रोचक नवाचार
                    </h1>
                    <p className="text-indigo-100 text-lg md:text-xl leading-relaxed max-w-2xl">
                        बच्चों को किताबी ज्ञान से परे वास्तविक दुनिया से जोड़ें। रचनात्मकता, जिज्ञासा, और जीवन कौशल का विकास।
                    </p>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-32 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
            </motion.div>

            {/* Content Section - Accordion Style per Month */}
            <div className="max-w-4xl mx-auto space-y-4">
                {monthsOrder.map((month, index) => {
                    const monthData = groupedData[month];
                    if (!monthData) return null; // Safe guard if a month is missing

                    const isOpen = openMonth === month;

                    return (
                        <motion.div
                            key={month}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleMonth(month)}
                                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors
                                        ${isOpen ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-700'}`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                            {month} माह
                                        </h2>
                                        <div className="text-sm font-medium text-purple-600 mt-1 flex items-center gap-1.5">
                                            <MdLocalActivity />
                                            थीम: {monthData.domain}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-400 p-2 bg-gray-50 rounded-full">
                                    {isOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                                </div>
                            </button>

                            {/* Accordion Body */}
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="border-t border-gray-100 bg-gray-50/50"
                                    >
                                        <div className="p-5 md:p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                                            {monthData.activities.map((activity, actIndex) => (
                                                <div
                                                    key={actIndex}
                                                    onClick={() => handleActivityClick(activity)}
                                                    className="bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-md transition-all group cursor-pointer relative"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                            गतिविधि {activity.serial}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                            <MdAutoAwesome className="animate-pulse" />
                                                            AI से पूछें
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 leading-snug pr-4">
                                                        {activity.activityName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Guidelines Section */}
            <motion.div
                className="mt-8 text-gray-700 text-sm bg-indigo-50/50 rounded-2xl p-6 md:p-8 border border-indigo-100 shadow-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">ℹ️</span> बैगलेस सुरक्षित शनिवार के सामान्य दिशानिर्देश:
                </h3>
                <ul className="list-disc pl-5 space-y-3 leading-relaxed">
                    <li>यह कार्यक्रम कक्षा 1 से 8वीं तक के छात्र-छात्राओं के लिए <strong>अनिवार्य</strong> है।</li>
                    <li>बच्चे बिना बस्ते के स्कूल आएंगे, वे अपने साथ रंग, कोरे कागज, और छोटे खिलौने ला सकते हैं।</li>
                    <li>शिक्षक अपनी सुविधा के अनुसार आवंटित डोमेन के तहत कोई भी गतिविधि चुनकर करा सकते हैं।</li>
                    <li>माह के चौथे शनिवार को अनिवार्य रूप से <strong>'अभिभावक शिक्षक संगोष्ठी/बैठक (PTM)'</strong> आयोजित की जाएगी।</li>
                </ul>
            </motion.div>

            {/* AI Assistant Modal */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedActivity(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                        <MdAutoAwesome size={22} className={isLoadingLlm ? "animate-spin" : ""} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">AI शिक्षक सहायक</h3>
                                        <p className="text-xs font-medium text-indigo-600">
                                            {selectedActivity.activityName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
                                >
                                    <MdClose size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                                {isLoadingLlm ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                                            <MdAutoAwesome className="absolute inset-0 m-auto text-indigo-600" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">AI विचार कर रहा है...</h4>
                                            <p className="text-sm text-gray-500 mt-1">बेहतरीन शिक्षण विधियां तैयार की जा रही हैं</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-indigo max-w-none text-sm leading-relaxed prose-headings:font-bold prose-h3:text-lg prose-h4:text-base prose-p:text-gray-700">
                                        <ReactMarkdown>{llmResponse}</ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors shadow-sm"
                                >
                                    समझ गया (Got it)
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
