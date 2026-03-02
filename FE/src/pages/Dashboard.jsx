import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MdChatBubbleOutline,
    MdArticle,
    MdSchool,
    MdMenuBook,
    MdCampaign,
    MdArrowForward,
    MdStar,
    MdLightbulb,
    MdEvent,
    MdQuiz,
    MdAssignment,
    MdLibraryAddCheck,
    MdFormatListBulleted,
    MdAutoStories,
    MdBackpack,
    MdGroups
} from 'react-icons/md';

export default function Dashboard() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('shikshak_user');
    const user = userStr ? JSON.parse(userStr) : { name: 'शिक्षक जी' };

    const hour = new Date().getHours();
    let greeting = 'नमस्कार';
    if (hour < 12) greeting = 'सुप्रभात';
    else if (hour < 18) greeting = 'शुभ दोपहर';
    else greeting = 'शुभ संध्या';

    const features = [
        {
            title: 'AI सहायक (चैटबॉट)',
            desc: 'क्लासरूम की समस्याओं और शिक्षण विधियों पर 24/7 सहायता।',
            icon: <MdChatBubbleOutline size={28} />,
            path: '/chat',
            gradient: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
        },
        {
            title: 'अवकाश तालिका 2026',
            desc: 'बिहार सरकार द्वारा घोषित वर्ष 2026 की आधिकारिक छुट्टियों की पूरी सूची।',
            icon: <MdEvent size={28} />,
            path: '/holidays',
            gradient: 'from-fuchsia-500 to-pink-600',
            bgColor: 'bg-fuchsia-50',
            iconColor: 'text-fuchsia-600',
            borderColor: 'border-fuchsia-100',
        },
        {
            title: 'किताबें (BSEB)',
            desc: 'सभी आधिकारिक पाठ्यपुस्तकें और उनके प्रमाणित उत्तर।',
            icon: <MdMenuBook size={28} />,
            path: '/books',
            gradient: 'from-purple-500 to-violet-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
        },
        {
            title: 'सुरक्षित शनिवार',
            desc: 'बैगलेस शनिवार के लिए 120+ रचनात्मक गतिविधियों का संग्रह।',
            icon: <MdBackpack size={28} />,
            path: '/bagless-saturday',
            gradient: 'from-indigo-500 to-purple-600',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            borderColor: 'border-indigo-100',
        },
        {
            title: 'अभिभावक–शिक्षक संगोष्ठी',
            desc: 'परीक्षा पूर्व सकारात्मक सहयोग की सशक्त पहल (PTM)।',
            icon: <MdGroups size={28} />,
            path: '/ptm',
            gradient: 'from-teal-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
        },
        {
            title: 'शिक्षा सूचनाएं',
            desc: 'विभाग के ताज़ा आदेश, वेतन और छुट्टियों की जानकारी।',
            icon: <MdCampaign size={28} />,
            path: '/notice',
            gradient: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-100',
        },
        {
            title: 'शिक्षक समाचार',
            desc: 'बिहार शिक्षा जगत की ताज़ा खबरें और अपडेट्स।',
            icon: <MdArticle size={28} />,
            path: '/news',
            gradient: 'from-rose-500 to-pink-600',
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-100',
        },
        {
            title: 'नवीनतम विशेषताएँ',
            desc: 'ऐप में हुए ताज़ा बदलाव और आगामी अपडेट्स की सूची।',
            icon: <MdStar size={28} />,
            path: '/features',
            gradient: 'from-teal-500 to-cyan-600',
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
            borderColor: 'border-teal-100',
        }
    ];

    const teachingTools = [
        {
            title: 'प्रश्नोत्तरी / प्रश्न बैंक',
            desc: 'पाठ्यक्रम आधारित स्वचालित महत्वपूर्ण प्रश्नोत्तरी।',
            icon: <MdQuiz size={28} />,
            path: '/teach?tab=quiz',
            gradient: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
        },
        {
            title: 'प्रोजेक्ट-आधारित शिक्षा',
            desc: 'छात्रों के लिए रचनात्मक PBL गतिविधियाँ।',
            icon: <MdAssignment size={28} />,
            path: '/teach?tab=pbl',
            gradient: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
        },
        {
            title: 'बिहार बोर्ड (Actual)',
            desc: 'कक्षा 1-8 के पैटर्न के अनुसार सटीक प्रश्न।',
            icon: <MdLibraryAddCheck size={28} />,
            path: '/teach?tab=quiz&mode=actual',
            gradient: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-100',
        },
        {
            title: 'वर्णनात्मक प्रश्न',
            desc: 'विस्तृत उत्तर वाले दीर्घ एवं लघु प्रश्न।',
            icon: <MdFormatListBulleted size={28} />,
            path: '/teach?tab=quiz&mode=descriptive',
            gradient: 'from-purple-500 to-violet-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
        },
        {
            title: 'MCQ (बहुविकल्पीय)',
            desc: 'छात्रों के त्वरित मूल्यांकन के लिए MCQs।',
            icon: <MdAutoStories size={28} />,
            path: '/teach?tab=quiz&mode=mcq',
            gradient: 'from-rose-500 to-pink-600',
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-100',
        }
    ];

    return (
        <div className="space-y-8 pb-20 lg:pb-8">
            {/* Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-3xl p-8 md:p-10 shadow-lg shadow-brand-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-bold text-white bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
                        {greeting}, {user.name} 👋
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                        बिहार बोर्ड शिक्षण को बनाएं <br className="hidden md:block" />और भी सरल और प्रभावी।
                    </h1>
                    <p className="text-brand-100 text-lg md:text-xl mb-8 leading-relaxed">
                        आपकी दैनिक कक्षाओं की तैयारी, पाठ योजना, और विभागीय सूचनाओं का एकमात्र सशक्त डिजिटल साथी।
                    </p>
                    <button
                        onClick={() => navigate('/chat')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-brand-50 transition-all active:scale-95"
                    >
                        <MdLightbulb size={24} />
                        AI से प्रश्न पूछें
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl hidden lg:block"></div>
            </motion.div>

            {/* Teaching and Evaluation Tools (New Section) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">शिक्षण और मूल्यांकन उपकरण</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {teachingTools.map((tool, index) => (
                        <motion.div
                            key={index}
                            onClick={() => navigate(tool.path)}
                            className={`group cursor-pointer bg-white rounded-2xl border ${tool.borderColor} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className={`h-1.5 bg-gradient-to-r ${tool.gradient}`}></div>
                            <div className="p-5 flex flex-col items-center text-center flex-1">
                                <div className={`w-14 h-14 rounded-2xl ${tool.bgColor} ${tool.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    {tool.icon}
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 leading-tight">{tool.title}</h3>
                                <p className="text-gray-500 text-xs md:text-sm leading-relaxed flex-1">{tool.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Grid — Square Box Tiles */}
            <div>
                <div className="flex items-center justify-between mt-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">मुख्य उपकरण (Tools)</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className={`group cursor-pointer bg-white rounded-2xl border ${feature.borderColor} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Gradient Top Bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${feature.gradient}`}></div>

                            <div className="p-5 md:p-6 flex flex-col flex-1">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    {feature.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 leading-tight">{feature.title}</h3>

                                {/* Description */}
                                <p className="text-gray-500 text-sm leading-relaxed flex-1">{feature.desc}</p>

                                {/* Action */}
                                <div className={`mt-5 pt-4 border-t ${feature.borderColor} flex items-center font-bold ${feature.iconColor} text-sm group-hover:gap-2 transition-all`}>
                                    उपयोग करें <MdArrowForward className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Notice & News Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Notice Sneak Peek */}
                <motion.div
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                    <span className="text-xl">📌</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">आज की मुख्य सूचना</h3>
                            </div>
                        </div>
                        <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                            <span className="inline-block px-2.5 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-lg mb-3">
                                अति आवश्यक (URGENT)
                            </span>
                            <h4 className="font-bold text-gray-900 text-lg mb-2">शिक्षक वेतन संशोधन आदेश 2026</h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                कक्षा 1-8 के सरकारी शिक्षकों के वेतन में संशोधन और एरियर भुगतान को लेकर नया सचिवीय आदेश जारी...
                            </p>
                            <button
                                onClick={() => navigate('/notice')}
                                className="text-red-600 font-bold text-sm tracking-wide hover:underline inline-flex items-center gap-1"
                            >
                                पूरा नोटिस पढ़ें <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* News Sneak Peek */}
                <motion.div
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="h-1.5 bg-gradient-to-r from-slate-500 to-gray-600"></div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                                    <span className="text-xl">📰</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">ताज़ा समाचार अलर्ट</h3>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl relative group">
                            <span className="inline-block px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg mb-3">
                                अपडेट (UPDATE)
                            </span>
                            <h4 className="font-bold text-gray-900 text-lg mb-2">बिहार में शिक्षकों की नई भर्ती प्रक्रिया शुरू</h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                बिहार सरकार ने प्राथमिक और मध्य विद्यालयों में गुणवत्ता सुधारने हेतु 35,000 नए पदों की घोषणा की है...
                            </p>
                            <button
                                onClick={() => navigate('/news')}
                                className="text-slate-700 font-bold text-sm tracking-wide hover:underline inline-flex items-center gap-1"
                            >
                                विस्तार से पढ़ें <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
