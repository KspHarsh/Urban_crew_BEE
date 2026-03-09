import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import toast from 'react-hot-toast';

const WorkerAvailability = () => {
    const { currentUser } = useAuth();
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchWorkerData();
    }, [currentUser]);

    const fetchWorkerData = async () => {
        try {
            const workerDoc = await getDoc(doc(db, 'workers', currentUser.uid));
            if (workerDoc.exists()) {
                setWorkerData({ id: workerDoc.id, ...workerDoc.data() });
            }
        } catch (error) {
            console.error('Error fetching worker data:', error);
            toast.error('Failed to load availability status');
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async () => {
        try {
            setUpdating(true);
            const newStatus = !workerData.isAvailable;

            await updateDoc(doc(db, 'workers', currentUser.uid), {
                isAvailable: newStatus
            });

            setWorkerData({ ...workerData, isAvailable: newStatus });
            toast.success(`You are now marked as ${newStatus ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            console.error('Error updating availability:', error);
            toast.error('Failed to update availability');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Availability Management">
                <div className="dashboard-loading">
                    <div className="dashboard-spinner">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Availability Management">
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <h2 className="dashboard-card-title">Your Availability Status</h2>
                </div>

                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    {/* Status Display */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: workerData?.isAvailable
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: workerData?.isAvailable
                            ? '0 10px 25px rgba(16, 185, 129, 0.3)'
                            : '0 10px 25px rgba(239, 68, 68, 0.3)'
                    }}>
                        <i className={`fa-solid ${workerData?.isAvailable ? 'fa-check' : 'fa-xmark'}`}
                            style={{ fontSize: '48px', color: '#ffffff' }}></i>
                    </div>

                    <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: 'var(--white)' }}>
                        {workerData?.isAvailable ? 'Available for Work' : 'Currently Unavailable'}
                    </h3>
                    <p style={{ margin: '0 0 32px', color: 'var(--muted)', fontSize: '15px' }}>
                        {workerData?.isAvailable
                            ? 'You are visible to admins and can be assigned to new jobs'
                            : 'You are not visible for new job assignments'}
                    </p>

                    {/* Toggle Button */}
                    <button
                        onClick={toggleAvailability}
                        disabled={updating}
                        className="dashboard-btn"
                        style={{
                            background: workerData?.isAvailable
                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            opacity: updating ? 0.7 : 1,
                            cursor: updating ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {updating ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i> Updating...
                            </>
                        ) : (
                            <>
                                <i className={`fa-solid ${workerData?.isAvailable ? 'fa-pause' : 'fa-play'}`}></i>
                                Mark as {workerData?.isAvailable ? 'Unavailable' : 'Available'}
                            </>
                        )}
                    </button>
                </div>

                {/* Info Section */}
                <div style={{
                    background: 'rgba(255, 195, 0, 0.1)',
                    border: '1px solid rgba(255, 195, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '24px'
                }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600', color: 'var(--yellow)' }}>
                        <i className="fa-solid fa-info-circle"></i> Important Information
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--muted)', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>When marked as <strong>Available</strong>, admins can assign you to new jobs</li>
                        <li>When marked as <strong>Unavailable</strong>, you won't receive new job assignments</li>
                        <li>Your current active assignment (if any) will not be affected</li>
                        <li>You can change your status anytime</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkerAvailability;
