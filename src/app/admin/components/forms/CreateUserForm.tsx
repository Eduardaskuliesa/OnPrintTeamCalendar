"use client";
import { useState, useRef, FormEvent } from "react";
import { usersActions } from "../../../lib/actions/users";
import { toast } from "react-toastify";
import { User } from "../../../types/api";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { NameSurnameInput } from "./NameSurnameInput";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { ColorInput } from "./ColorInput";
import { VacationDaysBalanceInput } from "./VacationDaysBalanceInput";
import { BirthDayInput } from "./BirthdayInput";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";
import { sendWelcomeEmail } from "@/app/lib/actions/emails/sendWelcomeEmail";

interface CreateUserFormProps {
  onUserCreated: (newUser: User) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  color: string;
  role?: string;
  vacationDays: number;
  updateAmount: number;
  birthday?: string;
}

export default function CreateUserForm({
  onUserCreated,
  onCancel,
  isOpen,
}: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
    vacationDays: 20,
    updateAmount: 0.05479452,
    color: "#7986cb",
    birthday: "",
  });

  async function handleSubmit(e: FormEvent<Element>) {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await usersActions.createUser(formData);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const welcomeEmailData = {
        to: formData.email,
        name: formData.name,
        surname: formData.surname,
        password: formData.password,
      };

      await sendWelcomeEmail(welcomeEmailData);
      onUserCreated(response.user);
      toast.success("Vartotojas sėkmingai sukurtas");
    } catch (error: any) {
      toast.error("Šis elpaštas jau yra užimtas");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardShortcuts(isOpen, onCancel, undefined, formRef);

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Naujas Vartotojas
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-4 w-4 " />
        </Button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 min-w-[250px] sm:space-y-5">
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
        />

        <VacationDaysBalanceInput
          vacationDays={formData.vacationDays}
          updateAmount={formData.updateAmount}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            disabled={loading}
            className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
          >
            {loading ? "Kuriama..." : "Sukurti"}
          </Button>
        </div>
      </form>
    </div>
  );
}
