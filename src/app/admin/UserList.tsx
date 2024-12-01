/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/app/types/api";
import { deleteUser } from "../lib/actions/users";
import { toast } from "react-toastify";
import { useState } from "react";

interface UserListProps {
  users: User[];
  onUserDeleted: () => Promise<void>;
}

export default function UserList({ users, onUserDeleted }: UserListProps) {
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const handleDelete = async (email: string) => {
    try {
      setDeletingEmail(email);
      await deleteUser(email);
      toast.success("User deleted successfully");
      await onUserDeleted();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeletingEmail(null);
    }
  };

  // Filter out users with "ADMIN" role
  const filteredUsers = users.filter((user) => user.role !== "ADMIN");

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Color
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.email}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className="w-6 h-6 rounded-full mr-2"
                    style={{ backgroundColor: user.color }}
                  />
                  {user.color}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(user.email)}
                  disabled={deletingEmail === user.email}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingEmail === user.email ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}