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
    MdMenu,
    MdClose
} from 'react-icons/md';

const navItems = [
    { path: '/', name: 'होम (Home)', icon: <MdDashboard size={24} /> },
    { path: '/chat', name: 'AI सहायक', icon: <MdChatBubbleOutline size={24} /> },
    { path: '/news', name: 'समाचार', icon: <MdArticle size={24} /> },
    { path: '/teach', name: 'पढ़ाएं', icon: <MdSchool size={24} /> },
    { path: '/books', name: 'किताबें', icon: <MdMenuBook size={24} /> },
    { path: '/notice', name: 'सूचना', icon: <MdCampaign size={24} /> },
];

const pageNames = {
    '/': 'डैशबोर्ड',
    '/chat': 'AI सहायक',
    '/news': 'ताज़ा समाचार',
    '/teach': 'पाठ योजना',
    '/books': 'पुस्तकालय',
    '/notice': 'आधिकारिक सूचनाएं',
    '/features': 'विशेषताएँ',
};

export default function Layout({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPageName = pageNames[location.pathname] || 'शिक्षक सहायक';

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
        <div className="flex h-screen bg-surface font-hindi overflow-hidden">
            {/* Desktop Floating Toggle when sidebar is closed */}
            {!isMobile && !isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-brand-600 transition-colors"
                    title="Open Menu"
                >
                    <MdMenu size={24} />
                </button>
            )}

            {/* Backdrop for mobile sidebar */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside
                className={`fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none z-50 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:hidden'
                    }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            श
                        </div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-500 tracking-tight">
                            शिक्षक सहायक
                        </h2>
                    </div>
                    {isMobile ? (
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                            <MdClose size={24} />
                        </button>
                    ) : (
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 lg:block hidden">
                            <MdMenu size={24} />
                        </button>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => isMobile && setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium ${isActive
                                    ? 'bg-brand-50 text-brand-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={isActive ? 'text-brand-600' : 'text-gray-400'}>
                                        {item.icon}
                                    </div>
                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold text-lg shrink-0">
                            {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">बिहार बोर्ड शिक्षक</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="लॉग आउट"
                        >
                            <MdLogout size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                {isMobile && (
                    <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 shrink-0 z-30">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                <MdMenu size={24} />
                            </button>
                            <span className="font-semibold text-gray-800 text-lg">{currentPageName}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold text-sm">
                            {initial}
                        </div>
                    </header>
                )}

                {/* Desktop Header */}
                {!isMobile && (
                    <header className="h-16 bg-surface/80 backdrop-blur-md flex items-center px-8 shrink-0 z-30 sticky top-0">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{currentPageName}</h1>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-7xl mx-auto h-full"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
