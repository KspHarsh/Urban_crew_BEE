import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { WORKER_STATUS } from '../../../utils/constants';
import toast from 'react-hot-toast';

const WorkerManagement = () => {
    const [workers, setWorkers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [assignmentData, setAssignmentData] = useState({
        clientId: '',
        workLocation: '',
        workingHours: '',
        salary: '',
        startDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch workers
            const workersSnapshot = await getDocs(collection(db, 'workers'));
            const usersSnapshot = await getDocs(collection(db, 'users'));

            const workersData = workersSnapshot.docs.map((workerDoc) => {
                const workerData = workerDoc.data();
                const user = usersSnapshot.docs.find(u => u.id === workerData.userId);

                return {
                    id: workerDoc.id,
                    ...workerData,
                    name: user?.data()?.name || 'Unknown',
                    phone: user?.data()?.phone || 'N/A',
                    email: user?.data()?.email || 'N/A',
                    isActive: user?.data()?.isActive || false
                };
            });

            // Fetch clients
            const clientsSnapshot = await getDocs(collection(db, 'clients'));
            const clientsData = clientsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setWorkers(workersData);
            setClients(clientsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const toggleWorkerActive = async (workerId, userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;

            await updateDoc(doc(db, 'users', userId), {
                isActive: newStatus
            });

            toast.success(`Worker ${newStatus ? 'activated' : 'deactivated'} successfully!`);
            fetchData();
        } catch (error) {
            console.error('Error toggling worker status:', error);
            toast.error('Failed to update worker status');
        }
    };

    const openAssignModal = (worker) => {
        setSelectedWorker(worker);
        setShowAssignModal(true);
        setAssignmentData({
            clientId: '',
            workLocation: '',
            workingHours: '',
            salary: '',
            startDate: ''
        });
    };

    const handleAssignWorker = async (e) => {
        e.preventDefault();

        if (!assignmentData.clientId || !assignmentData.workLocation || !assignmentData.workingHours || !assignmentData.salary) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            // Create assignment
            await addDoc(collection(db, 'assignments'), {
                workerId: selectedWorker.id,
                clientId: assignmentData.clientId,
                workLocation: assignmentData.workLocation,
                workingHours: assignmentData.workingHours,
                salary: parseFloat(assignmentData.salary),
                startDate: assignmentData.startDate ? new Date(assignmentData.startDate) : serverTimestamp(),
                status: 'active',
                createdAt: serverTimestamp()
            });

            // Update worker availability
            await updateDoc(doc(db, 'workers', selectedWorker.id), {
                isAvailable: false
            });

            toast.success('Worker assigned successfully!');
            setShowAssignModal(false);
            fetchData();
        } catch (error) {
            console.error('Error assigning worker:', error);
            toast.error('Failed to assign worker');
        }
    };

    return (
        <DashboardLayout title="Worker Management">
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <div>
                        <h2 className="dashboard-card-title">
                            <i className="fa-solid fa-users"></i> All Workers ({workers.length})
                        </h2>
                        <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
                            Manage worker assignments and status
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="dashboard-spinner">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    </div>
                ) : workers.length === 0 ? (
                    <div className="dashboard-empty">
                        <i className="fa-solid fa-users dashboard-empty-icon"></i>
                        <p className="dashboard-empty-text">No workers found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Skills</th>
                                    <th>Experience</th>
                                    <th>Available</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((worker) => (
                                    <tr key={worker.id}>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--white)' }}>
                                                    {worker.name}
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                                                    {worker.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{worker.phone}</td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                {worker.skills?.join(', ') || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{worker.experience || 'N/A'}</td>
                                        <td>
                                            <span className="dashboard-status-badge" style={{
                                                background: worker.isAvailable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: worker.isAvailable ? '#10b981' : '#ef4444',
                                                border: `1px solid ${worker.isAvailable ? '#10b981' : '#ef4444'}`
                                            }}>
                                                <span className="dashboard-status-badge-dot" style={{
                                                    background: worker.isAvailable ? '#10b981' : '#ef4444'
                                                }}></span>
                                                {worker.isAvailable ? 'Available' : 'Busy'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="dashboard-status-badge" style={{
                                                background: worker.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: worker.isActive ? '#10b981' : '#ef4444',
                                                border: `1px solid ${worker.isActive ? '#10b981' : '#ef4444'}`
                                            }}>
                                                {worker.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {/* Assign Worker Button */}
                                                {worker.isAvailable && worker.isActive && (
                                                    <button
                                                        onClick={() => openAssignModal(worker)}
                                                        className="dashboard-btn-secondary"
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '13px',
                                                            background: 'rgba(16, 185, 129, 0.1)',
                                                            border: '1px solid #10b981',
                                                            color: '#10b981'
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-user-plus"></i> Assign
                                                    </button>
                                                )}

                                                {/* Activate/Deactivate Button */}
                                                <button
                                                    onClick={() => toggleWorkerActive(worker.id, worker.userId, worker.isActive)}
                                                    className="dashboard-btn-secondary"
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '13px',
                                                        background: worker.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        border: `1px solid ${worker.isActive ? '#ef4444' : '#10b981'}`,
                                                        color: worker.isActive ? '#ef4444' : '#10b981'
                                                    }}
                                                >
                                                    <i className={`fa-solid ${worker.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                                                    {worker.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assign Worker Modal */}
            <Modal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                title={`Assign ${selectedWorker?.name} to Client`}
                size="medium"
            >
                <form onSubmit={handleAssignWorker} className="dashboard-form">
                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Select Client *</label>
                        <select
                            value={assignmentData.clientId}
                            onChange={(e) => setAssignmentData({ ...assignmentData, clientId: e.target.value })}
                            className="dashboard-form-select"
                            required
                        >
                            <option value="">Choose a client...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.organizationName} ({client.organizationType})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Work Location *</label>
                        <input
                            type="text"
                            value={assignmentData.workLocation}
                            onChange={(e) => setAssignmentData({ ...assignmentData, workLocation: e.target.value })}
                            placeholder="e.g., Main Office, Building A"
                            className="dashboard-form-input"
                            required
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Working Hours *</label>
                        <input
                            type="text"
                            value={assignmentData.workingHours}
                            onChange={(e) => setAssignmentData({ ...assignmentData, workingHours: e.target.value })}
                            placeholder="e.g., 9 AM - 5 PM"
                            className="dashboard-form-input"
                            required
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Monthly Salary (₹) *</label>
                        <input
                            type="number"
                            value={assignmentData.salary}
                            onChange={(e) => setAssignmentData({ ...assignmentData, salary: e.target.value })}
                            placeholder="e.g., 15000"
                            className="dashboard-form-input"
                            required
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Start Date</label>
                        <input
                            type="date"
                            value={assignmentData.startDate}
                            onChange={(e) => setAssignmentData({ ...assignmentData, startDate: e.target.value })}
                            className="dashboard-form-input"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="dashboard-btn" style={{ flex: 1 }}>
                            <i className="fa-solid fa-check"></i> Assign Worker
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAssignModal(false)}
                            className="dashboard-btn-secondary"
                            style={{ flex: 1 }}
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default WorkerManagement;
