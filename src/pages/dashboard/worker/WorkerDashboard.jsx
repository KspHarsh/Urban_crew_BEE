import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatsCard from '../../../components/dashboard/StatsCard';

const WorkerDashboard = () => {
    const { currentUser } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkerData();
    }, [currentUser]);

    const fetchWorkerData = async () => {
        try {
            // Fetch current assignment
            const assignmentsSnapshot = await getDocs(collection(db, 'assignments'));
            const currentAssignment = assignmentsSnapshot.docs.find(
                doc => doc.data().workerId === currentUser.uid && doc.data().status === 'active'
            );

            if (currentAssignment) {
                const assignmentData = currentAssignment.data();

                // Fetch client info
                const clientsSnapshot = await getDocs(collection(db, 'clients'));
                const client = clientsSnapshot.docs.find(c => c.id === assignmentData.clientId);

                setAssignment({
                    id: currentAssignment.id,
                    ...assignmentData,
                    clientName: client?.data()?.organizationName || 'Unknown'
                });
            }
        } catch (error) {
            console.error('Error fetching worker data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Worker Dashboard">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Worker Dashboard">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                    Welcome back! 👋
                </h2>
                <p style={{ color: '#6b7280', fontSize: '15px' }}>
                    Here's your current job status
                </p>
            </div>

            {assignment ? (
                <>
                    {/* Current Assignment Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        padding: '32px',
                        color: '#ffffff',
                        marginBottom: '32px',
                        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                <i className="fa-solid fa-briefcase"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Current Assignment</h3>
                                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Active Job</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Client</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{assignment.clientName}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Location</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{assignment.workLocation}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Working Hours</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{assignment.workingHours}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Monthly Salary</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>₹{assignment.salary?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div style={{
                        background: '#482300',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>Quick Links</h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a href="/worker/availability" className="btn secondary" style={{ textDecoration: 'none' }}>
                                <i className="fa-solid fa-calendar-check"></i> Manage Availability
                            </a>
                            <a href="/worker/salary" className="btn secondary" style={{ textDecoration: 'none' }}>
                                <i className="fa-solid fa-indian-rupee-sign"></i> View Salary
                            </a>
                            <a href="/worker/history" className="btn secondary" style={{ textDecoration: 'none' }}>
                                <i className="fa-solid fa-clock-rotate-left"></i> Job History
                            </a>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#482300',
                    borderRadius: '12px',
                    padding: '60px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}>
                    <i className="fa-solid fa-briefcase" style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '20px', display: 'block' }}></i>
                    <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '600' }}>No Active Assignment</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
                        You don't have any active job assignment at the moment. Our admin will assign you to a job soon.
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default WorkerDashboard;
