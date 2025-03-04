import { Search } from "lucide-react";

const PageHeaderSkeleton = () => (
  <div className="mb-8">
    <div className="text-2xl font-bold mb-6 flex items-center">
      <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse"></div>
    </div>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <div className="h-10 bg-gray-200 rounded-md w-48 animate-pulse"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ItemsSkeleton = () => {
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

const PageSkeleton = () => {
  return (
    <div className="p-6 max-w-6xl">
      <PageHeaderSkeleton />
      <ItemsSkeleton />
    </div>
  );
};

export { PageHeaderSkeleton, ItemsSkeleton, PageSkeleton };
