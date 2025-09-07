import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserFriends, FaHandshake, FaUserTie, FaBox, FaFileInvoiceDollar, FaTasks } from 'react-icons/fa';
import '../App.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
                    headers: { 'x-auth-token': token },
                });
                setDashboardData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err.response?.data);
                setError('Failed to fetch dashboard data. Please try again.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': return { backgroundColor: '#2ecc71', color: 'white' };
            case 'Overdue': return { backgroundColor: '#e74c3c', color: 'white' };
            case 'In Progress': return { backgroundColor: '#f39c12', color: 'white' };
            case 'Closed Won': return { backgroundColor: '#27ae60', color: 'white' };
            case 'Closed Lost': return { backgroundColor: '#c0392b', color: 'white' };
            case 'To Do': return { backgroundColor: '#3498db', color: 'white' };
            case 'Done': return { backgroundColor: '#1abc9c', color: 'white' };
            default: return { backgroundColor: '#bdc3c7', color: 'white' };
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container dashboard"
        >
            <div className="dashboard-header">
                <h2>CRM Dashboard</h2>
                <p>Welcome to your CRM at a glance.</p>
            </div>

            <div className="dashboard-grid">
                {/* Widget 1: Total Customers */}
                <Link to="/customers" className="widget-link">
                    <div className="widget summary-card">
                        <FaUserFriends className="icon" style={{ color: '#2980b9' }} />
                        <p className="summary-title">Total Customers</p>
                        <h3 className="summary-value">{dashboardData.customersCount}</h3>
                    </div>
                </Link>

                {/* Widget 2: Total Deals */}
                <Link to="/deals" className="widget-link">
                    <div className="widget summary-card">
                        <FaHandshake className="icon" style={{ color: '#27ae60' }} />
                        <p className="summary-title">Total Deals</p>
                        <h3 className="summary-value">{dashboardData.dealsCount}</h3>
                    </div>
                </Link>

                {/* Widget 3: Total Employees */}
                <Link to="/employees" className="widget-link">
                    <div className="widget summary-card">
                        <FaUserTie className="icon" style={{ color: '#8e44ad' }} />
                        <p className="summary-title">Total Employees</p>
                        <h3 className="summary-value">{dashboardData.employeesCount}</h3>
                    </div>
                </Link>

                {/* Widget 4: Inventory Alert */}
                <Link to="/inventory" className="widget-link">
                    <div className="widget summary-card alert-card">
                        <FaBox className="icon" style={{ color: '#f1c40f' }} />
                        <p className="summary-title">Low Stock Items</p>
                        <h3 className="summary-value">{dashboardData.lowStockCount}</h3>
                    </div>
                </Link>

                {/* Widget 5: Deals by Stage */}
                <div className="widget chart-widget">
                    <h4><FaHandshake /> Deals by Stage</h4>
                    <ul className="list-group">
                        {dashboardData.dealsByStage.map((item, index) => (
                            <li key={index}>
                                <span>{item.stage}</span>
                                <span className="list-count" style={getStatusStyle(item.stage)}>{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Widget 6: Invoices by Status */}
                <div className="widget chart-widget">
                    <h4><FaFileInvoiceDollar /> Invoices by Status</h4>
                    <ul className="list-group">
                        {dashboardData.invoicesByStatus.map((item, index) => (
                            <li key={index}>
                                <span>{item.status}</span>
                                <span className="list-count" style={getStatusStyle(item.status)}>{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Widget 7: Recent Tasks */}
                <div className="widget recent-tasks-widget">
                    <h4><FaTasks /> Recent Tasks</h4>
                    <ul className="list-group">
                        {dashboardData.recentTasks.map((task) => (
                            <li key={task.task_id} className="task-item">
                                <Link to={`/tasks/edit/${task.task_id}`} className="task-title-link">
                                    {task.task_name}
                                </Link>
                                <span className="task-status" style={getStatusStyle(task.status)}>
                                    {task.status}
                                </span>
                                <p className="task-due-date">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;