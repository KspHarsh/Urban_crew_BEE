import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
    const getStatusLabel = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '500',
        backgroundColor: STATUS_COLORS[status] || '#6b7280',
        color: '#ffffff',
        whiteSpace: 'nowrap'
    };

    const dotStyle = {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#482300'
    };

    return (
        <span style={badgeStyle}>
            <span style={dotStyle}></span>
            {getStatusLabel(status)}
        </span>
    );
};

export default StatusBadge;
