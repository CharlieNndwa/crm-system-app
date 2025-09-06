// src/pages/EmployeeForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        job_title: '',
        department: '',
        // Add new state fields
        phone: '',
        hire_date: '',
    });
    const navigate = useNavigate();

    const { first_name, last_name, email, job_title, department, phone, hire_date } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5001/api/employees',
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            alert('Employee added successfully!');
            navigate('/employees');
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to add employee. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>Add New Employee</h2>
            <form className="form-card" onSubmit={onSubmit}>
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
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                {/* Add new input fields here */}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Job Title"
                        name="job_title"
                        value={job_title}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Department"
                        name="department"
                        value={department}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        placeholder="Hire Date"
                        name="hire_date"
                        value={hire_date}
                        onChange={onChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Employee</button>
            </form>
        </motion.div>
    );
};

export default EmployeeForm;