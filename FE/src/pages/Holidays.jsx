import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineArrowBackIos, MdEvent } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { holidays2026 } from '../data/holidays2026';

export default function Holidays() {
    const navigate = useNavigate();

    // Group holidays by month (basic approach based on string matching)
    const months = [
        "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवंबर", "दिसम्बर"
    ];

    const groupedHolidays = months.reduce((acc, month) => {
        const monthHolidays = holidays2026.filter(h => h.date.includes(month));
        if (monthHolidays.length > 0) {
            acc[month] = monthHolidays;
        }
        return acc;
    }, {});

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 lg:pb-12 px-4 sm:px-6">
            {/* Header Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600 rounded-3xl p-6 md:p-10 shadow-lg shadow-pink-500/20 mb-8 mt-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-20"
                >
                    <MdOutlineArrowBackIos className="ml-1" size={20} />
                </button>

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-inner border border-white/20">
                        <span className="text-3xl">🗓️</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                        अवकाश तालिका 2026
                    </h1>
                    <p className="text-pink-100 text-lg md:text-xl max-w-xl">
                        बिहार सरकार द्वारा घोषित वर्ष 2026 की आधिकारिक छुट्टियों की पूरी सूची।
                    </p>
                </div>

                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </motion.div>

            {/* Holidays List */}
            <div className="space-y-12">
                {Object.entries(groupedHolidays).map(([month, holidays], monthIndex) => (
                    <motion.div
                        key={month}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="relative"
                    >
                        {/* Month sticky header */}
                        <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md py-4 mb-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <span className="text-fuchsia-600">{month}</span>
                                <span className="text-sm font-medium px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full">
                                    {holidays.length} छुट्टियां
                                </span>
                            </h2>
                        </div>

                        {/* Month Holidays Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {holidays.map((holiday, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="group bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-fuchsia-200 transition-all duration-300 flex items-start gap-4 md:gap-5"
                                >
                                    {/* Emoji Box */}
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300 group-hover:bg-fuchsia-100">
                                        {holiday.emoji}
                                    </div>

                                    {/* Holiday Details */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-fuchsia-700 transition-colors">
                                            {holiday.name}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-3">
                                            <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <MdEvent className="text-fuchsia-500" />
                                                <span>{holiday.date}</span>
                                            </div>
                                            <span className="hidden sm:block text-gray-300">•</span>
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium inline-block w-fit">
                                                {holiday.day}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Notes */}
            <motion.div
                className="mt-12 text-gray-700 text-sm bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">⚠️</span> महत्वपूर्ण सूचना (निर्देश):
                </h3>
                <ol className="list-decimal pl-5 space-y-3 leading-relaxed">
                    <li>चाँद के दृष्टिगोचर होने के अनुसार मुस्लिम त्योहारों की तिथि में परिवर्तन हो सकता है।</li>
                    <li>राज्य के सभी राजकीय / राजकीयकृत / परियोजना / उत्क्रमित प्रारंभिक, माध्यमिक एवं उच्च माध्यमिक विद्यालय उक्त अवकाश तालिका के अनुसार ही बंद रहेंगे।</li>
                    <li>सभी विद्यालयों में वार्षिकोत्सव, गणतंत्र दिवस, स्वतंत्रता दिवस एवं गाँधी जयन्ती मनायी जाएगी। इस दौरान सभी विद्यार्थी एवं शिक्षक उपस्थित रहेंगे। कार्यक्रम आयोजन के बाद विद्यालय की छुट्टी होगी।</li>
                    <li>दीर्घकालीन अवकाश यथा ग्रीष्मावकाश, दीपावली से छठ पूजा तक के अवकाश अवधि एवं शीतकालीन अवकाश में छात्र/छात्राओं को सभी विषयों के लिए गृह कार्य एवं परियोजना कार्य दिया जाना अनिवार्य होगा। विद्यालय खुलने पर शिक्षक का यह दायित्व होगा कि उक्त कार्यों का मूल्यांकन करेंगे।</li>
                </ol>
            </motion.div>
        </div>
    );
}
