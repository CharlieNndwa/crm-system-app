// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`layout-main-content ${isSidebarOpen ? 'shift' : ''}`}>
                <Header toggleSidebar={toggleSidebar} />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;