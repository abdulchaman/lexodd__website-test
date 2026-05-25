import React from 'react';
import './Button.css';

const Button = ({ variant, children, onClick, type = 'button' }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
