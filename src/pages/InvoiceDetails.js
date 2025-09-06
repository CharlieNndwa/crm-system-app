// src/pages/InvoiceDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import '../App.css';

const InvoiceDetails = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentFormData, setPaymentFormData] = useState({
        payment_date: new Date().toISOString().split('T')[0],
        amount_paid: '',
        payment_method: '',
        transaction_id: '',
    });

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetches the invoice and payments and checks its status
    const fetchInvoiceData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        try {
            const [invoiceRes, paymentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/payments/invoice/${id}`, config),
            ]);

            setInvoice(invoiceRes.data);
            setPayments(paymentsRes.data);
            setLoading(false);

            // Check and update invoice status
            const totalPaid = paymentsRes.data.reduce((sum, payment) => sum + parseFloat(payment.amount_paid), 0);
            const amountDue = parseFloat(invoiceRes.data.amount_due);

            if (totalPaid >= amountDue && invoiceRes.data.status !== 'Paid') {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/invoices/${id}`,
                    { status: 'Paid', amount_due: 0 },
                    config
                );
                // Re-fetch to show the updated status
                const updatedInvoiceRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, config);
                setInvoice(updatedInvoiceRes.data);
            }

        } catch (err) {
            console.error('Error fetching invoice data:', err);
            setError('Failed to fetch invoice details.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoiceData();
    }, [id]);

    const onPaymentChange = (e) => {
        setPaymentFormData({ ...paymentFormData, [e.target.name]: e.target.value });
    };

    const onPaymentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payments`,
                { ...paymentFormData, invoice_id: id },
                config
            );
            alert('Payment added successfully!');

            // --- NEW LINE: Redirect to the invoices list page after success
            navigate('/invoices');
            // --- END NEW LINE

        } catch (err) {
            console.error('Error adding payment:', err.response?.data);
            alert('Failed to add payment. Please try again.');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!invoice) return <div className="content-container">Invoice not found.</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="list-header">
                <Link to="/invoices" className="btn btn-back">
                    <FaArrowLeft /> Back to Invoices
                </Link>
            </div>
            <div className="invoice-details-card">
                <h3>Invoice #{invoice.invoice_number}</h3>
                <p><strong>Status:</strong> {invoice.status}</p>
                <p><strong>Amount Due:</strong> R{invoice.amount_due}</p>
                <p><strong>Issue Date:</strong> {new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                <p><strong>Customer ID:</strong> {invoice.customer_id}</p>
                <p><strong>Deal ID:</strong> {invoice.deal_id}</p>
            </div>

            <div className="payments-section">
                <h4>Payments Received</h4>
                {payments.length > 0 ? (
                    <div className="payments-list">
                        {payments.map((payment, index) => (
                            <div key={index} className="payment-item">
                                <p><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
                                <p><strong>Amount:</strong> R{payment.amount_paid}</p>
                                <p><strong>Method:</strong> {payment.payment_method}</p>
                                {payment.transaction_id && <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No payments have been recorded for this invoice.</p>
                )}

                <div className="payment-form-card">
                    <h4>Record a New Payment</h4>
                    <form onSubmit={onPaymentSubmit}>
                        <div className="form-group">
                            <label htmlFor="payment_date">Payment Date</label>
                            <input
                                type="date"
                                name="payment_date"
                                value={paymentFormData.payment_date}
                                onChange={onPaymentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount_paid">Amount Paid</label>
                            <input
                                type="number"
                                name="amount_paid"
                                value={paymentFormData.amount_paid}
                                onChange={onPaymentChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="payment_method">Payment Method</label>
                            <input
                                type="text"
                                name="payment_method"
                                value={paymentFormData.payment_method}
                                onChange={onPaymentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="transaction_id">Transaction ID (Optional)</label>
                            <input
                                type="text"
                                name="transaction_id"
                                value={paymentFormData.transaction_id}
                                onChange={onPaymentChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <FaMoneyBillWave /> Add Payment
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default InvoiceDetails;