import React from 'react';

function Time({ timestamp }) {
    const getTimeAgo = (timestamp) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);

        if (seconds < 1) {
            return 'just now';
        }

        const timeUnits = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const unit in timeUnits) {
            const interval = Math.floor(seconds / timeUnits[unit]);
            if (interval >= 1) {
                return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }

        return `${Math.floor(seconds)} seconds ago`;
    };

    return <span className='tooltip' data-tooltip={`${new Date(timestamp).toLocaleDateString()} • ${new Date(timestamp).toLocaleTimeString()}`}>{getTimeAgo(timestamp)}</span>;
}

export default Time;