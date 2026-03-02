import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import News from './pages/News';
import Teach from './pages/Teach';
import Books from './pages/Books';
import Notice from './pages/Notice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Features from './pages/Features';
import Holidays from './pages/Holidays';
import BaglessSaturday from "./pages/BaglessSaturday";
import Ptm from "./pages/Ptm";
import AITeacherBook from "./pages/AITeacherBook";

// Protected Route Wrapper
function ProtectedRoute({ children }) {
    const user = localStorage.getItem('shikshak_user');
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Layout>{children}</Layout>;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected App Routes wrapped in Layout */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
                <Route path="/teach" element={<ProtectedRoute><Teach /></ProtectedRoute>} />
                <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
                <Route path="/notice" element={<ProtectedRoute><Notice /></ProtectedRoute>} />
                <Route
                    path="/features"
                    element={
                        <ProtectedRoute>
                            <Features />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/holidays"
                    element={
                        <ProtectedRoute>
                            <Holidays />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bagless-saturday"
                    element={
                        <ProtectedRoute>
                            <BaglessSaturday />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ptm"
                    element={
                        <ProtectedRoute>
                            <Ptm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ai-teacher-book"
                    element={
                        <ProtectedRoute>
                            <AITeacherBook />
                        </ProtectedRoute>
                    }
                />
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
