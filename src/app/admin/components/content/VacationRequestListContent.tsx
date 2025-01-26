"use client";
import { sendApprovedEmail } from "@/app/lib/actions/emails/sendApprovalEmail";
import { sendRejectedEmail } from "@/app/lib/actions/emails/sendRejectEmail";
import { getGlobalSettings } from "@/app/lib/actions/settings/global/getGlobalSettings";
import { vacationsAction } from "@/app/lib/actions/vacations";
import { User } from "@/app/types/api";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { Clock, RefreshCcw, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface Vacation {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  userEmail: string;
  endDate: string;
  userColor: string;
  totalVacationDays: number;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Props {
  initialRequests: Vacation[];
  onUserUpdated: (user: User) => void;
  users: User[];
}

export default function VacationRequestListContent({
  initialRequests,
  onUserUpdated,
  users,
}: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingApproveIds, setLoadingApproveIds] = useState(new Set());
  const [loadingRejectIds, setLoadingRejectIds] = useState(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Vacation | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | JSX.Element>("");

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    request: Vacation
  ) => {
    if (status === "APPROVED") {
      setLoadingApproveIds((prev) => new Set(prev).add(id));
    } else {
      setLoadingRejectIds((prev) => new Set(prev).add(id));
    }

    try {
      let result;
      if (status === "APPROVED") {
        result = await vacationsAction.updateVacationStatus(
          id,
          status,
          request.userId
        );
        const userToSendEmail = users.find((u) => u.userId === request.userId);
        if (!userToSendEmail) {
          return console.log("User not exist email will not be send");
        }

        console.log(userToSendEmail);

        const globalSettingsData = await getGlobalSettings();

        if (result.success) {
          await sendApprovedEmail({
            sendTo: globalSettingsData.data?.emails
              .accountant as GlobalSettingsType["emails"]["accountant"],
            name: request.userName,
            founderNameSurname:
              globalSettingsData.data?.emails.founderNameSurname,
            surname: userToSendEmail.surname,
            jobTitle: userToSendEmail.jobTitle,
            createdAt: request.createdAt.slice(0, 10),
            startDate: request.startDate,
            endDate: request.endDate,
          });
        }
      } else {
        const user = users.find((u) => u.userId === request.userId);
        if (user) {
          const updatedUser = {
            ...user,
            vacationDays: user.vacationDays + request.totalVacationDays,
          };
          onUserUpdated(updatedUser);
        }

        result = await vacationsAction.deleteVacation(id, request.userId);

        if (result.success) {
          await sendRejectedEmail({
            to: request.userEmail,
            name: request.userName,
            startDate: request.startDate,
            endDate: request.endDate,
          });
        }
      }

      if (result.success) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        toast.success(
          <span>
            <strong>{request.userEmail}</strong> atostogos buvo{" "}
            {status === "APPROVED" ? "patvirtintos" : "atmestos"}
          </span>
        );
      } else {
        if (status === "REJECTED") {
          const user = users.find((u) => u.userId === request.userId);
          if (user) {
            onUserUpdated(user);
          }
        }
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`${error} Klaida`);
    } finally {
      if (status === "APPROVED") {
        setLoadingApproveIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        setLoadingRejectIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }
  };

  const handleRejectClick = (request: Vacation) => {
    setSelectedRequest(request);
    setDeleteMessage(
      <>
        Ar tikrai norite atmesti prašymą? <strong>{request.userName}</strong>{" "}
        atostogos bus ištrintos iš kalendoriaus
      </>
    );
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRequest) {
      await handleStatusUpdate(selectedRequest.id, "REJECTED", selectedRequest);
      setDeleteModalOpen(false);
      setSelectedRequest(null);
    }
  };

  return (
    <>
      <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
        <div className="p-2 sm:p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4 px-2 py-2 sm:px-0 sm:py-0">
            Atostogų prašymai
          </h3>
          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                Nera jokiu prašymu
              </p>
            ) : (
              requests.map((request) => {
                const daysDiff =
                  Math.ceil(
                    (new Date(request.endDate).getTime() -
                      new Date(request.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1;

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {request.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{request.userName}</p>
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                            Laukiama
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Nuo{" "}
                            <span className="font-semibold">
                              {new Date(request.startDate).toLocaleDateString(
                                "lt-LT"
                              )}{" "}
                            </span>
                            iki{" "}
                            <span className="font-semibold">
                              {new Date(request.endDate).toLocaleDateString(
                                "lt-LT"
                              )}
                            </span>
                          </span>
                          <div className="hidden md:flex items-center bg-blue-100 text-db px-2 py-0.5 rounded-full">
                            <Clock size={14} className="mr-1" />
                            <span className="text-sm font-medium">
                              {daysDiff} d.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id, "APPROVED", request)
                        }
                        disabled={
                          loadingApproveIds.has(request.id) ||
                          loadingRejectIds.has(request.id)
                        }
                        className="flex items-center px-2 md:px-4 py-1 md:py-2 bg-emerald-200 text-green-800 rounded-md text-sm shadow-sm hover:bg-emerald-300 transition-colors disabled:opacity-50"
                      >
                        {loadingApproveIds.has(request.id) ? (
                          <div className="flex items-center">
                            <RefreshCcw className="w-3 h-3 mr-2 animate-spin" />
                            <span className="hidden md:inline">Tvirtinama</span>
                          </div>
                        ) : (
                          <>
                            <Check className="w-4 h-4 md:hidden" />
                            <span className="hidden md:inline">
                              Patvirtinti
                            </span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectClick(request)}
                        disabled={
                          loadingRejectIds.has(request.id) ||
                          loadingApproveIds.has(request.id)
                        }
                        className="flex items-center px-2 md:px-4 py-2 md:py-2 bg-rose-200 text-red-800 rounded-md text-sm shadow-sm hover:bg-rose-300 transition-colors disabled:opacity-50"
                      >
                        {loadingRejectIds.has(request.id) ? (
                          <div className="flex items-center">
                            <RefreshCcw className="w-3 h-3 mr-2 animate-spin" />
                            <span className="hidden md:inline">Atmetama</span>
                          </div>
                        ) : (
                          <>
                            <X className="w-4 h-4 md:hidden" />
                            <span className="hidden md:inline">Atmesti</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={
          selectedRequest ? loadingRejectIds.has(selectedRequest.id) : false
        }
        message={deleteMessage}
      />
    </>
  );
}
