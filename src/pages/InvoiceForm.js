// src/pages/InvoiceForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        customer_id: '',
        deal_id: '',
        invoice_number: '',
        issue_date: '',
        due_date: '',
        amount_due: '',
        status: 'Pending',
    });
    const [customers, setCustomers] = useState([]);
    const [deals, setDeals] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchRelatedData = async () => {
            try {
                const [customersRes, dealsRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/deals`, { headers: { 'x-auth-token': token } }),
                ]);
                setCustomers(customersRes.data);
                setDeals(dealsRes.data);

                if (id) {
                    setIsEditMode(true);
                    setLoading(true);
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const invoiceData = res.data;
                    setFormData({
                        customer_id: invoiceData.customer_id,
                        deal_id: invoiceData.deal_id,
                        invoice_number: invoiceData.invoice_number,
                        issue_date: invoiceData.issue_date.split('T')[0],
                        due_date: invoiceData.due_date.split('T')[0],
                        amount_due: invoiceData.amount_due,
                        status: invoiceData.status,
                    });
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch related data or invoice:', err);
                setLoading(false);
                alert('Failed to load form data.');
            }
        };

        fetchRelatedData();
    }, [id, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
            headers: { 'x-auth-token': token },
        };

        try {
            if (isEditMode) {
                const updateData = {
                    status: formData.status,
                    amount_due: formData.amount_due,
                };
                await axios.put(`${process.env.REACT_APP_API_URL}/api/invoices/${id}`, updateData, config);
                alert('Invoice updated successfully!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/invoices`, formData, config);
                alert('Invoice created successfully!');
            }
            navigate('/invoices');
        } catch (err) {
            console.error('Failed to save invoice:', err.response?.data);
            alert('Failed to save invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p>Loading invoice details...</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Invoice' : 'Create New Invoice'}</h2>
            <form className="form-card" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="customer_id">Customer</label>
                    <select
                        id="customer_id"
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={onChange}
                        required
                        disabled={isEditMode}
                    >
                        <option value="">-- Select a Customer --</option>
                        {customers.map((customer) => (
                            <option key={customer.customer_id} value={customer.customer_id}>
                                {customer.first_name} {customer.last_name} ({customer.company})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="deal_id">Deal</label>
                    <select
                        id="deal_id"
                        name="deal_id"
                        value={formData.deal_id}
                        onChange={onChange}
                        disabled={isEditMode}
                    >
                        <option value="">-- Select a Deal (Optional) --</option>
                        {deals.map((deal) => (
                            <option key={deal.deal_id} value={deal.deal_id}>
                                {deal.deal_name} - R{deal.amount}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="invoice_number">Invoice Number</label>
                    <input
                        type="text"
                        id="invoice_number"
                        name="invoice_number"
                        value={formData.invoice_number}
                        onChange={onChange}
                        readOnly={isEditMode}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="issue_date">Issue Date</label>
                    <input
                        type="date"
                        id="issue_date"
                        name="issue_date"
                        value={formData.issue_date}
                        onChange={onChange}
                        readOnly={isEditMode}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="due_date">Due Date</label>
                    <input
                        type="date"
                        id="due_date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={onChange}
                        readOnly={isEditMode}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount_due">Amount Due</label>
                    <input
                        type="number"
                        id="amount_due"
                        name="amount_due"
                        value={formData.amount_due}
                        onChange={onChange}
                        step="0.01"
                        required
                    />
                </div>
                {isEditMode && (
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {isEditMode ? 'Update Invoice' : 'Create Invoice'}
                </button>
            </form>
        </motion.div>
    );
};

export default InvoiceForm;