import React from 'react';

interface BankIconProps {
  iconUrl: string;
  bankName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BankIcon: React.FC<BankIconProps> = ({
  iconUrl,
  bankName,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={iconUrl}
        alt={bankName}
        className={`${sizeClasses[size]} rounded-lg bg-white p-0.5 object-contain`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default BankIcon;
