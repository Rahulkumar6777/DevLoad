import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`bg-gray-800 text-white p-6 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}
