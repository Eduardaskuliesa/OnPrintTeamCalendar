/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { User } from "@/app/types/api";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";
import { useState} from "react";


export default function AdminPage({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const handleUserCreated = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleUserDeleted = (deletedEmail: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.email !== deletedEmail));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <CreateUserForm onUserCreated={handleUserCreated} />
      <UserList onUserDeleted={handleUserDeleted} users={users} />
    </div>
  );
}
