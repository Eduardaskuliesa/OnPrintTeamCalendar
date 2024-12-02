import React from 'react';

const CalendarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-10 bg-gray-200 rounded w-32" />
      <div className="h-10 bg-gray-200 rounded w-48" />
      <div className="h-10 bg-gray-200 rounded w-64" />
    </div>
    <div className="grid grid-cols-7 mb-1">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200" />
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {[...Array(35)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export default CalendarSkeleton;