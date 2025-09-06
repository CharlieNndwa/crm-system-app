// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import axios from 'axios';
import '../App.css';

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
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
            <div className="header-brand">
                <h1><Link to="/">CRM System</Link></h1>
            </div>
            <div className="header-right">
                {user ? (
                    <div className="user-info">
                        <span className="welcome-message">
                            Welcome back, {user.first_name} 👋
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout <FaSignOutAlt />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;