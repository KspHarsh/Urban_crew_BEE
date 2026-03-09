import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await login(data.email, data.password);

            // Small delay to allow auth state to update
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--black)',
            padding: '20px',
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
                backgroundColor: 'linear-gradient(160deg, #0d0d0d, #111111)',
                background: 'linear-gradient(160deg, #0d0d0d, #111111)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                border: '1px solid rgba(255, 195, 0, 0.2)',
                width: '100%',
                maxWidth: '450px',
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
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                        Sign in to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="dashboard-form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="you@example.com"
                            className={`dashboard-form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && (
                            <p className="dashboard-form-error">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label className="dashboard-form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            placeholder="••••••••"
                            className={`dashboard-form-input ${errors.password ? 'error' : ''}`}
                        />
                        {errors.password && (
                            <p className="dashboard-form-error">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-right-to-bracket"></i> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--yellow)', fontWeight: '600', textDecoration: 'none' }}>
                            Register here
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

export default Login;
