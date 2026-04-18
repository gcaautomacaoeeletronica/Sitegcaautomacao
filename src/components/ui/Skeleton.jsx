import React from 'react';

const Skeleton = ({ className, width, height, rounded = 'rounded-lg' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${rounded} ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px' 
      }}
    />
  );
};

export default Skeleton;
