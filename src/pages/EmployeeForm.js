// src/pages/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
        phone: '',
        hire_date: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL

    // This effect runs once when the component loads to fetch employee data if an ID exists
    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                setIsEditMode(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const employeeData = res.data;
                    setFormData({
                        first_name: employeeData.first_name,
                        last_name: employeeData.last_name,
                        email: employeeData.email,
                        job_title: employeeData.job_title,
                        department: employeeData.department,
                        phone: employeeData.phone,
                        hire_date: employeeData.hire_date ? employeeData.hire_date.split('T')[0] : '',
                    });
                } catch (err) {
                    console.error('Error fetching employee:', err.response);
                    // Handle unauthorized access or other errors
                    if (err.response && err.response.status === 401) {
                        alert('Session expired. Please log in again.');
                        navigate('/login');
                    } else {
                        alert('Failed to fetch employee details.');
                    }
                }
            }
        };
        fetchEmployee();
    }, [id, navigate]); // Rerun the effect when the ID or navigate function changes

    const { first_name, last_name, email, job_title, department, phone, hire_date } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditMode) {
                // UPDATE logic
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/employees/${id}`,
                    formData,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                alert('Employee updated successfully!');
            } else {
                // ADD NEW logic
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/employees`,
                    formData,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                alert('Employee added successfully!');
            }
            navigate('/employees');
        } catch (err) {
            console.error(err.response.data);
            alert(`Failed to ${isEditMode ? 'update' : 'add'} employee. Please try again.`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
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
                <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update Employee' : 'Add Employee'}
                </button>
            </form>
        </motion.div>
    );
};

export default EmployeeForm;