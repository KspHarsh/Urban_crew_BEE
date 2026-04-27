import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for auth routes (bonus: security)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 requests per window
    message: {
        success: false,
        message: 'Too many attempts. Please try again after 15 minutes.'
    }
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// ============================================
// Google OAuth Routes
// ============================================

// @desc    Start Google OAuth (login or register)
// @route   GET /api/auth/google?mode=login OR ?mode=register&role=client
// @access  Public
router.get('/google', (req, res, next) => {
    const mode = req.query.mode || 'login';
    const role = req.query.role || 'client';

    // Pass mode and role via state parameter to the callback
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ mode, role })
    })(req, res, next);
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/auth/google/failure'
    }),
    async (req, res) => {
        const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';

        try {
            // Parse state to get mode and role
            let mode = 'login';
            let role = 'client';

            if (req.query.state) {
                try {
                    const state = JSON.parse(req.query.state);
                    mode = state.mode || 'login';
                    role = state.role || 'client';
                } catch (e) {
                    // Invalid state, default to login
                }
            }

            const { email, name, googleId } = req.user;

            // Check if user exists in DB
            let user = await User.findOne({ email });

            if (mode === 'login') {
                // ── LOGIN MODE ──
                // User MUST already exist in DB
                if (!user) {
                    return res.redirect(
                        `${clientURL}/auth/google/callback?error=not_registered`
                    );
                }

                // Link googleId if not already linked
                if (!user.googleId) {
                    user.googleId = googleId;
                    await user.save();
                }

                // Check if user is active
                if (!user.isActive) {
                    return res.redirect(
                        `${clientURL}/auth/google/callback?error=account_inactive`
                    );
                }

            } else if (mode === 'register') {
                // ── REGISTER MODE ──
                // User must NOT already exist
                if (user) {
                    return res.redirect(
                        `${clientURL}/auth/google/callback?error=already_exists`
                    );
                }

                // Validate role
                if (!['client', 'worker'].includes(role)) {
                    role = 'client';
                }

                // Create new user
                user = await User.create({
                    name,
                    email,
                    googleId,
                    role,
                    isActive: true
                    // No password for Google users
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // Redirect to frontend with token and user data
            const userData = encodeURIComponent(JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }));

            res.redirect(`${clientURL}/auth/google/callback?token=${token}&user=${userData}`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect(`${clientURL}/auth/google/callback?error=google_login_failed`);
        }
    }
);

// @desc    Google OAuth failure
// @route   GET /api/auth/google/failure
// @access  Public
router.get('/google/failure', (req, res) => {
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientURL}/auth/google/callback?error=google_auth_failed`);
});

export default router;
