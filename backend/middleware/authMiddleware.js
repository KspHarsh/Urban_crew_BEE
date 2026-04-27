import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================
// Protect Route — Verify JWT Token
// ============================================
export const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Also check for token in cookies (session support)
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // No token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — user not found'
            });
        }

        // Check if user is active
        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Contact admin.'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid token'
        });
    }
};

// ============================================
// Authorize — Role-Based Access Control
// ============================================
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};
