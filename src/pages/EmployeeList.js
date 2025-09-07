// src/pages/EmployeeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md'; // MdEdit added here
import '../App.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setEmployees(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err.response.data);
                if (err.response && err.response.status === 401) {
                    setError('Session expired or token is invalid. Please log in again.');
                } else {
                    setError('Failed to fetch employees.');
                }
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/${employeeId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
                alert('Employee deleted successfully!');
            } catch (err) {
                console.error(err.response.data);
                alert('Failed to delete employee. Please try again.');
            }
        }
    };

    if (loading) return <p>Loading employees...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="content-container"
        >
            <div className="header-with-button">
                <h2>Employees</h2>
                <Link to="/employees/add" className="btn btn-customer">
                    <IoMdAdd />
                    Add Employee
                </Link>
            </div>
            <div className="list-grid">
                {employees.length > 0 ? (
                    employees.map((employee) => (
                        <div key={employee.employee_id} className="list-item">
                            <div className="list-item-header">
                                <h3>{employee.first_name} {employee.last_name}</h3>
                                <div className="task-actions">
                                    <Link to={`/employees/edit/${employee.employee_id}`} className="btn btn-edit">
                                        <MdEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(employee.employee_id)}
                                        className="btn btn-delete"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            <p><strong>Email:</strong> {employee.email}</p>
                            <p><strong>Job Title:</strong> {employee.job_title || 'Not Specified'}</p>
                            <p><strong>Department:</strong> {employee.department || 'Not Specified'}</p>
                            <p><strong>Phone:</strong> {employee.phone || 'Not Specified'}</p>
                            <p><strong>Hire Date:</strong> {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'Not Specified'}</p>
                        </div>
                    ))
                ) : (
                    <p>No employees found.</p>
                )}
            </div>
        </motion.div>
    );
};

export default EmployeeList;