"use client";

import { User } from "@/app/types/api";
import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";
import VacationRequestList from "./VacationRequestList";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminTabs from "./AdminTabs";
import AddUserButton from "./AddUserButton";
import ActiveVacationsList from "./ActiveVacationsList";

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
  const [activeTab, setActiveTab] = useState<"dashboard" | "pending" | "active" | "settings">("dashboard");
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

  const pendingVacationsCount = initialVacations.filter(
    (r) => r.status === "PENDING"
  ).length;
  
  const activeVacationsCount = activeVacations.filter(
    (r) => r.status === "APPROVED"
  ).length;

  const handleNavigate = (tab: "dashboard" | "pending" | "active" | "settings") => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <UserList
            users={users}
            onUserDeleted={handleUserDeleted}
            onUserUpdated={handleUserUpdated}
          />
        );
      case "pending":
        return (
          <VacationRequestList
            initialRequests={initialVacations.filter(
              (v) => v.status === "PENDING"
            )}
          />
        );
      case "active":
        return (
          <ActiveVacationsList
            vacations={activeVacations.filter((v) => v.status === "APPROVED")}
          />
        );
      case "settings":
        return (
          <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50 p-6">
            <h3 className="text-lg font-semibold mb-4">Nustatymai</h3>
            <p className="text-gray-600">...</p>
          </div>
        );
    }
  };

  return (
    <div className="">
      <div className="py-4 max-w-5xl ml-[10%]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          <div className="flex items-center justify-between">
            <AdminTabs
              activeTab={activeTab}
              onTabChange={handleNavigate}
              pendingCount={pendingVacationsCount}
              activeCount={activeVacationsCount}
            />
            <AddUserButton onClick={() => setShowCreateModal(true)} />
          </div>
        </div>

        <AdminDashboardStats
          usersCount={users.length}
          pendingVacations={pendingVacationsCount}
          activeVacations={activeVacationsCount}
          onNavigate={handleNavigate}
        />

        <div className="max-w-5xl mt-6">
          {renderContent()}
        </div>

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