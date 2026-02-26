import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import News from './pages/News';
import Teach from './pages/Teach';
import Books from './pages/Books';
import Notice from './pages/Notice';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/chat" element={<Chatbot />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/teach" element={<Teach />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/notice" element={<Notice />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
