import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Trash2 } from "lucide-react";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { useUpdateEmails } from "@/app/lib/actions/settings/global/hooks";
import { toast } from "react-toastify";

interface EmailSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: GlobalSettingsType["emails"];
}

export function UpdateAdminModal({
  isOpen,
  onClose,
  initialData,
}: EmailSettingsModalProps) {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [accountantEmail, setAccountantEmail] = useState("");
  const [founderNameSurname, setFounderNameSurname] = useState("");
  const [initialAdminEmails, setInitialAdminEmails] = useState<string[]>([]);
  const [initialAccountantEmail, setInitialAccountantEmail] = useState("");
  const [initialFounderNameSurname, setInitialFounderNameSurname] =
    useState("");
  const { mutate: updateEmails, isPending } = useUpdateEmails();

  useEffect(() => {
    if (isOpen && initialData) {
      const adminData = initialData.admin.length > 0 ? initialData.admin : [""];
      setAdminEmails(adminData);
      setAccountantEmail(initialData.accountant || "");
      setFounderNameSurname(initialData.founderNameSurname || "");
      setInitialAdminEmails(adminData);
      setInitialAccountantEmail(initialData.accountant || "");
      setInitialFounderNameSurname(initialData.founderNameSurname || "");
    }
  }, [isOpen, initialData]);

  const handleAddAdminEmail = () => {
    if (adminEmails.length < 2) {
      setAdminEmails([...adminEmails, ""]);
    }
  };

  const handleRemoveAdminEmail = (index: number) => {
    if (adminEmails.length > 1) {
      setAdminEmails(adminEmails.filter((_, i) => i !== index));
    }
  };

  const handleAdminEmailChange = (index: number, value: string) => {
    const newEmails = [...adminEmails];
    newEmails[index] = value;
    setAdminEmails(newEmails);
  };

  const handleSave = () => {
    const filteredAdminEmails = adminEmails.filter(
      (email) => email.trim() !== ""
    );
    if (filteredAdminEmails.length === 0) {
      filteredAdminEmails.push("");
    }

    // Check if data has changed
    const hasChanges =
      JSON.stringify(filteredAdminEmails) !==
        JSON.stringify(initialAdminEmails) ||
      accountantEmail !== initialAccountantEmail ||
      founderNameSurname !== initialFounderNameSurname;

    if (!hasChanges) {
      toast.info("Nepadarėte jokių pakeitimų");
      onClose();
      return;
    }

    updateEmails(
      {
        admin: filteredAdminEmails,
        accountant: accountantEmail,
        founderNameSurname: founderNameSurname,
      },
      {
        onSuccess: () => {
          toast.success("Nustatymai buvo sėkmingai pakeisti");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby="Nustatykite buhalterės ir admin elpaštą"
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-db">El. pašto Nustatymai</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-db">
              Administratorių El. paštai
            </label>
            {adminEmails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={email}
                  onChange={(e) =>
                    handleAdminEmailChange(index, e.target.value)
                  }
                  placeholder="admin@pavyzdys.lt"
                  type="email"
                  disabled={isPending}
                  className="border-lcoffe focus:ring-dcoffe"
                />
                {index !== 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAdminEmail(index)}
                    disabled={isPending}
                    className="bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-900 transition-colors duration-200 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 bg-lcoffe hover:bg-dcoffe text-db hover:text-gray-900 transition-colors duration-200"
                onClick={handleAddAdminEmail}
                disabled={isPending || adminEmails.length >= 2}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {adminEmails.length >= 2 && (
                <span className="text-sm text-db ml-2">Max 2</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-db">
              Buhalterės(-io) El. paštas
            </label>
            <Input
              value={accountantEmail}
              onChange={(e) => setAccountantEmail(e.target.value)}
              placeholder="buhalteris@pavyzdys.lt"
              type="email"
              disabled={isPending}
              className="border-lcoffe focus:ring-dcoffe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-db">
              Direktoriaus(-ės) Vardas Pavardė
            </label>
            <Input
              value={founderNameSurname}
              onChange={(e) => setFounderNameSurname(e.target.value)}
              placeholder="Vardas Pavardė"
              type="text"
              disabled={isPending}
              className="border-lcoffe focus:ring-dcoffe"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-lcoffe hover:bg-dcoffe text-db transition-colors duration-200"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  Saugojama...
                </div>
              ) : (
                "Išsaugoti"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
