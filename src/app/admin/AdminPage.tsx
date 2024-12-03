/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/app/types/api";
import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import UserList from "./UserList";
import VacationRequestList from "./VacationRequestList";
import { Users, Calendar, Plus, Palmtree } from "lucide-react";

interface VacationRequest {
  id: string;
  userName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminPage({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(
    initialUsers.filter((user) => user.role !== "ADMIN")
  );
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests">(
    "dashboard"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  
  const [vacationRequests] = useState<VacationRequest[]>([
    {
      id: "1",
      userName: "John Doe",
      startDate: "2024-12-24",
      endDate: "2024-12-31",
      status: "pending",
    },
    {
      id: "2",
      userName: "Jane Smith",
      startDate: "2024-12-25",
      endDate: "2024-12-28",
      status: "pending",
    },
  ]);

  const handleUserCreated = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setShowCreateModal(false);
  };

  const handleUserDeleted = (deletedEmail: string) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.email !== deletedEmail)
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-semibold">Vartotojai</h3>
                  <Users className="text-blue-500" size={20} />
                </div>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-semibold">
                    Laukia patvirtinimo
                  </h3>
                  <Calendar className="text-orange-500" size={20} />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {
                    vacationRequests.filter((r) => r.status === "pending")
                      .length
                  }
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-semibold">Atostogauja</h3>
                  <Palmtree className="text-green-500" size={20} />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {
                    vacationRequests.filter((r) => r.status === "approved")
                      .length
                  }
                </p>
              </div>
            </div>

       
            <UserList
              users={users}
              onUserDeleted={handleUserDeleted}
              vacationRequests={vacationRequests}
            />
          </div>
        );
      case "requests":
        return (
          <div className="max-w-5xl">
            <VacationRequestList requests={vacationRequests} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="py-4 max-w-5xl ml-[10%]">
       
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

      
        <div className="mb-6 flex justify-between items-center">
          <div className="inline-flex rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-2 shadow-sm text-sm font-medium rounded-l-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-lcoffe text-950"
                  : "bg-white text-gray-700 hover:text-gray-950"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg border-l transition-colors ${
                activeTab === "requests"
                  ? "bg-lcoffe text-950"
                  : "bg-white text-gray-700 hover:text-950"
              }`}
            >
              Užklausos
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex group items-center space-x-2 px-4 py-2 shadow-sm bg-lcoffe text-gray-950 rounded-md hover:bg-dcoffe transition-colors"
          >
            <Plus
              size={20}
              className={`transform text-black transition-transform group-hover:rotate-90`}
                
        
            />
            <span>Pridėti vartotoją</span>
          </button>
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
