import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { SERVICE_TYPES, DURATION_TYPES } from '../../../utils/constants';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CreateRequest = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await addDoc(collection(db, 'requests'), {
                clientId: currentUser.uid,
                serviceType: data.serviceType,
                numberOfWorkers: parseInt(data.numberOfWorkers),
                location: data.location,
                duration: data.duration,
                notes: data.notes || '',
                status: 'new',
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedWorkers: []
            });

            toast.success('Request created successfully!');
            navigate('/client/requests');
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error('Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Create Staff Request">
            <div style={{
                background: '#482300',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                maxWidth: '700px'
            }}>
                <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>
                    New Staff Request
                </h2>
                <p style={{ margin: '0 0 32px', color: '#6b7280', fontSize: '15px' }}>
                    Fill in the details for your staffing requirements
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                            Service Type *
                        </label>
                        <select
                            {...register('serviceType', { required: 'Service type is required' })}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: errors.serviceType ? '2px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                        >
                            <option value="">Select service type</option>
                            <option value={SERVICE_TYPES.CLEANING}>Cleaning & Housekeeping</option>
                            <option value={SERVICE_TYPES.HELPER}>Helper Staff</option>
                            <option value={SERVICE_TYPES.MTS}>MTS (Multi-Tasking Staff)</option>
                            <option value={SERVICE_TYPES.HOSPITAL}>Hospital Support Staff</option>
                            <option value={SERVICE_TYPES.SCHOOL}>School Support Staff</option>
                            <option value={SERVICE_TYPES.SECURITY}>Security</option>
                            <option value={SERVICE_TYPES.SOCIETY}>Society Services</option>
                            <option value={SERVICE_TYPES.SHORT_TERM}>Short-Term / On-Call</option>
                        </select>
                        {errors.serviceType && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>{errors.serviceType.message}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Number of Workers *
                            </label>
                            <input
                                type="number"
                                min="1"
                                {...register('numberOfWorkers', {
                                    required: 'Number of workers is required',
                                    min: { value: 1, message: 'Minimum 1 worker required' }
                                })}
                                placeholder="e.g., 3"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: errors.numberOfWorkers ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                            />
                            {errors.numberOfWorkers && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>{errors.numberOfWorkers.message}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Duration *
                            </label>
                            <select
                                {...register('duration', { required: 'Duration is required' })}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: errors.duration ? '2px solid #ef4444' : '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                            >
                                <option value="">Select duration</option>
                                <option value={DURATION_TYPES.MONTHLY}>Monthly</option>
                                <option value={DURATION_TYPES.YEARLY}>Yearly</option>
                                <option value={DURATION_TYPES.ON_CALL}>On-Call</option>
                            </select>
                            {errors.duration && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>{errors.duration.message}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                            Location *
                        </label>
                        <input
                            type="text"
                            {...register('location', { required: 'Location is required' })}
                            placeholder="City, Area"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: errors.location ? '2px solid #ef4444' : '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                        />
                        {errors.location && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>{errors.location.message}</p>}
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                            Additional Notes
                        </label>
                        <textarea
                            {...register('notes')}
                            placeholder="Any specific requirements or details..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn"
                            style={{
                                flex: 1,
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-paper-plane"></i> Submit Request
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/client/dashboard')}
                            className="btn secondary"
                            style={{
                                padding: '14px 24px',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateRequest;
