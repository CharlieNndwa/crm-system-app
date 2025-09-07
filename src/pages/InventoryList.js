// src/pages/InventoryList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import '../App.css';

const InventoryList = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`, {
                    headers: { 'x-auth-token': token },
                });
                setInventoryItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching inventory:', err.response.data);
                if (err.response && err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError('Failed to fetch inventory items.');
                }
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/inventory/${itemId}`, {
                    headers: { 'x-auth-token': token },
                });
                setInventoryItems(inventoryItems.filter((item) => item.item_id !== itemId));
                alert('Inventory item deleted successfully!');
            } catch (err) {
                console.error('Error deleting inventory item:', err.response.data);
                alert('Failed to delete item. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading inventory...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Inventory</h2>
                <Link to="/inventory/add" className="btn btn-customer">
                    <IoMdAdd />
                    Add New Item
                </Link>
            </div>

            <div className="list-grid">
                {inventoryItems.length > 0 ? (
                    inventoryItems.map((item) => (
                        <div key={item.item_id} className="list-item">
                            <div className="list-item-header">
                                <h3>{item.item_name}</h3>
                                <div className="task-actions">
                                    <Link to={`/inventory/edit/${item.item_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button onClick={() => handleDelete(item.item_id)} className="btn btn-delete">
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Stock Quantity:</strong> {item.stock_quantity}</p>
                            <p><strong>Unit Price:</strong> R{item.unit_price}</p>
                            <p><strong>Description:</strong> {item.description || 'N/A'}</p>
                        </div>
                    ))
                ) : (
                    <p>No inventory items found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default InventoryList;