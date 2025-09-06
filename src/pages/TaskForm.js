// src/pages/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        task_name: '',
        description: '',
        due_date: '',
        status: 'Pending',
        assigned_to: '',
        customer_id: '',
        deal_id: '',
    });
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]); // New state for customers
    const [deals, setDeals] = useState([]);       // New state for deals
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
                // Fetch employees, customers, and deals concurrently
                const [employeesRes, customersRes, dealsRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/employees', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5001/api/customers', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5001/api/deals', { headers: { 'x-auth-token': token } }),
                ]);
                setEmployees(employeesRes.data);
                setCustomers(customersRes.data);
                setDeals(dealsRes.data);
            } catch (err) {
                console.error('Error fetching related data:', err.response?.data);
            }
        };

        const fetchTask = async () => {
            if (id) {
                setIsEditMode(true);
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:5001/api/tasks/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    setFormData(res.data);
                } catch (err) {
                    console.error('Error fetching task:', err.response?.data);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRelatedData();
        fetchTask();
    }, [id, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5001/api/tasks/${id}`, formData, {
                    headers: { 'x-auth-token': token },
                });
                alert('Task updated successfully!');
            } else {
                await axios.post('http://localhost:5001/api/tasks', formData, {
                    headers: { 'x-auth-token': token },
                });
                alert('Task added successfully!');
            }
            navigate('/tasks');
        } catch (err) {
            console.error(err.response?.data);
            alert('Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={onSubmit} className="form-card">
                <div className="form-group">
                    <label htmlFor="task_name">Task Name</label>
                    <input
                        type="text"
                        id="task_name"
                        name="task_name"
                        value={formData.task_name}
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
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="due_date">Due Date</label>
                    <input
                        type="date"
                        id="due_date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={onChange}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="assigned_to">Assigned To</label>
                    <select id="assigned_to" name="assigned_to" value={formData.assigned_to} onChange={onChange} required>
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                            <option key={employee.employee_id} value={employee.employee_id}>
                                {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="customer_id">Customer</label>
                    <select id="customer_id" name="customer_id" value={formData.customer_id} onChange={onChange}>
                        <option value="">-- Select a Customer (Optional) --</option>
                        {customers.map((customer) => (
                            <option key={customer.customer_id} value={customer.customer_id}>
                                {customer.first_name} {customer.last_name} ({customer.company})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="deal_id">Deal</label>
                    <select id="deal_id" name="deal_id" value={formData.deal_id} onChange={onChange}>
                        <option value="">-- Select a Deal (Optional) --</option>
                        {deals.map((deal) => (
                            <option key={deal.deal_id} value={deal.deal_id}>
                                {deal.deal_name} - R{deal.amount}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {isEditMode ? 'Update Task' : 'Add Task'}
                </button>
            </form>
        </motion.div>
    );
};

export default TaskForm;