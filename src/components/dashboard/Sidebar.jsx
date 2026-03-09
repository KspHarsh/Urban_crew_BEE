import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';

const Sidebar = () => {
    const location = window.location;
    const navigate = useNavigate();
    const { userRole, logout } = useAuth();

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const adminMenu = [
        { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { path: '/admin/requests', icon: 'fa-clipboard-list', label: 'Requests' },
        { path: '/admin/workers', icon: 'fa-users', label: 'Workers' },
        { path: '/admin/clients', icon: 'fa-building', label: 'Clients' },
        { path: '/admin/reports', icon: 'fa-chart-bar', label: 'Reports' },
        { path: '/admin/settings', icon: 'fa-gear', label: 'Settings' }
    ];

    const clientMenu = [
        { path: '/client/dashboard', icon: 'fa-house', label: 'Dashboard' },
        { path: '/client/create-request', icon: 'fa-plus-circle', label: 'New Request' },
        { path: '/client/requests', icon: 'fa-list', label: 'My Requests' },
        { path: '/client/replacement', icon: 'fa-rotate', label: 'Replacements' },
        { path: '/client/profile', icon: 'fa-user', label: 'Profile' }
    ];

    const workerMenu = [
        { path: '/worker/dashboard', icon: 'fa-briefcase', label: 'Dashboard' },
        { path: '/worker/availability', icon: 'fa-calendar-check', label: 'Availability' },
        { path: '/worker/history', icon: 'fa-clock-rotate-left', label: 'Job History' },
        { path: '/worker/salary', icon: 'fa-indian-rupee-sign', label: 'Salary' },
        { path: '/worker/profile', icon: 'fa-user', label: 'Profile' }
    ];

    const getMenu = () => {
        if (userRole === ROLES.ADMIN) return adminMenu;
        if (userRole === ROLES.CLIENT) return clientMenu;
        if (userRole === ROLES.WORKER) return workerMenu;
        return [];
    };

    return (
        <div className="dashboard-sidebar">
            {/* Logo */}
            <div className="dashboard-sidebar-header">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="dashboard-sidebar-logo">
                        <div className="dashboard-sidebar-logo-mark">UC</div>
                        <div>
                            <div>UrbanCrew</div>
                            <div className="dashboard-sidebar-role">{userRole} Portal</div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="dashboard-sidebar-nav">
                {getMenu().map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`dashboard-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <i className={`fa-solid ${item.icon}`}></i>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="dashboard-sidebar-footer">
                <button onClick={handleLogout} className="dashboard-logout-btn">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
