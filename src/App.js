import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginAndRegisterPage from './components/LoginAndRegisterPage';
import Dashboard from './components/Dashboard';
import Rerouter from './components/Rerouter';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('fp2_user_jwt');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        // <div>HELLO WORLD</div>
            <Router>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Dashboard /> : <LoginAndRegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/:hash" element={<Rerouter />} />
                </Routes>
            </Router>
    );
}

export default App;