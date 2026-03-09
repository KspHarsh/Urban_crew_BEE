import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatsCard from '../../../components/dashboard/StatsCard';
import { REQUEST_STATUS, WORKER_STATUS } from '../../../utils/constants';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        totalWorkers: 0,
        totalRequests: 0,
        activeJobs: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch clients
            const clientsSnapshot = await getDocs(collection(db, 'clients'));
            const totalClients = clientsSnapshot.size;

            // Fetch workers
            const workersSnapshot = await getDocs(collection(db, 'workers'));
            const totalWorkers = workersSnapshot.size;

            // Count pending worker approvals
            const pendingWorkers = workersSnapshot.docs.filter(
                doc => doc.data().status === WORKER_STATUS.PENDING
            ).length;

            // Fetch requests
            const requestsSnapshot = await getDocs(collection(db, 'requests'));
            const totalRequests = requestsSnapshot.size;

            // Count active jobs
            const activeJobs = requestsSnapshot.docs.filter(
                doc => doc.data().status === REQUEST_STATUS.ASSIGNED || doc.data().status === REQUEST_STATUS.APPROVED
            ).length;

            setStats({
                totalClients,
                totalWorkers,
                totalRequests,
                activeJobs,
                pendingApprovals: pendingWorkers
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Admin Dashboard">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <StatsCard
                    icon="fa-building"
                    label="Total Clients"
                    value={stats.totalClients}
                    color="#3b82f6"
                />
                <StatsCard
                    icon="fa-users"
                    label="Total Workers"
                    value={stats.totalWorkers}
                    color="#8b5cf6"
                />
                <StatsCard
                    icon="fa-clipboard-list"
                    label="Total Requests"
                    value={stats.totalRequests}
                    color="#10b981"
                />
                <StatsCard
                    icon="fa-briefcase"
                    label="Active Jobs"
                    value={stats.activeJobs}
                    color="#f59e0b"
                />
                <StatsCard
                    icon="fa-clock"
                    label="Pending Approvals"
                    value={stats.pendingApprovals}
                    color="#ef4444"
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
                <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: '600' }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <a href="/admin/requests" className="btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                        <i className="fa-solid fa-plus-circle"></i> New Request
                    </a>
                    <a href="/admin/workers" className="btn secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                        <i className="fa-solid fa-user-plus"></i> Add Worker
                    </a>
                    <a href="/admin/reports" className="btn secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                        <i className="fa-solid fa-chart-bar"></i> View Reports
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{
                background: '#482300',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: '600' }}>
                    Recent Activity
                </h2>
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                    <p>Activity feed will appear here</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
