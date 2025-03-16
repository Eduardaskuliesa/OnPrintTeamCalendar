"use client";
import { tempalteActions } from "@/app/lib/actions/templates";
import { Template } from "@/app/types/emailTemplates";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { Loader, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface EmailTemplateItemProps {
  template: Template;
}

const EmailTemplateItem = ({ template }: EmailTemplateItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteItem = async () => {
    try {
      setIsLoading(true);
      setDeleteError(null);

      const response = await tempalteActions.deleteTemplate(
        template.id,
        template.templateName
      );

      if (response.success) {
        setIsDeleteModalOpen(false);
        toast.success("Šablonas ištryntas");
        await tempalteActions.getTemplates();
      } else {
        setDeleteError("Nepavyko ištrinti šablono");
        toast.error("Nepavyko ištrinti šablono");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        key={template.id}
        className="p-4 bg-slate-50 border-blue-50 border-2 shadow-md rounded-md"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">{template.templateName}</h2>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/email/${template.templateName}?id=${template.id}`}
              className="px-3 py-1 bg-dcoffe text-db rounded hover:bg-dcoffe/80 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3 py-1  bg-red-50 text-red-800 rounded hover:bg-red-100 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2"></Trash2>
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => !isLoading && setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        loading={isLoading}
        message={
          <>
            <p>{`Ar tikrai norite ištrinti šabloną "${template.templateName}"?`}</p>
            {deleteError && (
              <p className="mt-2 text-red-500 text-sm">{deleteError}</p>
            )}
          </>
        }
      />
    </>
  );
};

export default EmailTemplateItem;
