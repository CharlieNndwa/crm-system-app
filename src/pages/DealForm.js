// src/pages/DealForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const DealForm = () => {
    const [formData, setFormData] = useState({
        deal_name: '',
        customer_id: '',
        stage: 'Prospecting',
        amount: '',
    });
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    const { deal_name, customer_id, stage, amount } = formData;

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/customers`, {
                    headers: { 'x-auth-token': token }
                });
                setCustomers(res.data);
            } catch (err) {
                console.error('Error fetching customers:', err.response.data);
            }
        };

        fetchCustomers();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/deals`,
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            alert('Deal added successfully!');
            navigate('/deals');
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to add deal. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>Add New Deal</h2>
            <form className="form-card" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Deal Name"
                        name="deal_name"
                        value={deal_name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="customer_id">Customer</label>
                    <select name="customer_id" value={customer_id} onChange={onChange} required>
                        <option value="">-- Select a Customer --</option>
                        {customers.map(customer => (
                            <option key={customer.customer_id} value={customer.customer_id}>
                                {customer.first_name} {customer.last_name} ({customer.company})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <select name="stage" value={stage} onChange={onChange}>
                        <option value="Prospecting">Prospecting</option>
                        <option value="Qualification">Qualification</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        placeholder="Amount"
                        name="amount"
                        value={amount}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Deal</button>
            </form>
        </motion.div>
    );
};

export default DealForm;