import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Worker from '../models/Worker.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// ============================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ============================================
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role, ...roleData } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and role'
            });
        }

        // Validate role
        if (!['client', 'worker'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "client" or "worker"'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create user (password is hashed by the pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            isActive: true
        });

        // Create role-specific document
        if (role === 'client') {
            await Client.create({
                userId: user._id,
                organizationName: roleData.organizationName || name,
                organizationType: roleData.organizationType || 'office',
                location: roleData.location || '',
                contactPerson: name,
                address: roleData.address || ''
            });
        } else if (role === 'worker') {
            const skills = roleData.skills
                ? (typeof roleData.skills === 'string'
                    ? roleData.skills.split(',').map(s => s.trim())
                    : roleData.skills)
                : [];

            await Worker.create({
                userId: user._id,
                skills,
                experience: roleData.experience || '',
                idProof: roleData.idProof || '',
                status: 'approved'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Set session data when session middleware is available.
        if (req.session) {
            req.session.userId = user._id;
            req.session.role = user.role;
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending approval. Please contact admin.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Set session data when session middleware is available.
        if (req.session) {
            req.session.userId = user._id;
            req.session.role = user.role;
        }

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

// ============================================
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ============================================
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile'
        });
    }
};

// ============================================
// @desc    Logout user (clear cookie & session)
// @route   POST /api/auth/logout
// @access  Private
// ============================================
export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    if (req.session) {
        req.session.destroy((err) => {
            if (err) console.error('Session destroy error:', err);
        });
    }

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};
