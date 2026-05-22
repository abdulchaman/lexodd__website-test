import React from 'react';
import './SidebarCard.css';

const SidebarCard = ({ label, value, isLink, onClick }) => {
    return (
        <div className="sidebar-card">
            <div className="sidebar-label">{label}</div>
            <div className="sidebar-value">
                {typeof value === 'object' ? (
                    <>
                        <strong>{value.strong}</strong>
                        {value.note}
                    </>
                ) : isLink ? (
                    <span className="sidebar-link" onClick={onClick}>{value}</span>
                ) : value}
            </div>
        </div>
    );
};

export default SidebarCard;