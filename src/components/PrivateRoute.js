// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    
    // If authenticated, render the children components (e.g., Layout)
    if (isAuthenticated) {
        return children;
    }
    
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
};

export default PrivateRoute;