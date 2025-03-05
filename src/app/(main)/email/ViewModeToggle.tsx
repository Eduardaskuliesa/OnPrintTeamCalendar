import React from 'react';

const ViewModeToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex space-x-2 mb-4">
            <button
                onClick={() => setViewMode('desktop')}
                className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'desktop'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
            >
                Desktop
            </button>
            <button
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'mobile'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
            >
                Mobile
            </button>
        </div>
    );
};

export default ViewModeToggle;