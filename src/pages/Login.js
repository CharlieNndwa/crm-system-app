// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css'; // Assuming you will add styles to this file

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);

            localStorage.setItem('token', res.data.token);

            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                className="form-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2>Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="forgot-password-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </p>
                    <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;