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
    { path: '/', name: 'डैशबोर्ड', icon: <MdDashboard size={24} /> },
    { path: '/chat', name: 'चैटबॉट', icon: <MdChatBubbleOutline size={24} /> },
    { path: '/news', name: 'समाचार', icon: <MdArticle size={24} /> },
    { path: '/teach', name: 'पढ़ाएं', icon: <MdSchool size={24} /> },
    { path: '/books', name: 'किताबें', icon: <MdMenuBook size={24} /> },
    { path: '/notice', name: 'सूचना', icon: <MdCampaign size={24} /> },
];

export default function Layout({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

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
                            <div className="avatar">प्र</div>
                            <div className="user-info">
                                <span className="user-name">प्रमिला जी</span>
                                <span className="user-role">बिहार बोर्ड</span>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <main className="main-content">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Mobile Bottom Nav */}
            {isMobile && (
                <nav className="mobile-nav glass-panel">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="icon-container">
                                        {item.icon}
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
