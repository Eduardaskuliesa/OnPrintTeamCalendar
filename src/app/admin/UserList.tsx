/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/app/types/api";
import { usersActions } from "../lib/actions/users";
import { toast } from "react-toastify";
import { useState } from "react";
import { UserActionButtons } from "./UserActionButtons";
import DeleteUserConfirmation, {
  ConfirmationMessage,
} from "../ui/DeleteUserConfirmation";
import UpdateUserForm from "./components/forms/UpdateUserForm";
import { ShieldCheck, CalendarDays } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface UserListProps {
  users: User[];
  onUserDeleted: (deletedEmail: string) => void;
  onUserUpdated: (updatedUser: User) => void;
  onNavigate: (tab: string, user: User) => void;
}

export default function UserList({
  users,
  onNavigate,
  onUserDeleted,
  onUserUpdated,
}: UserListProps) {
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const handleSettings = (user: User) => {
    onNavigate("settings", user);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleUpdate = (user: User) => {
    setUserToUpdate(user);
    setShowUpdateModal(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    onUserUpdated(updatedUser);
    setShowUpdateModal(false);
    setUserToUpdate(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setDeletingEmail(userToDelete.email);
      console.log(userToDelete);
      setShowDeleteDialog(false);
      try {
        await usersActions.deleteUser(userToDelete.userId);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User deleted successfully");
        onUserDeleted(userToDelete.userId);
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
            {users.map((user) => (
              <div
                key={user.email}
                className="flex items-center border-b border-slate-300 py-3 last:border-0"
              >
                <div className="flex items-center space-x-4 w-[250px]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: user.color }}
                  >
                    <span className="text-white font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-950">
                        {user.name} {user.surname}
                      </p>
                      {user.role === "ADMIN" && (
                        <ShieldCheck size={16} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex-1 ">
                  <div className="flex items-center text-gray-600">
                    <CalendarDays size={16} className="text-orange-500 mr-1" />
                    <span className="text-sm">
                      <span className="font-semibold">
                        {" "}
                        {Number(user.vacationDays) % 1 === 0
                          ? user.vacationDays
                          : Number(user.vacationDays).toFixed(3)}
                      </span>{" "}
                      d.
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserActionButtons
                    onSettings={() => handleSettings(user)}
                    onEdit={() => handleUpdate(user)}
                    onDelete={() => handleDelete(user)}
                    isDeleting={deletingEmail === user.email}
                    isAdmin={user.role === "ADMIN"}
                  />
                </div>
              </div>
            ))}
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
          isOpen={showUpdateModal}
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
