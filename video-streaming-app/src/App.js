import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import VideoList from './components/ListingPage'; // Assuming VideoList is the correct component
import UploadFile from "./components/UploadFile";
const RouteGuard = ({ children, token }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return children || null;
};

const App = () => {
    const [token, setToken] = useState(null);

    const handleLogin = (token) => {
        setToken(token);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route
                    path="/videos"
                    element={
                        <RouteGuard token={token}>
                            <VideoList token={token} />
                        </RouteGuard>
                    }
                />
                <Route
                    path="*"
                    element={token ? <Navigate to="/videos" replace /> : <Navigate to="/login" replace />}
                />
                <Route path="/upload" element={<UploadFile token={token} />} />
            </Routes>
        </Router>
    );
};

export default App;
