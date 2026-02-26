import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MdDashboard,
    MdChatBubbleOutline,
    MdArticle,
    MdSchool,
    MdMenuBook,
    MdCampaign
} from 'react-icons/md';
import './Layout.css';

const navItems = [
    { path: '/', name: 'होम', icon: <MdDashboard size={22} /> },
    { path: '/chat', name: 'चैटबॉट', icon: <MdChatBubbleOutline size={22} /> },
    { path: '/news', name: 'समाचार', icon: <MdArticle size={22} /> },
    { path: '/teach', name: 'पढ़ाएं', icon: <MdSchool size={22} /> },
    { path: '/books', name: 'किताबें', icon: <MdMenuBook size={22} /> },
    { path: '/notice', name: 'सूचना', icon: <MdCampaign size={22} /> },
];

const pageNames = {
    '/': 'डैशबोर्ड',
    '/chat': 'AI चैटबॉट',
    '/news': 'शिक्षा समाचार',
    '/teach': 'पढ़ाएं',
    '/books': 'किताबें',
    '/notice': 'सूचनाएं',
};

export default function Layout({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();
    const currentPageName = pageNames[location.pathname] || 'शिक्षक सहायक';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="sidebar glass-panel">
                    <div className="brand">
                        <span className="brand-icon">📚</span>
                        <h2 className="title-saffron">शिक्षक सहायक</h2>
                    </div>

                    <nav className="nav-menu">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="active-indicator"
                                                initial={false}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-profile">
                            <div className="avatar">श</div>
                            <div className="user-info">
                                <span className="user-name">शिक्षक जी</span>
                                <span className="user-role">बिहार बोर्ड</span>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Mobile Top Header */}
            {isMobile && (
                <header className="mobile-header glass-panel">
                    <div className="mobile-header-brand">
                        <span>📚</span>
                        <span className="mobile-header-title title-saffron">शिक्षक सहायक</span>
                    </div>
                    <span className="mobile-header-page">{currentPageName}</span>
                </header>
            )}

            {/* Main Content Area */}
            <main className="main-content">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Mobile Bottom Nav */}
            {isMobile && (
                <nav className="mobile-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`icon-container ${isActive ? 'icon-active' : ''}`}>
                                        {item.icon}
                                        {isActive && <motion.div layoutId="navPill" className="nav-pill" />}
                                    </div>
                                    <span className="mobile-nav-label">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            )}
        </div>
    );
}
