import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { ROLES, ORGANIZATION_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(ROLES.CLIENT);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const userData = {
                name: data.name,
                phone: data.phone,
                role: selectedRole
            };

            if (selectedRole === ROLES.CLIENT) {
                userData.organizationName = data.organizationName;
                userData.organizationType = data.organizationType;
                userData.location = data.location;
                userData.address = data.address;
            } else if (selectedRole === ROLES.WORKER) {
                userData.skills = data.skills ? data.skills.split(',').map(s => s.trim()) : [];
                userData.experience = data.experience;
                userData.idProof = data.idProof;
            }

            await registerUser(data.email, data.password, userData);

            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        loginWithGoogle('register', selectedRole);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--black)',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(255, 195, 0, 0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255, 195, 0, 0.06), transparent 40%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                background: 'linear-gradient(160deg, #0d0d0d, #111111)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                border: '1px solid rgba(255, 195, 0, 0.2)',
                width: '100%',
                maxWidth: '600px',
                padding: '40px',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '16px'
                    }}>
                        <div className="logo-mark">UC</div>
                        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--yellow)' }}>
                            UrbanCrew
                        </span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'var(--white)' }}>
                        Join UrbanCrew
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                        Create your account to get started
                    </p>
                </div>

                {/* Role Selection */}
                <div style={{ marginBottom: '24px' }}>
                    <label className="dashboard-form-label">
                        I want to register as:
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setSelectedRole(ROLES.CLIENT)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                border: selectedRole === ROLES.CLIENT ? '2px solid var(--yellow)' : '2px solid rgba(255, 195, 0, 0.2)',
                                borderRadius: '12px',
                                background: selectedRole === ROLES.CLIENT ? 'rgba(255, 195, 0, 0.15)' : 'rgba(255, 195, 0, 0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'center',
                                color: 'var(--white)'
                            }}
                        >
                            <i className="fa-solid fa-building" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', color: 'var(--yellow)' }}></i>
                            <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--white)' }}>Client</strong>
                            <small style={{ color: 'var(--muted)' }}>Hire staff</small>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole(ROLES.WORKER)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                border: selectedRole === ROLES.WORKER ? '2px solid var(--yellow)' : '2px solid rgba(255, 195, 0, 0.2)',
                                borderRadius: '12px',
                                background: selectedRole === ROLES.WORKER ? 'rgba(255, 195, 0, 0.15)' : 'rgba(255, 195, 0, 0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'center',
                                color: 'var(--white)'
                            }}
                        >
                            <i className="fa-solid fa-user-tie" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', color: 'var(--yellow)' }}></i>
                            <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--white)' }}>Worker</strong>
                            <small style={{ color: 'var(--muted)' }}>Find work</small>
                        </button>
                    </div>
                </div>

                {/* Google Sign Up Button */}
                <button
                    type="button"
                    onClick={handleGoogleRegister}
                    id="google-register-btn"
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 195, 0, 0.25)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--white)',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 195, 0, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.25)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google as {selectedRole === ROLES.CLIENT ? 'Client' : 'Worker'}
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    margin: '24px 0'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 195, 0, 0.15)' }} />
                    <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>or fill the form</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 195, 0, 0.15)' }} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="dashboard-form">
                    {/* Common Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="dashboard-form-field">
                            <label className="dashboard-form-label">Full Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                placeholder="Your name"
                                className={`dashboard-form-input ${errors.name ? 'error' : ''}`}
                            />
                            {errors.name && <p className="dashboard-form-error">{errors.name.message}</p>}
                        </div>

                        <div className="dashboard-form-field">
                            <label className="dashboard-form-label">Phone Number *</label>
                            <input
                                type="tel"
                                {...register('phone', {
                                    required: 'Phone is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Invalid phone number'
                                    }
                                })}
                                placeholder="10-digit number"
                                className={`dashboard-form-input ${errors.phone ? 'error' : ''}`}
                            />
                            {errors.phone && <p className="dashboard-form-error">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Email Address *</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email'
                                }
                            })}
                            placeholder="you@example.com"
                            className={`dashboard-form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <p className="dashboard-form-error">{errors.email.message}</p>}
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Password *</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Min 6 characters' },
                                pattern: {
                                    value: /^[^\s]+$/,
                                    message: 'Password cannot contain spaces'
                                }
                            })}
                            placeholder="••••••••"
                            className={`dashboard-form-input ${errors.password ? 'error' : ''}`}
                        />
                        {errors.password && <p className="dashboard-form-error">{errors.password.message}</p>}
                    </div>

                    {/* Client-specific fields */}
                    {selectedRole === ROLES.CLIENT && (
                        <>
                            <div className="dashboard-form-field">
                                <label className="dashboard-form-label">Organization Name *</label>
                                <input
                                    type="text"
                                    {...register('organizationName', { required: 'Organization name is required' })}
                                    placeholder="ABC School / XYZ Hospital"
                                    className={`dashboard-form-input ${errors.organizationName ? 'error' : ''}`}
                                />
                                {errors.organizationName && <p className="dashboard-form-error">{errors.organizationName.message}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="dashboard-form-field">
                                    <label className="dashboard-form-label">Organization Type *</label>
                                    <select
                                        {...register('organizationType', { required: 'Type is required' })}
                                        className={`dashboard-form-select ${errors.organizationType ? 'error' : ''}`}
                                    >
                                        <option value="">Select type</option>
                                        <option value={ORGANIZATION_TYPES.SCHOOL}>School</option>
                                        <option value={ORGANIZATION_TYPES.OFFICE}>Office</option>
                                        <option value={ORGANIZATION_TYPES.HOSPITAL}>Hospital</option>
                                        <option value={ORGANIZATION_TYPES.SOCIETY}>Society</option>
                                        <option value={ORGANIZATION_TYPES.COACHING}>Coaching</option>
                                    </select>
                                    {errors.organizationType && <p className="dashboard-form-error">{errors.organizationType.message}</p>}
                                </div>

                                <div className="dashboard-form-field">
                                    <label className="dashboard-form-label">Location *</label>
                                    <input
                                        type="text"
                                        {...register('location', { required: 'Location is required' })}
                                        placeholder="City, Area"
                                        className={`dashboard-form-input ${errors.location ? 'error' : ''}`}
                                    />
                                    {errors.location && <p className="dashboard-form-error">{errors.location.message}</p>}
                                </div>
                            </div>

                            <div className="dashboard-form-field">
                                <label className="dashboard-form-label">Full Address</label>
                                <textarea
                                    {...register('address')}
                                    placeholder="Complete address (optional)"
                                    rows="2"
                                    className="dashboard-form-textarea"
                                />
                            </div>
                        </>
                    )}

                    {/* Worker-specific fields */}
                    {selectedRole === ROLES.WORKER && (
                        <>
                            <div className="dashboard-form-field">
                                <label className="dashboard-form-label">Skills *</label>
                                <input
                                    type="text"
                                    {...register('skills', { required: 'Skills are required' })}
                                    placeholder="e.g., Cleaning, Helper, MTS (comma-separated)"
                                    className={`dashboard-form-input ${errors.skills ? 'error' : ''}`}
                                />
                                {errors.skills && <p className="dashboard-form-error">{errors.skills.message}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="dashboard-form-field">
                                    <label className="dashboard-form-label">Experience</label>
                                    <input
                                        type="text"
                                        {...register('experience')}
                                        placeholder="e.g., 2 years"
                                        className="dashboard-form-input"
                                    />
                                </div>

                                <div className="dashboard-form-field">
                                    <label className="dashboard-form-label">ID Proof Number</label>
                                    <input
                                        type="text"
                                        {...register('idProof')}
                                        placeholder="Aadhar / PAN"
                                        className="dashboard-form-input"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginTop: '8px',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i> Creating Account...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus"></i> Create Account
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--yellow)', fontWeight: '600', textDecoration: 'none' }}>
                            Sign in here
                        </Link>
                    </p>
                    <Link
                        to="/"
                        style={{
                            color: 'var(--muted)',
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginTop: '12px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--yellow)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
