import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const ReasonCell = ({ reason }: { reason: string }) => {
  if (reason.length < 50) {
    return <span className="text-sm text-gray-500">{reason}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 truncate">{reason}</span>
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Priežastis</DialogTitle>
          <div className="mt-2">
            <p className="text-gray-600">{reason}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReasonCell;
