import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// ============================================
// Google OAuth Callback Handler
// Captures token + user from URL params,
// stores them, and redirects to role-based dashboard.
// Also handles error cases with user-friendly messages.
// ============================================

const ERROR_MESSAGES = {
    not_registered: {
        title: 'Account Not Found',
        message: 'No account exists with this Gmail. Please register first to create your account.',
        icon: 'fa-solid fa-user-xmark',
        action: 'register'
    },
    already_exists: {
        title: 'Account Already Exists',
        message: 'An account with this Gmail already exists. Please login instead.',
        icon: 'fa-solid fa-user-check',
        action: 'login'
    },
    account_inactive: {
        title: 'Account Inactive',
        message: 'Your account is currently inactive. Please contact the admin for assistance.',
        icon: 'fa-solid fa-ban',
        action: 'home'
    },
    google_login_failed: {
        title: 'Login Failed',
        message: 'Something went wrong during Google login. Please try again.',
        icon: 'fa-solid fa-triangle-exclamation',
        action: 'login'
    },
    google_auth_failed: {
        title: 'Authentication Failed',
        message: 'Google authentication was unsuccessful. Please try again.',
        icon: 'fa-solid fa-triangle-exclamation',
        action: 'login'
    }
};

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorInfo, setErrorInfo] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            const info = ERROR_MESSAGES[error] || ERROR_MESSAGES.google_login_failed;
            setErrorInfo(info);
            toast.error(info.message);
            return;
        }

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));

                // Store in localStorage (same as normal login)
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                toast.success('Login successful!');

                // Redirect based on role
                switch (user.role) {
                    case 'admin':
                        navigate('/admin/dashboard', { replace: true });
                        break;
                    case 'client':
                        navigate('/client/dashboard', { replace: true });
                        break;
                    case 'worker':
                        navigate('/worker/dashboard', { replace: true });
                        break;
                    default:
                        navigate('/dashboard', { replace: true });
                }
            } catch (err) {
                console.error('Failed to parse Google callback data:', err);
                setErrorInfo(ERROR_MESSAGES.google_login_failed);
            }
        } else if (!error) {
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    // Show error UI
    if (errorInfo) {
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
                    maxWidth: '450px',
                    padding: '48px 40px',
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center'
                }}>
                    {/* Error Icon */}
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'rgba(255, 80, 80, 0.12)',
                        border: '2px solid rgba(255, 80, 80, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        fontSize: '28px',
                        color: '#ff5050'
                    }}>
                        <i className={errorInfo.icon}></i>
                    </div>

                    {/* Error Title */}
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'var(--white)',
                        marginBottom: '12px'
                    }}>
                        {errorInfo.title}
                    </h2>

                    {/* Error Message */}
                    <p style={{
                        color: 'var(--muted)',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        marginBottom: '32px'
                    }}>
                        {errorInfo.message}
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {errorInfo.action === 'register' && (
                            <>
                                <Link to="/register" className="btn" style={{
                                    width: '100%',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-user-plus"></i> Create Account
                                </Link>
                                <Link to="/login" style={{
                                    color: 'var(--muted)',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}>
                                    or go back to <span style={{ color: 'var(--yellow)', fontWeight: '600' }}>Login</span>
                                </Link>
                            </>
                        )}
                        {errorInfo.action === 'login' && (
                            <>
                                <Link to="/login" className="btn" style={{
                                    width: '100%',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-right-to-bracket"></i> Go to Login
                                </Link>
                                <Link to="/register" style={{
                                    color: 'var(--muted)',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}>
                                    or <span style={{ color: 'var(--yellow)', fontWeight: '600' }}>Register</span> a new account
                                </Link>
                            </>
                        )}
                        {errorInfo.action === 'home' && (
                            <Link to="/" className="btn" style={{
                                width: '100%',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                textDecoration: 'none',
                                justifyContent: 'center'
                            }}>
                                <i className="fa-solid fa-house"></i> Go to Home
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Loading state while processing
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--black)',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div className="wrench">
                <i className="fa-solid fa-wrench" />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '16px' }}>
                Signing you in with Google...
            </p>
        </div>
    );
};

export default GoogleCallback;
