import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdBackpack, MdExpandMore, MdExpandLess, MdLocalActivity } from 'react-icons/md';
import { baglessSaturdayData } from '../data/baglessSaturday';

export default function BaglessSaturday() {
    const navigate = useNavigate();

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
                                                    className="bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                            गतिविधि {activity.serial}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 leading-snug">
                                                        {activity.activityName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
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
        </div>
    );
}
