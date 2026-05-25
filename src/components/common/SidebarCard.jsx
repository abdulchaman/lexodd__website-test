import React from 'react';
import './SidebarCard.css';

const SidebarCard = ({ label, value, isLink, onClick }) => {
    const renderValue = (item) => {
        if (item == null) return '';
        if (React.isValidElement(item)) return item;
        if (Array.isArray(item)) return item.map(renderValue).filter(Boolean).join(', ');
        if (typeof item !== 'object') return item;

        if ('strong' in item || 'note' in item) {
            return (
                <>
                    {item.strong && <strong>{renderValue(item.strong)}</strong>}
                    {item.note && renderValue(item.note)}
                </>
            );
        }

        return [item.name, item.region, item.size].filter(Boolean).join(' - ');
    };

    return (
        <div className="sidebar-card">
            <div className="sidebar-label">{label}</div>
            <div className="sidebar-value">
                {isLink ? (
                    <span className="sidebar-link" onClick={onClick}>{renderValue(value)}</span>
                ) : renderValue(value)}
            </div>
        </div>
    );
};

export default SidebarCard;
