import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatusBadge from '../../../components/common/StatusBadge';

const WorkerJobHistory = () => {
    const { currentUser } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobHistory();
    }, [currentUser]);

    const fetchJobHistory = async () => {
        try {
            const response = await api.get('/worker/jobs');
            if (response.data.success) {
                setJobs(response.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching job history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Job History">
                <div className="dashboard-loading">
                    <div className="dashboard-spinner">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Job History">
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <h2 className="dashboard-card-title">
                        <i className="fa-solid fa-clock-rotate-left"></i> Your Job History
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
                        Total Jobs: {jobs.length}
                    </p>
                </div>

                {jobs.length === 0 ? (
                    <div className="dashboard-empty">
                        <i className="fa-solid fa-briefcase dashboard-empty-icon"></i>
                        <p className="dashboard-empty-text">No job history found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Working Hours</th>
                                    <th>Duration</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job._id}>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--white)' }}>
                                                    {job.clientName}
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                                                    {job.organizationType}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{job.organizationType}</td>
                                        <td>{job.workLocation}</td>
                                        <td>{job.workingHours}</td>
                                        <td>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                background: 'rgba(255, 195, 0, 0.1)',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: 'var(--yellow)'
                                            }}>
                                                {job.duration}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '600', color: 'var(--yellow)' }}>
                                            ₹{job.salary?.toLocaleString()}
                                        </td>
                                        <td>
                                            <StatusBadge status={job.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {jobs.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '24px'
                }}>
                    <div className="dashboard-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--yellow)', marginBottom: '8px' }}>
                            {jobs.filter(j => j.status === 'active').length}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Active Jobs</div>
                    </div>
                    <div className="dashboard-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--yellow)', marginBottom: '8px' }}>
                            {jobs.filter(j => j.status === 'completed').length}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Completed Jobs</div>
                    </div>
                    <div className="dashboard-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--yellow)', marginBottom: '8px' }}>
                            ₹{jobs.reduce((sum, job) => sum + (job.salary || 0), 0).toLocaleString()}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>Total Earnings</div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default WorkerJobHistory;
