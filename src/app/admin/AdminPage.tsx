"use client";
import { User, Vacation } from "@/app/types/api";
import { lazy, useState } from "react";
import CreateUserForm from "./components/forms/CreateUserForm";
import UserList from "./UserList";
import VacationRequestList from "./VacationRequestList";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminTabs from "./AdminTabs";
import AddUserButton from "./AddUserButton";
import ActiveVacationsList from "./ActiveVacationsList";
const GlobalSettings = lazy(() => import("./GlobalSettings"));

export default function AdminPage({
  initialUsers,
  initialVacations,
}: {
  initialUsers: User[];
  initialVacations: Vacation[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "pending" | "active" | "settings"
  >("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserCreated = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowCreateModal(false);
  };

  const handleUserDeleted = (deleteUser: string) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.userId !== deleteUser)
    );
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );
  };

  const pendingVacationsCount = initialVacations.filter(
    (r) => r.status === "PENDING"
  ).length;

  const activeVacationsCount = initialVacations.filter((vacation) => {
    if (vacation.status !== "APPROVED") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(vacation.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(vacation.endDate);
    endDate.setHours(0, 0, 0, 0);

    return today >= startDate && today <= endDate;
  }).length;

  const handleNavigate = (tab: string, user?: User) => {
    if (activeTab === "settings") {
      setSelectedUser(null);
    }
    setActiveTab(tab as "dashboard" | "pending" | "active" | "settings");
    if (user) {
      setSelectedUser(user);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <UserList
            onNavigate={handleNavigate}
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
            onUserUpdated={handleUserUpdated}
            users={users}
          />
        );
      case "active":
        return (
          <ActiveVacationsList
            vacations={initialVacations.filter((v) => v.status === "APPROVED")}
          />
        );
      case "settings":
        return (
          <GlobalSettings
            users={users}
            selectedUser={selectedUser}
            onUserUpdated={handleUserUpdated}
          />
        );
    }
  };

  return (
    <div className="">
      <div className="py-4 min-w-[300px] max-w-5xl lg:ml-[5%]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Dashboard
          </h1>

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

        {activeTab !== "settings" && (
          <AdminDashboardStats
            usersCount={users.length}
            pendingVacations={pendingVacationsCount}
            activeVacations={activeVacationsCount}
            onNavigate={handleNavigate}
          />
        )}

        <div className="max-w-5xl mt-6">{renderContent()}</div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
              <CreateUserForm
                isOpen={showCreateModal}
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
