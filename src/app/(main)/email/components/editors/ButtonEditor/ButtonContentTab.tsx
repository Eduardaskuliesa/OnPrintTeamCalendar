import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmailButtonProps } from "../../../emailComponents/Button";

interface ButtonContentTabProps {
  localProps: EmailButtonProps;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTargetChange: (value: "_blank" | "_self") => void;
}

const ButtonContentTab: React.FC<ButtonContentTabProps> = ({
  localProps,
  handleChange,
  handleTargetChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="buttonUrl"
          className="text-base font-medium text-gray-900"
        >
          URL
        </Label>
        <Input
          className="bg-white"
          id="buttonUrl"
          name="url"
          value={localProps.url || ""}
          onChange={handleChange}
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label className="text-base font-medium text-gray-900">
          Open Link In
        </Label>
        <div className="bg-white p-0.5 rounded-md border border-gray-200">
          <div className="flex">
            <Button
              type="button"
              className="w-full duration-75 rounded-sm border-none"
              variant={localProps.target === "_blank" ? "default" : "outline"}
              onClick={() => handleTargetChange("_blank")}
            >
              New Tab
            </Button>
            <Button
              className="w-full duration-75 rounded-sm border-none"
              type="button"
              variant={localProps.target === "_self" ? "default" : "outline"}
              onClick={() => handleTargetChange("_self")}
            >
              Same Tab
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonContentTab;
