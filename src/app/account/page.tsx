"use client";
import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();
  console.log('data', session)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <p className="font-medium">
            {session?.user?.name || "Not available"}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <p className="font-medium">
            {session?.user?.email || "Not available"}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <p className="font-medium">
            {session?.user.color || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}
