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
    MdLightbulb
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
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100'
        },
        {
            title: 'पाठ योजना (पढ़ाएं)',
            desc: 'कक्षा 1-8 के लिए स्वचालित प्रश्नोत्तरी और पाठ रूपरेखा।',
            icon: <MdSchool size={28} />,
            path: '/teach',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100'
        },
        {
            title: 'किताबें (BSEB)',
            desc: 'सभी आधिकारिक पाठ्यपुस्तकें और उनके प्रमाणित उत्तर।',
            icon: <MdMenuBook size={28} />,
            path: '/books',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100'
        },
        {
            title: 'शिक्षा सूचनाएं',
            desc: 'विभाग के ताज़ा आदेश, वेतन और छुट्टियों की जानकारी।',
            icon: <MdCampaign size={28} />,
            path: '/notice',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-100'
        },
        {
            title: 'शिक्षक समाचार',
            desc: 'बिहार शिक्षा जगत की ताज़ा खबरें और अपडेट्स।',
            icon: <MdArticle size={28} />,
            path: '/news',
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-100'
        },
        {
            title: 'नवीनतम विशेषताएँ',
            desc: 'ऐप में हुए ताज़ा बदलाव और आगामी अपडेट्स की सूची।',
            icon: <MdStar size={28} />,
            path: '/features',
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
            borderColor: 'border-teal-100'
        }
    ];

    return (
        <div className="space-y-8 pb-20 lg:pb-8">
            {/* Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl border border-brand-200 p-8 md:p-10 shadow-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-brand-700 bg-brand-200/50 rounded-full">
                        {greeting}, {user.name} 👋
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                        बिहार बोर्ड शिक्षण को बनाएं <br className="hidden md:block" />और भी सरल और प्रभावी।
                    </h1>
                    <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed">
                        आपकी दैनिक कक्षाओं की तैयारी, पाठ योजना, और विभागीय सूचनाओं का एकमात्र सशक्त डिजिटल साथी।
                    </p>
                    <button
                        onClick={() => navigate('/chat')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                    >
                        <MdLightbulb size={24} />
                        AI से प्रश्न पूछें
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-200 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-24 right-10 w-48 h-48 bg-accent-200 rounded-full opacity-50 blur-3xl"></div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">मुख्य उपकरण (Tools)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className={`group cursor-pointer bg-white rounded-2xl border ${feature.borderColor} p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-4 rounded-xl ${feature.bgColor} ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed flex-1">{feature.desc}</p>
                            <div className={`mt-6 flex items-center font-bold ${feature.iconColor} text-sm group-hover:gap-2 transition-all`}>
                                उपयोग करें <MdArrowForward className="ml-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Notice & News Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Notice Sneak Peek */}
                <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📌</span>
                            <h3 className="text-lg font-bold text-gray-900">आज की मुख्य सूचना</h3>
                        </div>
                    </div>
                    <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                        <span className="inline-block px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-md mb-3">
                            अति आवश्यक (URGENT)
                        </span>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">शिक्षक वेतन संशोधन आदेश 2026</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            कक्षा 1-8 के सरकारी शिक्षकों के वेतन में संशोधन और एरियर भुगतान को लेकर नया सचिवीय आदेश जारी...
                        </p>
                        <button
                            onClick={() => navigate('/notice')}
                            className="text-red-600 font-bold text-sm tracking-wide hover:underline inline-flex items-center"
                        >
                            पूरा नोटिस पढ़ें <MdArrowForward className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                        </button>
                    </div>
                </div>

                {/* News Sneak Peek */}
                <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📰</span>
                            <h3 className="text-lg font-bold text-gray-900">ताज़ा समाचार अलर्ट</h3>
                        </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex-1 relative group">
                        <span className="inline-block px-2 py-1 text-xs font-bold text-slate-600 bg-slate-200 rounded-md mb-3">
                            अपडेट (UPDATE)
                        </span>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">बिहार में शिक्षकों की नई भर्ती प्रक्रिया शुरू</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            बिहार सरकार ने प्राथमिक और मध्य विद्यालयों में गुणवत्ता सुधारने हेतु 35,000 नए पदों की घोषणा की है...
                        </p>
                        <button
                            onClick={() => navigate('/news')}
                            className="text-slate-700 font-bold text-sm tracking-wide hover:underline inline-flex items-center"
                        >
                            विस्तार से पढ़ें <MdArrowForward className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
