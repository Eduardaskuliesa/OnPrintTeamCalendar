export function UserPageSkeleton() {
  return (
    <div className="py-4 max-w-6xl ml-[10%]">
      <UserSkeleton />
      <UserStatsSkeleton />
    </div>
  );
}

export function UserSkeleton() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function UserStatsSkeleton() {
  return (
    <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}
