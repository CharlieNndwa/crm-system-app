// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword'; // Import the new component
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import DealsList from './pages/DealsList';
import DealForm from './pages/DealForm';
import EmployeeList from './pages/EmployeeList'; 
import EmployeeForm from './pages/EmployeeForm'; 
import TaskList from './pages/TaskList'; 
import TaskForm from './pages/TaskForm'; 
import InventoryList from './pages/InventoryList';
import InventoryForm from './pages/InventoryForm';
import InvoiceList from './pages/InvoiceList'; // New Import
import InvoiceForm from './pages/InvoiceForm'; // New Import
import InvoiceDetails from './pages/InvoiceDetails'; // New Import
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add the new route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/add" element={<CustomerForm />} />
            <Route path="deals" element={<DealsList />} />
            <Route path="deals/add" element={<DealForm />} />
            <Route path="employees" element={<EmployeeList />} /> 
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/add" element={<TaskForm />} />
            <Route path="tasks/edit/:id" element={<TaskForm />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="inventory/add" element={<InventoryForm />} />
            <Route path="inventory/edit/:id" element={<InventoryForm />} />
            <Route path="invoices" element={<InvoiceList />} /> {/* New Invoices List route */}
            <Route path="invoices/add" element={<InvoiceForm />} /> {/* New Invoice Add route */}
            <Route path="invoices/edit/:id" element={<InvoiceForm />} /> {/* New Invoice Edit route */}
            <Route path="invoices/:id" element={<InvoiceDetails />} /> {/* New Invoice Details route */}
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;