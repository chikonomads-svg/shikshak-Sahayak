import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdGroups, MdDownload } from 'react-icons/md';

export default function Ptm() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-20 lg:pb-8">
            {/* Header / Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600 rounded-3xl p-8 md:p-10 shadow-lg shadow-emerald-500/20"
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
                        <MdGroups size={18} />
                        PTM
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        अभिभावक–शिक्षक संगोष्ठी
                    </h1>
                    <p className="text-emerald-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                        परीक्षा पूर्व सकारात्मक सहयोग की सशक्त पहल
                    </p>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-32 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
            </motion.div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
                >
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        Bihar के विद्यालयों में प्रत्येक माह आयोजित होने वाली अभिभावक–शिक्षक संगोष्ठी शिक्षा व्यवस्था की एक महत्वपूर्ण कड़ी बन चुकी है। इस संगोष्ठी का उद्देश्य केवल औपचारिक बैठक करना नहीं, बल्कि विद्यालय और अभिभावकों के बीच <strong>सार्थक संवाद</strong> स्थापित करना है, ताकि बच्चों के सर्वांगीण विकास की दिशा में संयुक्त प्रयास किए जा सकें।
                    </p>

                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                        <h3 className="font-bold text-emerald-800 text-xl mb-3 flex items-center gap-2">
                            <MdDownload size={24} />
                            नवीनतम PTM संसाधन (Latest Content)
                        </h3>
                        <p className="text-emerald-700 mb-5">
                            आगामी अभिभावक-शिक्षक संगोष्ठी के लिए आवश्यक दिशा-निर्देश, एजेंडा, और अन्य महत्वपूर्ण सामग्री डाउनलोड करने के लिए नीचे दिए गए लिंक पर क्लिक करें।
                        </p>

                        <a
                            href="https://www.teachersofbihar.org/eresources"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-emerald-600/20 w-full md:w-auto justify-center"
                        >
                            <MdDownload size={20} />
                            Download Latest Month PTM Resource
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
