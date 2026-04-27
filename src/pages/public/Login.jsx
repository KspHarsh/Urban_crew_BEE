import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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

    const handleGoogleLogin = () => {
        loginWithGoogle('login');
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

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    margin: '24px 0'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 195, 0, 0.15)' }} />
                    <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 195, 0, 0.15)' }} />
                </div>

                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    id="google-login-btn"
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 195, 0, 0.25)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--white)',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: googleLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.25s ease',
                        opacity: googleLoading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!googleLoading) {
                            e.currentTarget.style.background = 'rgba(255, 195, 0, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.25)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {googleLoading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin"></i> Connecting...
                        </>
                    ) : (
                        <>
                            {/* Google SVG Icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

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

