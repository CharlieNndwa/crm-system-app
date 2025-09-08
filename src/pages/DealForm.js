// src/pages/DealForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Session expired. Please log in again.');
                return navigate('/login');
            }

            try {
                // Fetch customers for the dropdown
                const customerRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
                    headers: { 'x-auth-token': token }
                });
                setCustomers(customerRes.data);

                // If in edit mode, fetch the specific deal
                if (id) {
                    setIsEditMode(true);
                    const dealRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/deals/${id}`, {
                        headers: { 'x-auth-token': token }
                    });
                    const dealData = dealRes.data;
                    setFormData({
                        deal_name: dealData.deal_name,
                        customer_id: dealData.customer_id,
                        stage: dealData.stage,
                        amount: dealData.amount,
                    });
                }
            } catch (err) {
                console.error('Error fetching data:', err.response);
                if (err.response && err.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    alert('Failed to fetch data.');
                }
            }
        };

        fetchData();
    }, [id, navigate]);

    const { deal_name, customer_id, stage, amount } = formData;

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
                    `${process.env.REACT_APP_API_URL}/api/deals/${id}`,
                    formData,
                    { headers: { 'x-auth-token': token } }
                );
                alert('Deal updated successfully!');
            } else {
                // ADD NEW logic
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/deals`,
                    formData,
                    { headers: { 'x-auth-token': token } }
                );
                alert('Deal added successfully!');
            }
            navigate('/deals');
        } catch (err) {
            console.error(err.response.data);
            alert(`Failed to ${isEditMode ? 'update' : 'add'} deal. Please try again.`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Deal' : 'Add New Deal'}</h2>
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
                    <label htmlFor="stage">Stage</label>
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
                <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update Deal' : 'Add Deal'}
                </button>
            </form>
        </motion.div>
    );
};

export default DealForm;