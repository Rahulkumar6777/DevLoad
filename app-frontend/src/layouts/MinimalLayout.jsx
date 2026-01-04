import React from 'react';

const MinimalLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
};

export default MinimalLayout;