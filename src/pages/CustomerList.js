// src/pages/CustomerList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import '../App.css';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/customers`, {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setCustomers(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err.response.data);
                if (err.response && err.response.status === 401) {
                    setError('Session expired or token is invalid. Please log in again.');
                } else {
                    setError('Failed to fetch customers.');
                }
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleDelete = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/customers/${customerId}`, {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setCustomers(customers.filter((customer) => customer.customer_id !== customerId));
                alert('Customer deleted successfully!');
            } catch (err) {
                console.error(err.response.data);
                alert('Failed to delete customer. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Customers</h2>
                <Link to="/customers/add" className="btn btn-customer">
                    <IoMdAdd />
                    Add New Customer
                </Link>
            </div>
            <div className="list-grid">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <div key={customer.customer_id} className="list-item">
                            <div className="list-item-header">
                                <h3>{customer.first_name} {customer.last_name}</h3>
                                <div className="task-actions">
                                    <Link to={`/customers/edit/${customer.customer_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer.customer_id)}
                                        className="btn btn-delete"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Company:</strong> {customer.company || 'Not Specified'}</p>
                            <p><strong>Email:</strong> {customer.email || 'Not Specified'}</p>
                            <p><strong>Phone:</strong> {customer.phone || 'Not Specified'}</p>
                        </div>
                    ))
                ) : (
                    <p>No customers found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default CustomerList;