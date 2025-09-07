// src/pages/DealsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import '../App.css';

const DealsList = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/deals`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDeals(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err.response?.data);
                if (err.response && err.response.status === 401) {
                    setError('Session expired or token is invalid. Please log in again.');
                } else {
                    setError('Failed to fetch deals.');
                }
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleDelete = async (dealId) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/deals/${dealId}`, {
                    headers: { 'x-auth-token': token },
                });
                setDeals(deals.filter((deal) => deal.deal_id !== dealId));
                alert('Deal deleted successfully!');
            } catch (err) {
                console.error('Error deleting deal:', err.response?.data);
                alert('Failed to delete deal. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading deals...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Deals</h2>
                <Link to="/deals/add" className="btn btn-customer">
                    <IoMdAdd />
                    Add New Deal
                </Link>
            </div>
            <div className="list-grid">
                {deals.length > 0 ? (
                    deals.map((deal) => (
                        <div key={deal.deal_id} className="list-item">
                            <div className="list-item-header">
                                <h3>{deal.deal_name}</h3>
                                <div className="task-actions">
                                    <Link to={`/deals/edit/${deal.deal_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(deal.deal_id)}
                                        className="btn btn-delete"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Customer:</strong> {deal.customer_id}</p>
                            <p><strong>Stage:</strong> {deal.stage}</p>
                            <p><strong>Amount:</strong> R{deal.amount}</p>
                        </div>
                    ))
                ) : (
                    <p>No deals found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default DealsList;