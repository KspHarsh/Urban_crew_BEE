import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                <Header title={title} />
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
