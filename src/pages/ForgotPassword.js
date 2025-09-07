// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
            setMessage(res.data.msg);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'An error occurred. Please try again.');
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
                <h2>Forgot Password</h2>
                <p>Enter your email address to receive a password reset link.</p>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>
                {message && <p className="status-message">{message}</p>}
                <p><Link to="/login">Back to Login</Link></p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;