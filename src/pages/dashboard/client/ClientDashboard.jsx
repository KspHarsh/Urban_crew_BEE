import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatsCard from '../../../components/dashboard/StatsCard';
import StatusBadge from '../../../components/common/StatusBadge';

const ClientDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        activeStaff: 0,
        pendingRequests: 0,
        totalRequests: 0
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientData();
    }, [currentUser]);

    const fetchClientData = async () => {
        try {
            const response = await api.get('/client/dashboard');
            if (response.data.success) {
                setStats(response.data.stats);
                setRequests(response.data.requests || []);
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Client Dashboard">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Client Dashboard">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                    Welcome back! 👋
                </h2>
                <p style={{ color: '#6b7280', fontSize: '15px' }}>
                    Here's an overview of your staffing requests
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <StatsCard
                    icon="fa-users"
                    label="Active Staff"
                    value={stats.activeStaff}
                    color="#10b981"
                />
                <StatsCard
                    icon="fa-clock"
                    label="Pending Requests"
                    value={stats.pendingRequests}
                    color="#f59e0b"
                />
                <StatsCard
                    icon="fa-clipboard-list"
                    label="Total Requests"
                    value={stats.totalRequests}
                    color="#3b82f6"
                />
            </div>

            {/* Quick Actions */}
            <div style={{
                background: '#482300',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '32px'
            }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="/client/create-request" className="btn" style={{ textDecoration: 'none' }}>
                        <i className="fa-solid fa-plus-circle"></i> Create New Request
                    </a>
                    <a href="/client/requests" className="btn secondary" style={{ textDecoration: 'none' }}>
                        <i className="fa-solid fa-list"></i> View All Requests
                    </a>
                </div>
            </div>

            {/* Recent Requests */}
            <div style={{
                background: '#482300',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>Recent Requests</h3>
                {requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                        <p>No requests yet. Create your first request!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {requests.map((request) => (
                            <div key={request._id} style={{
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '15px', textTransform: 'capitalize' }}>
                                        {request.serviceType} - {request.numberOfWorkers} workers
                                    </p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                                        {request.location} • {request.duration}
                                    </p>
                                </div>
                                <StatusBadge status={request.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClientDashboard;
