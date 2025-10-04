"use client";
import React from "react";
import { Loader2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  tempalteSubject: string;
  templateType: "regular" | "promotional";
  setTemplateType: (type: "regular" | "promotional") => void;
  onTemplateNameChange: (name: string) => void;
  onTemplateSubjectChange: (name: string) => void;
  nameError: string;
  dialogStatus: "idle" | "saving" | "navigating";
  onSubmit: () => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onOpenChange,
  templateName,
  tempalteSubject,
  onTemplateNameChange,
  onTemplateSubjectChange,
  nameError,
  dialogStatus,
  onSubmit,
  setTemplateType,
  templateType
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Išsaugoti šabloną</DialogTitle>
          <DialogDescription>Įveskite šablono pavadinimą</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center space-y-4">
          <div className="items-center gap-2 space-y-1">
            <Label htmlFor="templateName" className="flex-shrink-0 w-42">
              Šablono pavadinimas
            </Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => onTemplateNameChange(e.target.value)}
              placeholder="pvz. Sveikinimo laiškas"
              className="flex-grow"
              autoFocus
              disabled={dialogStatus !== "idle"}
            />
          </div>
           <div className="items-center gap-2 space-y-1">
            <Label htmlFor="templateName" className="flex-shrink-0 w-42">
              Šablono subjecet
            </Label>
            <Input
              id="templateName"
              value={tempalteSubject}
              onChange={(e) => onTemplateSubjectChange(e.target.value)}
              placeholder="pvz. Dėkojame, kad prisijungėte prie mūsų"
              className="flex-grow"
              autoFocus
              disabled={dialogStatus !== "idle"}
            />
          </div>
          <div className="flex gap-2 ">
            <div>
              <Button
                variant={'outline'}
                className={templateType === "regular" ? "bg-db text-white" : "bg-gray-200 text-black"}
                onClick={() => setTemplateType('regular')}
              >
                <Mail className='h-5 w-5'></Mail>
                <span>Regular</span>
              </Button>
            </div>
            <div>
              <Button
                variant={'outline'}
                className={templateType === "promotional" ? "bg-db text-white" : "bg-gray-200 text-black"}
                onClick={() => setTemplateType('promotional')}
              >
                <Mail className='h-5 w-5'></Mail>
                <span>Promotional</span>
              </Button>
            </div>
          </div>

          {nameError && (
            <div className="flex items-center justify-start text-red-600 text-sm">
              {nameError}
            </div>
          )}
        </div>

        {dialogStatus === "navigating" && (
          <div className="flex items-center justify-start text-green-600 text-sm">
            Šablonas sėkmingai sukurtas! Nukreipiama...
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={dialogStatus !== "idle"}
          >
            Atšaukti
          </Button>
          <Button onClick={onSubmit} disabled={dialogStatus !== "idle"}>
            {dialogStatus === "saving" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kuriama...
              </>
            ) : dialogStatus === "navigating" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Nukreipiama...
              </>
            ) : (
              "Sukurti šabloną"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;
