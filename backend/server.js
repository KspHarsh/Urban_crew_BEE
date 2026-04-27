import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Database connection
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';

// Middleware imports
import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

// Model imports for EJS demo
import User from './models/User.js';
import Request from './models/Request.js';
import Worker from './models/Worker.js';

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// ============================================
// Socket.io Setup
// ============================================
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Make io accessible in controllers
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join role-specific rooms
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`📢 Socket ${socket.id} joined room: ${room}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
});

// ============================================
// EJS Template Engine Setup
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// Application-Level Middleware
// ============================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP request logger (third-party middleware)
app.use(morgan('dev'));

// Custom request logger (application-level middleware)
app.use(loggerMiddleware);

// Body parsers (built-in middleware - replaces body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

const createSessionMiddleware = () => {
    const store = MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 day
    });

    store.on('error', (error) => {
        console.error(`❌ Session store error: ${error.message}`);
    });

    return session({
        secret: process.env.SESSION_SECRET || 'urbancrew-session-secret',
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    });
};

let routesInitialized = false;

const setupRoutesAndErrors = () => {
    if (routesInitialized) {
        return;
    }

    // API Routes (Router-Level Middleware)
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/client', clientRoutes);
    app.use('/api/worker', workerRoutes);

    // Error Handling Middleware
    app.use(notFound);
    app.use(errorHandler);

    routesInitialized = true;
};

// ============================================
// EJS SSR Demo Route
// ============================================
app.get('/demo', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRequests = await Request.countDocuments();
        const totalWorkers = await Worker.countDocuments();
        const recentRequests = await Request.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('clientId', 'name email');

        res.render('demo', {
            title: 'UrbanCrew Platform — Server Side Rendered Demo',
            stats: {
                totalUsers,
                totalRequests,
                totalWorkers
            },
            recentRequests,
            serverTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
    } catch (error) {
        res.render('demo', {
            title: 'UrbanCrew Platform — Demo',
            stats: { totalUsers: 0, totalRequests: 0, totalWorkers: 0 },
            recentRequests: [],
            serverTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
    }
});

// ============================================
// Health Check
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'UrbanCrew API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Start Server
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Attach session middleware only after a stable DB connection is available.
        app.use(createSessionMiddleware());

        // Initialize Passport.js (Google OAuth)
        configurePassport();
        app.use(passport.initialize());

        // Ensure session middleware is mounted before route handlers.
        setupRoutesAndErrors();

        // Start HTTP server (with Socket.io attached)
        httpServer.listen(PORT, () => {
            console.log(`\n🚀 UrbanCrew Backend Server`);
            console.log(`   ├── API:     http://localhost:${PORT}/api`);
            console.log(`   ├── Health:  http://localhost:${PORT}/api/health`);
            console.log(`   ├── Demo:    http://localhost:${PORT}/demo`);
            console.log(`   ├── Socket:  ws://localhost:${PORT}`);
            console.log(`   └── Mode:    ${process.env.NODE_ENV || 'development'}\n`);
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (error) => {
    console.error(`❌ Unhandled Promise Rejection: ${error.message}`);
});

process.on('uncaughtException', (error) => {
    console.error(`❌ Uncaught Exception: ${error.message}`);
});

export { io };
