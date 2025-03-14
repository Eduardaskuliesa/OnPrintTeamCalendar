import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock, Check } from "lucide-react";
import { Order } from "@/app/types/orderApi";
import { ordersActions } from "@/app/lib/actions/orders";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "./OrderCard";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { toast } from "react-toastify";

interface RemoveTagModalProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RemoveTagModal: React.FC<RemoveTagModalProps> = ({
  order,
  isOpen,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const handleRemoveTags = async () => {
    if (selectedJobs.length === 0) return;
    setIsLoading(true);
    try {


      await ordersActions.jobScope.deleteJobs({

        jobIds: selectedJobs,
      });

      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success('Sėkmingai buvo ištryntį tagai')
      setSelectedJobs([]);
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Įvyko klaida')
      console.error("Tagų šalinimas nepavyko", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTagSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((jobId) => jobId !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[600px] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <X className="mr-2 h-5 w-5 text-red-500" /> Šalinti tagus
          </DialogTitle>
          <DialogDescription>
            Pasirinkite tagus, kurios norite pašalinti iš šio užsakymo
          </DialogDescription>
        </DialogHeader>

        {order.jobs.map((job) => {
          const createdAtDate = new Date(job.createdAt);

          const executionTime = new Date(
            createdAtDate.getTime() + job.scheduledFor
          );
          const formattedTime = format(executionTime, "yyyy-MM-dd HH:mm:ss", {
            locale: lt,
          });

          return (
            <div
              key={job.id}
              onClick={() => toggleTagSelection(job.id)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedJobs.includes(job.id)
                ? "bg-slate-50 border border-gray-200"
                : "hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center space-x-3">
                <Badge
                  className={`${getStatusColor(
                    job.status
                  )} px-2 py-1 flex items-center gap-1`}
                >
                  {job.tagName}
                  {job.processedAt && <Check className="h-3 w-3" />}
                </Badge>
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {job.scheduledFor && job.createdAt ? formattedTime : "N/A"}
                </div>
              </div>
              {selectedJobs.includes(job.id) && (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          );
        })}

        {order.jobs.length === 0 && (
          <p className="text-center text-gray-500">Šiuo metu nėra jokių žymų</p>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Atšaukti
          </Button>
          <Button
            variant="outline"
            className="bg-dcoffe text-db hover:bg-vdcoffe hover:text-gray-50 transition-colors"
            onClick={handleRemoveTags}
            disabled={selectedJobs.length === 0 || isLoading}
          >
            {isLoading
              ? "Šalinama..."
              : `Šalinti tagus (${selectedJobs.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
