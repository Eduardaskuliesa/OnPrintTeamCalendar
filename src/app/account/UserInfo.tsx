"use client";

import { User } from "../types/api";

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

interface UserInfoProps {
  userData: User;
}
const UserInfo = ({ userData }: UserInfoProps) => {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
        style={{ backgroundColor: userData.color || "#000" }}
      >
        {userData.name[0].toUpperCase()}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
        <p className="text-gray-600">{userData.email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
