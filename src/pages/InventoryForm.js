// src/pages/InventoryForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const InventoryForm = () => {
    const [formData, setFormData] = useState({
        item_name: '',
        description: '',
        stock_quantity: '',
        unit_price: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            if (id) {
                setIsEditMode(true);
                setLoading(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const itemData = res.data;
                    setFormData({
                        item_name: itemData.item_name,
                        description: itemData.description,
                        stock_quantity: itemData.stock_quantity,
                        unit_price: itemData.unit_price,
                    });
                    setLoading(false);
                } catch (err) {
                    console.error('Failed to fetch item details:', err);
                    setLoading(false);
                    alert('Failed to fetch item details.');
                }
            }
        };

        fetchItem();
    }, [id]);

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
                await axios.put(`${process.env.REACT_APP_API_URL}/api/inventory/${id}`, formData, config);
                alert('Inventory item updated successfully!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/inventory`, formData, config);
                alert('Inventory item added successfully!');
            }
            navigate('/inventory');
        } catch (err) {
            console.error('Failed to save inventory item:', err.response.data);
            alert('Failed to save inventory item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p>Loading item details...</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
            <form className="form-card" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="item_name">Item Name</label>
                    <input
                        type="text"
                        id="item_name"
                        name="item_name"
                        value={formData.item_name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock_quantity">Stock Quantity</label>
                    <input
                        type="number"
                        id="stock_quantity"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unit_price">Unit Price</label>
                    <input
                        type="number"
                        id="unit_price"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={onChange}
                        step="0.01"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {isEditMode ? 'Update Item' : 'Add Item'}
                </button>
            </form>
        </motion.div>
    );
};

export default InventoryForm;