import { io } from 'socket.io-client';

// ============================================
// Socket.io Client Connection
// ============================================
// Connects to the Express backend's Socket.io server
// for real-time updates (requests, assignments, etc.)

const SOCKET_URL = 'http://localhost:5000';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
    transports: ['websocket', 'polling']
});

// Connection event handlers
socket.on('connect', () => {
    console.log('⚡ Socket.io connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('🔌 Socket.io disconnected');
});

socket.on('connect_error', (error) => {
    console.log('❌ Socket.io connection error:', error.message);
});

export default socket;
