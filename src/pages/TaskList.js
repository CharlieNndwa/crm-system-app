// src/pages/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import '../App.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                // Fetch both tasks and employees
                const [tasksRes, employeesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/employees`, { headers: { 'x-auth-token': token } })
                ]);

                // Map employee IDs to names for easy lookup
                const employeeMap = employeesRes.data.reduce((acc, emp) => {
                    acc[emp.employee_id] = `${emp.first_name} ${emp.last_name}`;
                    return acc;
                }, {});

                setTasks(tasksRes.data);
                setEmployees(employeeMap);
                setLoading(false);

            } catch (err) {
                console.error(err.response.data);
                if (err.response && err.response.status === 401) {
                    setError('Session expired or token is invalid. Please log in again.');
                } else {
                    setError('Failed to fetch tasks.');
                }
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
                    headers: { 'x-auth-token': token }
                });
                setTasks(tasks.filter(task => task.task_id !== taskId));
                alert('Task deleted successfully!');
            } catch (err) {
                console.error(err.response.data);
                alert('Failed to delete task. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Tasks</h2>
                <Link to="/tasks/add" className="btn btn-customer">
                    <IoMdAdd />
                    Add New Task
                </Link>
            </div>
            <div className="list-grid">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.task_id} className="list-item">
                            <div className="list-item-header">
                                <h3>{task.task_name}</h3>
                                <div className="task-actions">
                                    <Link to={`/tasks/edit/${task.task_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button onClick={() => handleDelete(task.task_id)} className="btn btn-delete">
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Status:</strong> {task.status || 'Not Specified'}</p>
                            <p><strong>Assigned To:</strong> {employees[task.assigned_to] || 'Not Assigned'}</p>
                            <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not Specified'}</p>
                            <p><strong>Description:</strong> {task.description || 'N/A'}</p>
                        </div>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default TaskList;