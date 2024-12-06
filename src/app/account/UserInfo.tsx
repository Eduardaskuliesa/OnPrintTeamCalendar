"use client";
import { useSession } from "next-auth/react";

export const UserSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 mb-8 ">
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

const UserInfo = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <UserSkeleton></UserSkeleton>;
  }

  return (
    <div className="flex items-center space-x-4 mb-8">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
        style={{ backgroundColor: session?.user?.color || "#000" }}
      >
        {session?.user?.name?.[0].toUpperCase()}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {session?.user?.name}
        </h1>
        <p className="text-gray-600">{session?.user?.email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
