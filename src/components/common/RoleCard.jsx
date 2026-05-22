import React from 'react';
import './RoleCard.css';

const RoleCard = ({ type, status, statusColor, title, location, description, onApply }) => {
    const getStatusClass = () => {
        return statusColor === 'ind' ? 'tag-ind' : 'tag-wp';
    };

    return (
        <div className="role-card">
            <div>
                <div className="role-tag-row">
                    <span className="tag">{type}</span>
                    <span className={getStatusClass()}>{status}</span>
                </div>
                <div className="role-title">{title}</div>
                <div className="role-meta">{location}</div>
                <p className="role-description">{description}</p>
            </div>
            <button className="role-apply" onClick={onApply}>Apply</button>
        </div>
    );
};

export default RoleCard;