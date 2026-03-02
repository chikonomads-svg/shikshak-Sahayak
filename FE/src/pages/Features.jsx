import { motion } from 'framer-motion';
import { MdCheckCircle, MdLightbulbOutline, MdStarBorder, MdTrendingUp, MdSecurity, MdArrowBack, MdRocketLaunch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Features() {
    const navigate = useNavigate();

    const featureHighlights = [
        {
            category: "🤖 AI शिक्षण सहायक",
            subtitle: "AI Teaching Assistant",
            icon: <MdLightbulbOutline size={28} />,
            gradient: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-50",
            borderColor: "border-blue-200",
            iconBg: "bg-blue-100 text-blue-600",
            checkColor: "text-blue-500",
            items: [
                "स्वचालित पाठ योजना निर्माण: कक्षा 1-8 के लिए बिहार बोर्ड (BSEB) पाठ्यक्रम के अनुसार विस्तृत पाठ योजनाएं।",
                "प्रश्नोत्तरी और MCQ जनरेटर: किसी भी विषय पर बहुविकल्पीय और वर्णनात्मक प्रश्न तुरंत बनाएं।",
                "स्मार्ट चैटबॉट: छात्रों के प्रश्नों के तत्काल, सटीक और पाठ्यक्रम-आधारित उत्तर देने वाला 24/7 AI सहायक।"
            ]
        },
        {
            category: "📚 डिजिटल लाइब्रेरी",
            subtitle: "Digital Books Archive",
            icon: <MdStarBorder size={28} />,
            gradient: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50",
            borderColor: "border-emerald-200",
            iconBg: "bg-emerald-100 text-emerald-600",
            checkColor: "text-emerald-500",
            items: [
                "कक्षा 1-8 की सभी बिहार बोर्ड की किताबें डिजिटल (PDF) रूप में एक क्लिक पर उपलब्ध।",
                "विषयवार और कक्षावार स्मार्ट वर्गीकरण के साथ सहज नेविगेशन।",
                "किताबें और प्रमाणित उत्तर आधिकारिक सर्वर से बिना विज्ञापन डाउनलोड करें।"
            ]
        },
        {
            category: "📢 रीयल-टाइम सूचनाएं",
            subtitle: "Notices & News",
            icon: <MdTrendingUp size={28} />,
            gradient: "from-amber-500 to-orange-600",
            bgLight: "bg-amber-50",
            borderColor: "border-amber-200",
            iconBg: "bg-amber-100 text-amber-600",
            checkColor: "text-amber-500",
            items: [
                "शिक्षा विभाग के सभी आदेश, स्थानांतरण नीतियां, वेतन अपडेट एक ही डैशबोर्ड पर।",
                "बिहार शिक्षा परिदृश्य की ताज़ा खबरों का लाइव एकत्रीकरण।",
                "महत्वपूर्ण सूचनाओं को बुकमार्क करने की क्षमता (आगामी)।"
            ]
        },
        {
            category: "🔒 डेटा सुरक्षा",
            subtitle: "Teacher Security",
            icon: <MdSecurity size={28} />,
            gradient: "from-purple-500 to-violet-600",
            bgLight: "bg-purple-50",
            borderColor: "border-purple-200",
            iconBg: "bg-purple-100 text-purple-600",
            checkColor: "text-purple-500",
            items: [
                "बैंक-ग्रेड एन्क्रिप्शन (SHA-256) और PostgreSQL क्लाउड डेटाबेस।",
                "चैट इतिहास और पाठ योजनाओं का सुरक्षित क्लाउड सिंक।",
                "शिक्षक का डेटा कभी भी तीसरे पक्ष के साथ साझा नहीं किया जाता।"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-surface pb-12">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white p-6 md:p-10 mb-8 rounded-b-[2.5rem] shadow-md shadow-brand-500/20 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-30%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">✨ वर्तमान विशेषताएँ</h1>
                        <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">बिहार बोर्ड शिक्षकों को सशक्त बनाने वाले अत्याधुनिक डिजिटल साधन</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-colors backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto"
                    >
                        <MdArrowBack className="text-xl" /> वापस डैशबोर्ड
                    </button>
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featureHighlights.map((feat, idx) => (
                        <motion.div
                            key={idx}
                            className={`bg-white rounded-2xl shadow-sm border ${feat.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300 group`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.12 }}
                            whileHover={{ y: -4 }}
                        >
                            {/* Colored Top Bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${feat.gradient}`}></div>

                            <div className="p-6 md:p-8">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${feat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                        {feat.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{feat.category}</h2>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{feat.subtitle}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <ul className="space-y-4">
                                    {feat.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className={`flex items-start gap-3 ${feat.bgLight} p-4 rounded-xl border ${feat.borderColor} border-opacity-50`}>
                                            <MdCheckCircle className={`${feat.checkColor} mt-0.5 flex-shrink-0`} size={20} />
                                            <span className="text-gray-700 text-sm leading-relaxed font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Upcoming Features Banner */}
                <motion.div
                    className="mt-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-sm overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
                    <div className="absolute top-10 right-[-2rem] w-32 h-32 bg-emerald-200 rounded-full opacity-40 blur-2xl"></div>
                    <div className="absolute bottom-0 left-[-2rem] w-24 h-24 bg-teal-200 rounded-full opacity-40 blur-2xl"></div>

                    <div className="p-8 relative z-10 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <MdRocketLaunch size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-6">🚀 आगे क्या है? (Upcoming)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {[
                                { emoji: "🎤", title: "ऑडियो/वॉयस डिक्टेशन", desc: "बोलकर पाठ योजनाएं और प्रश्न बनाएं।" },
                                { emoji: "📊", title: "छात्र प्रगति ट्रैकिंग", desc: "क्विज़ के आधार पर प्रदर्शन का ग्राफिकल विश्लेषण।" },
                                { emoji: "🗣️", title: "स्थानीय भाषा समर्थन", desc: "मैथिली, भोजपुरी, और मगही भाषाओं का एकीकरण।" }
                            ].map((upcoming, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-emerald-100 hover:bg-white hover:shadow-md transition-all"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    whileHover={{ y: -3 }}
                                >
                                    <span className="text-3xl mb-3 block">{upcoming.emoji}</span>
                                    <h4 className="font-bold text-emerald-900 text-base mb-1">{upcoming.title}</h4>
                                    <p className="text-emerald-700 text-sm font-medium">{upcoming.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
