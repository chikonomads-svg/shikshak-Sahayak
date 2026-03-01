import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MdDashboard,
    MdChatBubbleOutline,
    MdArticle,
    MdSchool,
    MdMenuBook,
    MdCampaign,
    MdLogout,
    MdMenu
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPageName = pageNames[location.pathname] || 'शिक्षक सहायक';

    // Get signed in user data
    const userStr = localStorage.getItem('shikshak_user');
    const user = userStr ? JSON.parse(userStr) : { name: 'शिक्षक जी' };
    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'श';

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else if (window.innerWidth >= 1024 && !isSidebarOpen) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    const handleLogout = () => {
        localStorage.removeItem('shikshak_user');
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* Desktop Floating Toggle when sidebar is closed */}
            {!isMobile && !isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="floating-sidebar-toggle"
                    title="Open Sidebar"
                >
                    <MdMenu size={24} />
                </button>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className={`sidebar glass-panel ${!isSidebarOpen ? 'collapsed' : ''}`}>
                    <div className="brand" style={{ justifyContent: 'space-between', width: '100%', padding: '0 0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="brand-icon">📚</span>
                            <h2 className="title-saffron">शिक्षक सहायक</h2>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="btn-icon" style={{ padding: '4px' }} title="Hide Sidebar">
                            <MdMenu size={22} />
                        </button>
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
                        <div className="user-profile flex-1">
                            <div className="avatar">{initial}</div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">बिहार बोर्ड</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none', color: '#EF4444' }} title="लॉग आउट">
                            <MdLogout size={22} />
                        </button>
                    </div>
                </aside>
            )}

            {/* Mobile Top Header */}
            {isMobile && (
                <header className="mobile-header glass-panel" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="mobile-header-brand">
                            <span>📚</span>
                            <span className="mobile-header-title title-saffron">शिक्षक सहायक</span>
                        </div>
                        <span className="mobile-header-page" style={{ marginLeft: '4px' }}>{currentPageName}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-link" style={{ color: '#EF4444', padding: '0 8px' }}>
                        <MdLogout size={22} />
                    </button>
                </header>
            )}

            {/* Main Content Area */}
            <main className={`main-content ${!isSidebarOpen && !isMobile ? 'sidebar-closed' : ''}`}>
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
