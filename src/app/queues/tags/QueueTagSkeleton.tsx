const QueueTagSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-slate-50 border-blue-50 border-2 rounded-lg shadow-md animate-pulse"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueTagSkeleton;
