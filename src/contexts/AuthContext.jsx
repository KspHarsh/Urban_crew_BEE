import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register new user
    const register = async (email, password, userData) => {
        try {
            const response = await api.post('/auth/register', {
                name: userData.name,
                email,
                password,
                phone: userData.phone,
                role: userData.role,
                // Client-specific fields
                organizationName: userData.organizationName,
                organizationType: userData.organizationType,
                location: userData.location,
                address: userData.address,
                // Worker-specific fields
                skills: userData.skills,
                experience: userData.experience,
                idProof: userData.idProof
            });

            const { token, user } = response.data;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Registration successful! You can now login.');
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            const { token, user } = response.data;

            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Update state
            setCurrentUser(user);
            setUserRole(user.role);

            toast.success('Login successful!');
            return user;
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || error.message;

            if (message.includes('No account found')) {
                toast.error('No account found with this email.');
            } else if (message.includes('Incorrect password')) {
                toast.error('Incorrect password.');
            } else if (message.includes('pending approval')) {
                toast.error('Your account is pending approval. Please contact admin.');
            } else {
                toast.error(message);
            }
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            // Call logout API to clear server session/cookie
            try {
                await api.post('/auth/logout');
            } catch (e) {
                // Ignore API errors on logout
            }

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            setCurrentUser(null);
            setUserRole(null);

            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(error.message);
            throw error;
        }
    };

    // Reset password (simplified — just shows message)
    const resetPassword = async (email) => {
        try {
            toast.success('Please contact admin to reset your password.');
        } catch (error) {
            console.error('Password reset error:', error);
            toast.error(error.message);
            throw error;
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return userRole === role;
    };

    // Get user role-specific data
    const getUserData = async (uid) => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                return response.data.user;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Check for existing token on mount (replaces onAuthStateChanged)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid by calling /me
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        const user = response.data.user;
                        setCurrentUser(user);
                        setUserRole(user.role);
                    } else {
                        // Token invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                    setUserRole(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const value = {
        currentUser,
        userRole,
        register,
        login,
        logout,
        resetPassword,
        hasRole,
        getUserData,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
