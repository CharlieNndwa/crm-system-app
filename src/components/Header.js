// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import axios from 'axios';
import '../App.css';
import crmLogo from '../assets/crm_logo.png'; // Import your logo image

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
                        headers: { 'x-auth-token': token },
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="main-header">
            {/* Mobile menu toggle button */}
            <div className="mobile-menu-toggle" onClick={toggleSidebar}>
                <FaBars />
            </div>
            <div className="header-brand logo-container">
                <Link to="/" className="logo-link">
                    <img src={crmLogo} alt="CRM Logo" className="header-logo" />
                    <h1>CRM SYSTEM</h1>
                </Link>
            </div>
            <div className="header-right">
                {user ? (
                    <div className="user-info">
                        <span className="welcome-message">
                            Welcome back, {user.username} 👋
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout <FaSignOutAlt />
                        </button>
                    </div>
                ) : null}
            </div>
        </header>
    );
};

export default Header;