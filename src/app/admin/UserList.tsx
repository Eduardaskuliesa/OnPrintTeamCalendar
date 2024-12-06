/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/app/types/api";
import { deleteUser } from "../lib/actions/users";
import { toast } from "react-toastify";
import { useState } from "react";
import { UserActionButtons } from "./UserActionButtons";
import DeleteUserConfirmation, {
  ConfirmationMessage,
} from "../ui/DeleteUserConfirmation";
import UpdateUserForm from "./UpdateUserForm";

interface UserListProps {
  users: User[];
  onUserDeleted: (deletedEmail: string) => void;
  vacationRequests: any[];
}

export default function UserList({
  users,
  onUserDeleted,
}: UserListProps) {
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(users);

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleUpdate = (user: User) => {
    setUserToUpdate(user);
    setShowUpdateModal(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsersList((prevUsers) =>
      prevUsers.map((user) =>
        user.email === updatedUser.email ? updatedUser : user
      )
    );
    setShowUpdateModal(false);
    setUserToUpdate(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setDeletingEmail(userToDelete.email);
      setShowDeleteDialog(false);
      try {
        await deleteUser(userToDelete.email);
        toast.success("User deleted successfully");
        onUserDeleted(userToDelete.email);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      } finally {
        setUserToDelete(null);
        setDeletingEmail(null);
      }
    }
  };

  const confirmationMessage: ConfirmationMessage = {
    title: "Patvirtinkite ištrynimą",
    message: (
      <span>
        Ar tikrai norite ištrinti{" "}
        {userToDelete?.email && (
          <span className="font-bold">{userToDelete.email}</span>
        )}
        ?
      </span>
    ),
  };

  return (
    <>
      <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mano darbuotojai</h3>
          <div className="space-y-3">
            {usersList.map((user) => {
              return (
                <div
                  key={user.email}
                  className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: user.color }}
                    >
                      <span className="text-white font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-950">{user.name}</p>
                      <p className="text-sm text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  <UserActionButtons
                    onEdit={() => handleUpdate(user)}
                    onDelete={() => handleDelete(user)}
                    isDeleting={deletingEmail === user.email}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DeleteUserConfirmation
        isOpen={showDeleteDialog}
        onClose={() => {
          setUserToDelete(null);
          setShowDeleteDialog(false);
        }}
        onConfirm={confirmDelete}
        confirmationMessage={confirmationMessage}
      />

      {showUpdateModal && userToUpdate && (
        <UpdateUserForm
          user={userToUpdate}
          onUserUpdated={handleUserUpdated}
          onCancel={() => {
            setShowUpdateModal(false);
            setUserToUpdate(null);
          }}
        />
      )}
    </>
  );
}
