import React from 'react';
import './Button.css';

const Button = ({ variant, children, onClick }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;