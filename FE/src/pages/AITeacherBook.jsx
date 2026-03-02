import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdAutoStories, MdImportContacts } from 'react-icons/md';

export default function AITeacherBook() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-20 lg:pb-8">
            {/* Header / Hero Section */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-sky-600 to-blue-600 rounded-3xl p-8 md:p-10 shadow-lg shadow-sky-500/20"
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
                        <MdAutoStories size={18} />
                        मार्गदर्शिका (Handbook)
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        शिक्षक और AI
                    </h1>
                    <p className="text-sky-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                        भविष्य के लिए तैयार शिक्षक: आत्मविश्वास और तकनीक का संगम
                    </p>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-32 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
            </motion.div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
                >
                    <div className="prose prose-lg prose-sky max-w-none text-gray-700 leading-relaxed mb-8">
                        <p>
                            यह पुस्तक केवल <strong>Artificial Intelligence (AI)</strong> और डिजिटल टूल्स की जानकारी देने के लिए नहीं लिखी गई है। यह पुस्तक शिक्षकों के मन से डर हटाने, आत्मविश्वास जगाने और उन्हें भविष्य के लिए तैयार करने के उद्देश्य से लिखी गई है।
                        </p>
                        <p>
                            आज का शिक्षक एक ऐसे समय में खड़ा है, जहाँ बदलाव बहुत तेज़ है। तकनीक बदल रही है, शिक्षा का स्वरूप बदल रहा है और छात्रों की अपेक्षाएँ भी बदल रही हैं। इसी बदलाव के बीच कई शिक्षक खुद से यह पूछते हैं—
                        </p>

                        <div className="bg-sky-50 rounded-xl p-6 border-l-4 border-sky-500 my-6 italic text-sky-900 font-medium space-y-2">
                            <p>“क्या मैं पीछे रह जाऊँगा?”</p>
                            <p>“क्या मैं नई तकनीक सीख पाऊँगा?”</p>
                            <p>“क्या मेरी ज़रूरत अब भी रहेगी?”</p>
                        </div>

                        <p>
                            इस पुस्तक का मिशन इन सभी सवालों का एक ही उत्तर देना है—
                        </p>
                        <p className="font-bold text-sky-700 text-xl py-2">
                            हाँ, आप ज़रूरी हैं। हाँ, आप सीख सकते हैं। और हाँ, आप पहले से भी बेहतर शिक्षक बन सकते हैं।
                        </p>
                        <p>
                            हमारा मिशन है कि हर शिक्षक AI को खतरा नहीं, बल्कि एक सहायक, एक साथी, और एक सहारा समझे— जो उसके काम को आसान बनाए, उसका समय बचाए और उसकी Teaching को और प्रभावशाली बनाए। यह पुस्तक विशेष रूप से उन शिक्षकों के लिए समर्पित है, जो सीमित संसाधनों में भी असीम संभावनाएँ पैदा करते हैं।
                        </p>
                        <p className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-900 font-medium text-center">
                            अगर यह पुस्तक किसी एक भी शिक्षक को यह कहने का हौसला दे दे—<br />
                            <span className="text-xl font-bold text-indigo-700 mt-2 block">“मैं भी कर सकता हूँ”</span>
                            <br />तो यही इस मिशन की सबसे बड़ी सफलता होगी।
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-blue-900 text-xl mb-2 flex items-center justify-center md:justify-start gap-2">
                                <MdImportContacts size={24} />
                                सम्पूर्ण पुस्तक पढ़ें
                            </h3>
                            <p className="text-blue-700">
                                डिजिटल फ्लिपबुक प्रारूप में पुस्तक पढ़ने के लिए लिंक पर क्लिक करें।
                            </p>
                        </div>

                        <a
                            href="https://www.teachersofbihar.org/eresources/teachers-and-ai-1769439972#flipbook-df_manual_book/23/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-blue-600/20 whitespace-nowrap shrink-0"
                        >
                            <MdImportContacts size={20} />
                            Read Flipbook
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
