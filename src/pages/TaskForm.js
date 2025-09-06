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
                const [employeesRes, customersRes, dealsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/employees`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/customers`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/deals`, { headers: { 'x-auth-token': token } }),
                ]);
                setEmployees(employeesRes.data);
                setCustomers(customersRes.data);
                setDeals(dealsRes.data);

                if (id) {
                    const taskRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const taskData = taskRes.data;
                    setFormData({
                        task_name: taskData.task_name,
                        description: taskData.description,
                        due_date: taskData.due_date.split('T')[0],
                        status: taskData.status,
                        assigned_to: taskData.assigned_to,
                        customer_id: taskData.customer_id,
                        deal_id: taskData.deal_id,
                    });
                    setIsEditMode(true);
                }
            } catch (err) {
                console.error('Error fetching related data or task:', err);
                alert('Failed to load form data.');
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
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
                await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, formData, config);
                alert('Task updated successfully!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, formData, config);
                alert('Task added successfully!');
            }
            navigate('/tasks');
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p>Loading task details...</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
            <form className="form-card" onSubmit={onSubmit}>
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
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={onChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="assigned_to">Assigned To</label>
                    <select
                        id="assigned_to"
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={onChange}
                    >
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