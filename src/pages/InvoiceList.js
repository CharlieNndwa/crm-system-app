// src/pages/InvoiceList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa'; // New Import
import '../App.css';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5001/api/invoices', {
                    headers: { 'x-auth-token': token },
                });
                setInvoices(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching invoices:', err.response?.data);
                if (err.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError('Failed to fetch invoices.');
                }
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleDelete = async (invoiceId) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://localhost:5001/api/invoices/${invoiceId}`, {
                    headers: { 'x-auth-token': token },
                });
                setInvoices(invoices.filter((invoice) => invoice.invoice_id !== invoiceId));
                alert('Invoice deleted successfully!');
            } catch (err) {
                console.error('Error deleting invoice:', err.response?.data);
                alert('Failed to delete invoice. Please try again.');
            }
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Paid':
                return 'status-paid';
            case 'Overdue':
                return 'status-overdue';
            default:
                return 'status-pending';
        }
    };

    if (loading) return <p>Loading invoices...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Invoices</h2>
                <Link to="/invoices/add" className="btn btn-customer">
                    <IoMdAdd />
                    Create New Invoice
                </Link>
            </div>

            <div className="list-grid">
                {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                        <div key={invoice.invoice_id} className="list-item">
                            <div className="list-item-header">
                                <h3>Invoice #{invoice.invoice_number}</h3>
                                <div className="task-actions">
                                    <Link to={`/invoices/edit/${invoice.invoice_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button onClick={() => handleDelete(invoice.invoice_id)} className="btn btn-delete">
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Amount Due:</strong> R{invoice.amount_due}</p>
                            <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                            <span className={`status-badge ${getStatusClass(invoice.status)}`}>{invoice.status || 'Pending'}</span>
                            <div className="list-details">
                                <p><strong>Customer:</strong> {invoice.customer_id}</p>
                                <p><strong>Deal ID:</strong> {invoice.deal_id}</p>
                            </div>
                            <Link to={`/invoices/${invoice.invoice_id}`} className="btn btn-customer" style={{ marginTop: '15px' }}>
                                <FaEye /> View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No invoices found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default InvoiceList;