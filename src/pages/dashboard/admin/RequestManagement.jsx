import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { REQUEST_STATUS } from '../../../utils/constants';
import toast from 'react-hot-toast';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const requestsSnapshot = await getDocs(collection(db, 'requests'));
            const requestsData = await Promise.all(
                requestsSnapshot.docs.map(async (requestDoc) => {
                    const data = requestDoc.data();
                    // Fetch client info
                    const clientDoc = await getDocs(collection(db, 'clients'));
                    const client = clientDoc.docs.find(c => c.id === data.clientId);

                    return {
                        id: requestDoc.id,
                        ...data,
                        clientName: client?.data()?.organizationName || 'Unknown'
                    };
                })
            );
            setRequests(requestsData);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const updateRequestStatus = async (requestId, newStatus) => {
        try {
            await updateDoc(doc(db, 'requests', requestId), {
                status: newStatus,
                updatedAt: new Date()
            });
            toast.success('Request status updated!');
            fetchRequests();
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error('Failed to update request');
        }
    };

    return (
        <DashboardLayout title="Request Management">
            <div style={{
                background: '#482300',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                        All Requests ({requests.length})
                    </h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                        <p>No requests found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Client</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Service</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Workers</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Duration</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#6b7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '16px', fontSize: '14px' }}>{request.clientName}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', textTransform: 'capitalize' }}>{request.serviceType}</td>
                                        <td style={{ padding: '16px', fontSize: '14px' }}>{request.numberOfWorkers}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', textTransform: 'capitalize' }}>{request.duration}</td>
                                        <td style={{ padding: '16px' }}>
                                            <StatusBadge status={request.status} />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <select
                                                value={request.status}
                                                onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #d1d5db',
                                                    fontSize: '13px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value={REQUEST_STATUS.NEW}>New</option>
                                                <option value={REQUEST_STATUS.APPROVED}>Approved</option>
                                                <option value={REQUEST_STATUS.ASSIGNED}>Assigned</option>
                                                <option value={REQUEST_STATUS.COMPLETED}>Completed</option>
                                                <option value={REQUEST_STATUS.CANCELLED}>Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RequestManagement;
