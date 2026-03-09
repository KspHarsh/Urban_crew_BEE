import React from 'react';

const StatsCard = ({ icon, label, value, color = '#667eea', trend }) => {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    fontSize: '20px'
                }}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                {trend && (
                    <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: trend > 0 ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <i className={`fa-solid fa-arrow-${trend > 0 ? 'up' : 'down'}`}></i>
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                {label}
            </p>
            <h3 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
                {value}
            </h3>
        </div>
    );
};

export default StatsCard;
