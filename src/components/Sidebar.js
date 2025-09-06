// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import '../App.css';

const navVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.2,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <motion.aside
            className={`sidebar ${isOpen ? 'open' : ''}`}
            initial="hidden"
            animate="visible"
            variants={navVariants}
        >
            <div className="sidebar-header">
                <h2>CRM System</h2>
                <div className="mobile-close-btn" onClick={toggleSidebar}>
                    <FaTimes />
                </div>
            </div>
            <nav className="sidebar-nav">
                <motion.ul variants={navVariants}>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/" className="sidebar-link">Dashboard</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/customers" className="sidebar-link">Customers</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/deals" className="sidebar-link">Deals</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/employees" className="sidebar-link">Employees</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/tasks" className="sidebar-link">Tasks</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/inventory" className="sidebar-link">Inventory</Link>
                    </motion.li>
                    <motion.li variants={itemVariants} onClick={toggleSidebar}>
                        <Link to="/invoices" className="sidebar-link">Invoices</Link>
                    </motion.li>
                </motion.ul>
            </nav>
        </motion.aside>
    );
};

export default Sidebar;