// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        password2: '',
    });
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Gets the token from the URL
    const navigate = useNavigate();

    const { password, password2 } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.msg + ' Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
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
                <h2>Reset Password</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            name="password2"
                            value={password2}
                            onChange={onChange}
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

export default ResetPassword;