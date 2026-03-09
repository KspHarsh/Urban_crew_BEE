import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ title }) => {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard-header">
            <h1 className="dashboard-header-title">{title}</h1>

            <div className="dashboard-header-user">
                <div className="dashboard-header-user-info">
                    <p className="dashboard-header-user-name">
                        {currentUser?.displayName || currentUser?.email}
                    </p>
                    <p className="dashboard-header-user-email">
                        {currentUser?.email}
                    </p>
                </div>
                <div className="dashboard-header-avatar">
                    {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
};

export default Header;
