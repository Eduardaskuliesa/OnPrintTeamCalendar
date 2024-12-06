import React from 'react';

const CalendarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
    </div>
    <div className="grid grid-cols-7 mb-1">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1 animate-pulse">
      {[...Array(35)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  </div>
);

export default CalendarSkeleton;