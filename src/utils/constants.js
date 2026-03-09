// Constants for the application

// User Roles
export const ROLES = {
    ADMIN: 'admin',
    CLIENT: 'client',
    WORKER: 'worker'
};

// Request Status
export const REQUEST_STATUS = {
    NEW: 'new',
    APPROVED: 'approved',
    ASSIGNED: 'assigned',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Service Types
export const SERVICE_TYPES = {
    CLEANING: 'cleaning',
    HELPER: 'helper',
    MTS: 'mts',
    HOSPITAL: 'hospital',
    SCHOOL: 'school',
    SECURITY: 'security',
    SOCIETY: 'society',
    SHORT_TERM: 'short-term'
};

// Duration Types
export const DURATION_TYPES = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    ON_CALL: 'on-call'
};

// Worker Status
export const WORKER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    INACTIVE: 'inactive'
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    REPLACED: 'replaced'
};

// Replacement Status
export const REPLACEMENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
};

// Salary Status
export const SALARY_STATUS = {
    PENDING: 'pending',
    PAID: 'paid'
};

// Organization Types
export const ORGANIZATION_TYPES = {
    SCHOOL: 'school',
    OFFICE: 'office',
    HOSPITAL: 'hospital',
    SOCIETY: 'society',
    COACHING: 'coaching'
};

// Status Colors for UI
export const STATUS_COLORS = {
    new: '#3b82f6',
    approved: '#10b981',
    assigned: '#8b5cf6',
    completed: '#22c55e',
    cancelled: '#ef4444',
    pending: '#f59e0b',
    active: '#06b6d4',
    rejected: '#dc2626',
    paid: '#16a34a'
};

// WhatsApp Business Number
export const WHATSAPP_NUMBER = '919306512657';
