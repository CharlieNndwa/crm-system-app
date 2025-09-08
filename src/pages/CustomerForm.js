// src/pages/CustomerForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCustomer = async () => {
            if (id) {
                setIsEditMode(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const customerData = res.data;
                    setFormData({
                        first_name: customerData.first_name,
                        last_name: customerData.last_name,
                        company: customerData.company,
                        email: customerData.email,
                        phone: customerData.phone,
                    });
                } catch (err) {
                    console.error('Error fetching customer:', err.response);
                    if (err.response && err.response.status === 401) {
                        alert('Session expired. Please log in again.');
                        navigate('/login');
                    } else {
                        alert('Failed to fetch customer details.');
                    }
                }
            }
        };
        fetchCustomer();
    }, [id, navigate]);

    const { first_name, last_name, company, email, phone } = formData;

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
                    `${process.env.REACT_APP_API_URL}/api/customers/${id}`,
                    formData,
                    { headers: { 'x-auth-token': token } }
                );
                alert('Customer updated successfully!');
            } else {
                // ADD NEW logic
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/customers`,
                    formData,
                    { headers: { 'x-auth-token': token } }
                );
                alert('Customer added successfully!');
            }
            navigate('/customers');
        } catch (err) {
            console.error(err.response.data);
            alert(`Failed to ${isEditMode ? 'update' : 'add'} customer. Please try again.`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
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
                        type="text"
                        placeholder="Company"
                        name="company"
                        value={company}
                        onChange={onChange}
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
                        type="tel"
                        placeholder="Phone"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update Customer' : 'Add Customer'}
                </button>
            </form>
        </motion.div>
    );
};

export default CustomerForm;