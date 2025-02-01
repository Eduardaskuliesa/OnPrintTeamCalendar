import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { usersActions } from "@/app/lib/actions/users";
import { vacationsAction } from "@/app/lib/actions/vacations";
import { getGlobalSettings } from "../lib/actions/settings/global/getGlobalSettings";
import { PdfData, storePDFtoS3 } from "../lib/actions/s3Actions/storePDFtoS3";
import { Vacation } from "../types/api";

export const useVacationPdf = () => {
  const [generatingPdfIds, setGeneratingPdfIds] = useState<Set<string>>(
    new Set()
  );
  const queryClient = useQueryClient();

  const handlePdf = async (vacation: Vacation) => {
    if (vacation?.pdfUrl) {
      window.open(vacation.pdfUrl, "_blank");
      return;
    }

    setGeneratingPdfIds((prev) => new Set([...prev, vacation.id]));

    try {
      const [userData, founderName] = await Promise.all([
        usersActions.getFreshUser(vacation.userId),
        getGlobalSettings(),
      ]);

      const pdfData: PdfData = {
        name: userData.data.name,
        surname: userData.data.surname,
        vacationId: vacation.id,
        startDate: vacation.startDate,
        endDate: vacation.endDate,
        jobTitle: userData.data.jobTitle,
        founderNameSurname: founderName?.data?.emails.founderNameSurname,
      };

      const vacationPdf = await storePDFtoS3(pdfData);

      await vacationsAction.updateVacationPdfUrl(
        vacation.id,
        vacationPdf.url,
        vacation.userId
      );

      queryClient.invalidateQueries({ queryKey: ["vacations"] });
      queryClient.invalidateQueries({
        queryKey: [`vacations-${vacation.userId}`],
      });

      window.open(vacationPdf.url, "_blank");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Nepavyko sugeneruoti PDF");
    } finally {
      setGeneratingPdfIds((prev) => {
        const next = new Set(prev);
        next.delete(vacation.id);
        return next;
      });
    }
  };

  const isGeneratingPdf = (vacationId: string) =>
    generatingPdfIds.has(vacationId);

  return {
    handlePdf,
    isGeneratingPdf,
  };
};
