// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css'; 

const Signup = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const { first_name, last_name, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/register', formData);
            
            // Redirect to login page after successful signup
            navigate('/login');
            alert('Signup successful! You can now log in.');
        } catch (err) {
            console.error(err.response.data);
            alert('Signup failed. Please try again.');
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
                <h2>Sign Up</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            name="first_name"
                            value={first_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="last_name"
                            value={last_name}
                            onChange={onChange}
                            required
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </motion.div>
        </div>
    );
};

export default Signup;