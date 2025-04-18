/* eslint-disable react-hooks/exhaustive-deps */
// components/forms/AdminVacationForm/index.tsx
"use client";
import React, { useRef } from "react";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/types/api";
import { usersActions } from "@/app/lib/actions/users";
import { bookAsAdminVacation } from "@/app/lib/actions/vacations/bookVacationAsAdmin";
import { UserSelection, GapSelection, DateSelection } from "../selectors";
import SubmitButton from "../buttons/SubmitButton";
import { Event, VacationData } from "@/app/types/event";
import { createVacationEvents } from "@/app/utils/eventUtils";
import { formatNumber } from "@/app/utils/formatters";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

interface AdminVacationFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onVacationCreated?: (events: Event[]) => void;
}

const AdminVacationForm = ({
  isOpen,
  onClose,
  initialStartDate,
  initialEndDate,
  onVacationCreated,
}: AdminVacationFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    startDate: "",
    endDate: "",
    createGap: false,
    gapEndDate: "",
  });

  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await usersActions.getUsers();
      if (!result.data) {
        throw new Error("Failed to fetch users");
      }
      return result.data;
    },
    enabled: isOpen,
    staleTime: 24 * 60 * 60 * 1000,
  });

  React.useEffect(() => {
    if (initialStartDate) {
      const start = new Date(initialStartDate);
      start.setDate(start.getDate() + 1);

      const end = initialEndDate
        ? new Date(initialEndDate)
        : new Date(initialStartDate);
      end.setDate(end.getDate());

      setFormData({
        ...formData,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      });
    }
  }, [initialStartDate, initialEndDate]);

  const handleClose = () => {
    setFormData({
      startDate: "",
      endDate: "",
      createGap: false,
      gapEndDate: "",
    });
    setError("");
    setLoading(false);
    setSelectedUserId("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError("Pasirinkti vartotoją");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const selectedUser = users?.find((u) => u.userId === selectedUserId);
      if (!selectedUser) {
        throw new Error("Pasirenktas vartotojas nerestas");
      }

      const result = await bookAsAdminVacation(formData, selectedUser as User);

      if (result.success && result.data) {
        const events = createVacationEvents(result.data as VacationData);
        onVacationCreated?.(events);
        toast.success("Atostogos užregistruotos");
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
        queryClient.invalidateQueries({
          queryKey: ["vacations", result.data.userId],
        });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        handleClose();
        return;
      }

      setError(result.error || "Failed to register vacation");
      toast.error("Failed to register vacation");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      toast.error("System error");
    } finally {
      setLoading(false);
    }
  };

  useKeyboardShortcuts(isOpen, handleClose, undefined);

  const selectedUser = users?.find((u) => u.userId === selectedUserId);

  return (
    <div
      className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
        isOpen
          ? "bg-black/50 opacity-100 visible"
          : "bg-black/0 opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md relative 
          transition-all duration-200 ease-out 
          motion-safe:transition-[transform,opacity] 
          motion-safe:duration-300
          motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1) 
          ${
            isOpen
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-vdcoffe" />
            <h2 className="text-xl font-semibold text-gray-900">
              Registruoti kaip Admin
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 p-0.5 hover:bg-gray-200 rounded-sm hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          <UserSelection
            selectedUserId={selectedUserId}
            onUserChange={(userId) => {
              setSelectedUserId(userId);
              if (error === "Please select a user") {
                setError("");
              }
            }}
            users={users as User[]}
            isLoadingUsers={isLoadingUsers}
          />

          <DateSelection
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) =>
              setFormData({ ...formData, startDate: date })
            }
            onEndDateChange={(date) =>
              setFormData({ ...formData, endDate: date })
            }
            disabled={loading}
            required={true}
          />

          {formData.endDate && (
            <GapSelection
              createGap={formData.createGap}
              onCreateGapChange={(value) =>
                setFormData({ ...formData, createGap: value, gapEndDate: "" })
              }
              gapEndDate={formData.gapEndDate}
              onGapEndDateChange={(date) =>
                setFormData({ ...formData, gapEndDate: date })
              }
              baseEndDate={formData.endDate}
              disabled={loading}
            />
          )}

          {selectedUser && (
            <div className="text-sm text-gray-500">
              Turimos dienos: {formatNumber(selectedUser.vacationDays)}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <SubmitButton
              loading={loading}
              disabled={!selectedUserId}
              text="Registruoti"
              loadingText="Registruojama..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVacationForm;
