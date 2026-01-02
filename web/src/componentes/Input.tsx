import React from 'react';
import './Input.css';

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export const Input: React.FC<InputProps> = ({ placeholder, value, onChange, type = 'text', onKeyPress }) => {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
  );
};
