/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { User } from "@/app/types/api";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";
import { useState, useCallback } from "react";
import { getUsers } from "../lib/actions/users"; // Your server action
import { toast } from "react-toastify";

export default function AdminPage({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const refreshUsers = useCallback(async () => {
    try {
      const { data } = await getUsers();
      setUsers(data as User[]);
    } catch (error: any) {
      toast.error("Failed to refresh users list", error);
    }
  }, []);

  const handleUserCreated = async () => {
    await refreshUsers();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <CreateUserForm onUserCreated={handleUserCreated} />
      <UserList onUserDeleted={refreshUsers} users={users} />
    </div>
  );
}
