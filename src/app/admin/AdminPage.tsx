"use client";

import { User } from "@/app/types/api";
import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";
import VacationRequestList from "./VacationRequestList";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminTabs from "./AdminTabs";
import AddUserButton from "./AddUserButton";

export interface Vacation {
  id: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminPage({
  initialUsers,
  initialVacations,
  activeVacations,
}: {
  initialUsers: User[];
  initialVacations: Vacation[];
  activeVacations: Vacation[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests">(
    "dashboard"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleUserCreated = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowCreateModal(false);
  };

  const handleUserDeleted = (deletedEmail: string) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.email !== deletedEmail)
    );
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === updatedUser.email ? updatedUser : user
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="max-w-5xl">
            <AdminDashboardStats
              usersCount={users.length}
              pendingVacations={
                initialVacations.filter((r) => r.status === "PENDING").length
              }
              activeVacations={
                activeVacations.filter((r) => r.status === "APPROVED").length
              }
            />
            <UserList
              users={users}
              onUserDeleted={handleUserDeleted}
              onUserUpdated={handleUserUpdated}
            />
          </div>
        );
      case "requests":
        return (
          <div className="max-w-5xl">
            <VacationRequestList
              initialRequests={initialVacations.filter(
                (v) => v.status === "PENDING"
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className="">
      <div className="py-4 max-w-5xl ml-[10%]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <AddUserButton onClick={() => setShowCreateModal(true)} />
        </div>

        {renderContent()}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
              <CreateUserForm
                onUserCreated={handleUserCreated}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
