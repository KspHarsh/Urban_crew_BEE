import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
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
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(user, {
                displayName: userData.name
            });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: email,
                name: userData.name,
                phone: userData.phone,
                role: userData.role,
                createdAt: new Date(),
                isActive: true // Auto-activate all users
            });

            // Create role-specific document
            if (userData.role === ROLES.CLIENT) {
                await setDoc(doc(db, 'clients', user.uid), {
                    userId: user.uid,
                    organizationName: userData.organizationName,
                    organizationType: userData.organizationType,
                    location: userData.location,
                    contactPerson: userData.name,
                    address: userData.address || '',
                    registeredAt: new Date(),
                    isBlocked: false
                });
            } else if (userData.role === ROLES.WORKER) {
                await setDoc(doc(db, 'workers', user.uid), {
                    userId: user.uid,
                    skills: userData.skills || [],
                    experience: userData.experience || '',
                    idProof: userData.idProof || '',
                    uniformIssued: false,
                    isAvailable: true,
                    currentAssignment: null,
                    joinedAt: new Date(),
                    status: 'approved' // Auto-approved
                });
            }

            toast.success('Registration successful! You can now login.');
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message);
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            // Check if user is active
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (!userData.isActive) {
                    await signOut(auth);
                    toast.error('Your account is pending approval. Please contact admin.');
                    throw new Error('Account not active');
                }
            } else {
                // User authenticated but no Firestore document
                console.warn('User authenticated but no Firestore document found. Creating one...');
                // This shouldn't happen in normal flow, but handle it gracefully
                toast.error('User profile not found. Please contact support.');
                throw new Error('User profile not found');
            }

            toast.success('Login successful!');
            return user;
        } catch (error) {
            console.error('Login error:', error);
            // Show more specific error messages
            if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Incorrect password.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email address.');
            } else if (error.message !== 'Account not active') {
                toast.error(error.message);
            }
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setUserRole(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(error.message);
            throw error;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent!');
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
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch user role from Firestore
                const userData = await getUserData(user.uid);
                if (userData) {
                    setUserRole(userData.role);
                }
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
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
