import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdChatBubbleOutline, MdArticle, MdSchool, MdMenuBook, MdCampaign, MdArrowForward, MdStar } from 'react-icons/md';
import './Pages.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('shikshak_user');
    const user = userStr ? JSON.parse(userStr) : { name: 'शिक्षक जी' };

    // Greeting based on time
    const hour = new Date().getHours();
    let greeting = 'नमस्कार';
    if (hour < 12) greeting = 'सुप्रभात';
    else if (hour < 18) greeting = 'शुभ दोपहर';
    else greeting = 'शुभ संध्या';

    const features = [
        { title: 'AI शिक्षक सहायक (चैटबॉट)', desc: 'प्रश्नों के उत्तर, शिक्षण सुझाव और मार्गदर्शन', icon: <MdChatBubbleOutline size={32} />, path: '/chat', color: '#3B82F6' },
        { title: 'शिक्षक समाचार', desc: 'बिहार शिक्षा विभाग की ताज़ा खबरें', icon: <MdArticle size={32} />, path: '/news', color: '#F59E0B' },
        { title: 'पढ़ाएं (MCQ जनरेटर)', desc: 'AI द्वारा कक्षा 1-8 के लिए प्रश्न निर्माण', icon: <MdSchool size={32} />, path: '/teach', color: '#10B981' },
        { title: 'डिजिटल किताबें', desc: 'कक्षा 1-8 की पाठ्यपुस्तकें आसानी से पढ़ें', icon: <MdMenuBook size={32} />, path: '/books', color: '#8B5CF6' },
        { title: 'महत्वपूर्ण सूचनाएं', desc: 'वेतन, स्थानांतरण, और छुट्टियों के आदेश', icon: <MdCampaign size={32} />, path: '/notice', color: '#EF4444' },
        { title: 'वर्तमान विशेषताएँ', desc: 'ऐप की सभी सुविधाओं और आगामी अपडेट्स की सूची', icon: <MdStar size={32} />, path: '/features', color: '#EC4899' }
    ];

    return (
        <div className="page-container">
            <motion.div
                className="hero-card glass-panel gradient-bg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="hero-content">
                    <span className="greeting">{greeting}, {user.name}! 👋</span>
                    <h1 className="hero-title">शिक्षा में आपका डिजिटल साथी</h1>
                    <p className="hero-subtitle">
                        शिक्षक सहायक ऐप में आपका स्वागत है। यहां आपको शिक्षण, बिहार शिक्षा विभाग की खबरों, और
                        पाठ्यक्रम संबंधी सभी संसाधन एक ही जगह मिलेंगे।
                    </p>
                    <button className="btn btn-primary hero-btn" onClick={() => navigate('/chat')}>
                        AI सहायक से बात करें <MdArrowForward />
                    </button>
                </div>
                <div className="hero-illustration">
                    <span className="hero-emoji">👨‍🏫👩‍🏫</span>
                </div>
            </motion.div>

            <div className="section-header mt-8">
                <h2>मुख्य सुविधाएं</h2>
                <p>अपनी ज़रूरत के अनुसार टूल चुनें</p>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="feature-card glass-panel"
                        onClick={() => navigate(feature.path)}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                    >
                        <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                            {feature.icon}
                        </div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.desc}</p>
                        <div className="feature-link">अन्वेषण करें <MdArrowForward /></div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-row mt-8">
                <div className="dashboard-col glass-panel summary-panel">
                    <h3>📌 आज की मुख्य सूचना</h3>
                    <div className="notice-sneak-peek">
                        <span className="badge badge-high">वेतन</span>
                        <h4>शिक्षक वेतन संशोधन आदेश 2026</h4>
                        <p>कक्षा 1-8 के सरकारी शिक्षकों के वेतन में संशोधन...</p>
                        <button className="btn-link" onClick={() => navigate('/notice')}>पूरा पढ़ें</button>
                    </div>
                </div>
                <div className="dashboard-col glass-panel summary-panel">
                    <h3>📰 ताज़ा समाचार अलर्ट</h3>
                    <div className="news-sneak-peek">
                        <h4>बिहार में शिक्षकों की नई भर्ती प्रक्रिया शुरू</h4>
                        <p>बिहार सरकार ने प्राथमिक और मध्य विद्यालयों में...</p>
                        <button className="btn-link" onClick={() => navigate('/news')}>और समाचार</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
