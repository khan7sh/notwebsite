import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center" role="status">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 