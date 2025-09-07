import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const { first_name, last_name, company, email, phone } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/customers`,
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            const newCustomerId = res.data.customer.customer_id;
            console.log('New customer created with ID:', newCustomerId);

            alert('Customer added successfully!');
            navigate(`/customers/${newCustomerId}`);
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to add customer. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>Add New Customer</h2>
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
                <button type="submit" className="btn btn-primary">Add Customer</button>
            </form>
        </motion.div>
    );
};

export default CustomerForm;