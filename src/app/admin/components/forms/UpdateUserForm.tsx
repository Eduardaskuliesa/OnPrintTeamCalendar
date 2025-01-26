"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { updateUser } from "../../../lib/actions/users/updateUser";
import { toast } from "react-toastify";
import type { User } from "../../../types/api";
import { Button } from "@/components/ui/button";
import SettingsToggle from "../../SettingsToggleUpdateForm";
import { useQueryClient } from "@tanstack/react-query";
import { BirthDayInput } from "./BirthdayInput";
import { ColorInput } from "./ColorInput";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { NameSurnameInput } from "./NameSurnameInput";
import { VacationDaysBalanceInput } from "./VacationDaysBalanceInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFreshUser } from "../../../lib/actions/users/hooks/useGetFreshUser";
import { RoleJobTitleInput } from "./RoleJobTitleInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface FormData {
  name: string;
  surname: string;
  email: string;
  color: string;
  useGlobal: boolean;
  password: string;
  vacationDays: number;
  updateAmount: number;
  birthday: string;
  role: "USER" | "ADMIN";
  jobTitle: string;
}

interface UpdateUserFormProps {
  userId: string;
  isOpen: boolean;
  onUserUpdated: (updatedUser: User) => void;
  onCancel: () => void;
}

export default function UpdateUserForm({
  userId,
  onUserUpdated,
  onCancel,
  isOpen,
}: UpdateUserFormProps) {
  const { data: user, isFetching } = useGetFreshUser(userId);
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    color: "",
    useGlobal: false,
    password: "",
    vacationDays: 0,
    updateAmount: 0.05479452,
    birthday: "",
    role: "USER",
    jobTitle: "",
  });

  useEffect(() => {
    console.log("User data:", user);
    console.log("userName", user?.name);
    console.log("User role:", user?.role);
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role === "ADMIN" ? "ADMIN" : "USER",
        name: user.name,
        surname: user.surname || "",
        email: user.email,
        color: user.color,
        useGlobal: user.useGlobal,
        password: "",
        vacationDays: user.vacationDays,
        updateAmount: user.updateAmount || 0.05479452,
        birthday: user.birthday || "",
        jobTitle: user.jobTitle || "",
      });
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent<Element>) {
    e.preventDefault();
    if (!formData || !user) return;

    const hasChanges =
      formData.name !== user.name ||
      formData.surname !== user.surname ||
      formData.email !== user.email ||
      formData.color !== user.color ||
      formData.vacationDays !== user.vacationDays ||
      formData.updateAmount !== user.updateAmount ||
      formData.useGlobal !== user.useGlobal ||
      formData.password !== "" ||
      formData.birthday !== user.birthday ||
      formData.role !== user.role ||
      formData.jobTitle !== user.jobTitle;

    if (!hasChanges) {
      onCancel();
      toast.info("Nepadarete jokių pakeitimų");
      return;
    }

    try {
      setLoading(true);
      const result = await updateUser(userId, formData);
      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (result.success) {
        toast.success("Vartotojas sėkmingai atnaujintas");
        const updatedUser = {
          ...user,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        onUserUpdated(updatedUser);
        onCancel(); // Close dialog after successful update
      } else {
        toast.error(result.error || "Nepavyko atnaujinti vartotojo");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const formatVacationDays = (value: number) => {
    return value % 1 === 0 ? Number(value) : Number(Number(value).toFixed(10));
  };

  console.log(user?.role);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Atnaujinti Vartotoją</DialogTitle>
          <DialogClose onClick={onCancel} />
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`min-w-[250px] ${isFetching ? "space-y-8" : "space-y-4"}`}
        >
          {isFetching ? (
            <>
              <Skeleton className="h-8 w-1/2 " />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4 ">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4 ">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4 ">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </>
          ) : (
            <>
              <SettingsToggle
                enabled={formData.useGlobal}
                onToggle={(value) =>
                  setFormData((prev) => ({ ...prev, useGlobal: value }))
                }
              />

              <NameSurnameInput
                name={formData.name}
                surname={formData.surname}
                onChange={(field, value) =>
                  setFormData((prev) => ({ ...prev, [field]: value }))
                }
              />

              <EmailPasswordInput
                email={formData.email}
                password={formData.password}
                onChange={(field, value) =>
                  setFormData((prev) => ({ ...prev, [field]: value }))
                }
                passwordRequired={false}
                passwordPlaceholder="Palikite tuščią, jei nekeičiate"
              />

              <VacationDaysBalanceInput
                vacationDays={formatVacationDays(formData.vacationDays)}
                updateAmount={formData.updateAmount}
                onChange={(field, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field]: formatVacationDays(Number(value)),
                  }))
                }
              />
              <div className="grid grid-cols-1 xsm:grid-cols-2 gap-4">
                <ColorInput
                  color={formData.color}
                  onColorSelect={(color) =>
                    setFormData((prev) => ({ ...prev, color }))
                  }
                  showPicker={showColorPicker}
                  onTogglePicker={setShowColorPicker}
                />

                <BirthDayInput
                  value={formData.birthday}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, birthday: value }))
                  }
                />
              </div>
              <RoleJobTitleInput
                jobTitle={formData.jobTitle}
                role={formData.role}
                onChange={(field, value) =>
                  setFormData((prev) => ({ ...prev, [field]: value }))
                }
              />
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="h-10 rounded-lg hover:bg-gray-200"
            >
              Atšaukti
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData}
              className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
            >
              {loading ? "Atnaujinama..." : "Atnaujinti"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
