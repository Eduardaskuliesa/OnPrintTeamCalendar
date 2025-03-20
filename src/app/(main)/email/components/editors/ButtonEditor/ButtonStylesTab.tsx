import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ChevronRight } from "lucide-react";
import {
  BorderStyle,
  ButtonWidth,
  ContentAlignment,
  EmailButtonProps,
  TextAlignment,
} from "../../../emailComponents/Button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  RiShapeLine, // For general shape options
} from "react-icons/ri";

import { MdColorLens } from "react-icons/md";

import { RxPadding } from "react-icons/rx";

interface ButtonStylesTabProps {
  localProps: EmailButtonProps;
  handleShapeChange: (value: number) => void;
  handleBorderStyleChange: (value: BorderStyle) => void;
  handleBorderWidthChange: (value: number) => void;
  handleBorderColorChange: (value: string) => void;
  handleButtonColorChange: (value: string) => void;
  handleTextColorChange: (value: string) => void;
  handleBackgroundColorChange: (value: string) => void;
  handleWidthChange: (value: ButtonWidth) => void;
  handleTextAlignmentChange: (value: TextAlignment) => void;
  handleContentAlignmentChange: (value: ContentAlignment) => void;
  handlePaddingChange: (
    type: "top" | "bottom" | "left" | "right",
    value: number
  ) => void;
}

const ButtonStylesTab: React.FC<ButtonStylesTabProps> = ({
  localProps,
  handleShapeChange,
  handleBorderStyleChange,
  handleBorderWidthChange,
  handleButtonColorChange,
  handleTextColorChange,
  handleBorderColorChange,
  handleBackgroundColorChange,
  handleWidthChange,
  handleTextAlignmentChange,
  handleContentAlignmentChange,
  handlePaddingChange,
}) => {
  const [colorsOpen, setColorsOpen] = useState(false);
  const [borderOpen, setBorderOpen] = useState(false);
  const [sizesOpen, setSizesOpen] = useState(false);
  return (
    <>
      <div className="space-y-4 ">
        <Collapsible
          open={borderOpen}
          onOpenChange={() => setBorderOpen(!borderOpen)}
          className="bg-white border border-gray-300 rounded-md shadow-md"
        >
          <CollapsibleTrigger
            className={`flex w-full items-center justify-between p-2 font-medium ${borderOpen && "border-b-2 border-gray-300"}`}
          >
            <span className="flex items-center">
              <RiShapeLine className="mr-2 h-5 w-5"></RiShapeLine> Shapes &
              Borders
            </span>
            <div className="p-1 bg-vdcoffe rounded-md">
              <ChevronRight
                className={`h-4 w-4 text-gray-100 transition-transform ${borderOpen ? "rotate-90" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 space-y-2">
            {/* Shape */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="buttonShape"
                className="text-base font-medium text-gray-900"
              >
                Shape
              </Label>
              <div className="bg-white p-0.5 rounded-md border border-gray-200">
                <div className="flex">
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.borderRadius === 0 ? "default" : "outline"
                    }
                    onClick={() => handleShapeChange(0)}
                  >
                    Square
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.borderRadius === 6 ? "default" : "outline"
                    }
                    onClick={() => handleShapeChange(6)}
                  >
                    Round
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.borderRadius === 9999 ? "default" : "outline"
                    }
                    onClick={() => handleShapeChange(9999)}
                  >
                    Pill
                  </Button>
                </div>
              </div>
            </div>
            {/* Border */}
            <div className="grid w-full gap-1.5">
              <Label
                htmlFor="borderStyle"
                className="text-base font-medium text-gray-900"
              >
                Border
              </Label>
              <Select
                value={localProps.borderStyle || "none"}
                onValueChange={(value: BorderStyle) =>
                  handleBorderStyleChange(value)
                }
              >
                <SelectTrigger className="bg-white px-2 py-2 text-start rounded-md border border-gray-300">
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent data-keep-component="true">
                  <SelectItem
                    value="none"
                    className="flex py-2 items-center gap-2"
                  >
                    <span className="inline-block mr-2">None</span>
                    <div className="inline-block h-3 w-12"></div>
                  </SelectItem>
                  <SelectItem
                    value="solid"
                    className="flex items-center py-2 gap-2"
                  >
                    <span className="inline-block mr-2">Solid</span>
                    <div className="inline-block h-3 w-12 border border-solid border-current"></div>
                  </SelectItem>
                  <SelectItem
                    value="dashed"
                    className="flex py-2 items-center gap-2"
                  >
                    <span className="inline-block mr-2">Dashed</span>
                    <div className="inline-block h-3 w-12 border border-dashed border-current"></div>
                  </SelectItem>
                  <SelectItem
                    value="dotted"
                    className="flex py-2 items-center gap-2"
                  >
                    <span className="inline-block mr-2">Dotted</span>
                    <div className="inline-block h-3 w-12 border border-dotted border-current"></div>
                  </SelectItem>
                  <SelectItem value="double" className="flex py-2 items-center">
                    <span className="inline-block mr-2">Double</span>
                    <div className="inline-block h-3 w-12 border-4 border-double border-current"></div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Show border width and color controls only when border style isn't "none" */}
            {localProps.borderStyle && localProps.borderStyle !== "none" && (
              <div className="grid w-full items-center gap-1.5">
                <Label
                  htmlFor="borderSettings"
                  className="text-base font-medium text-gray-900"
                >
                  Border Settings
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.max(
                            1,
                            (localProps.borderWidth || 1) - 1
                          );
                          handleBorderWidthChange(newValue);
                        }}
                        className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        id="borderWidth"
                        value={localProps.borderWidth || 1}
                        onChange={(e) =>
                          handleBorderWidthChange(parseInt(e.target.value) || 1)
                        }
                        min={1}
                        max={10}
                        className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const newValue = Math.min(
                            10,
                            (localProps.borderWidth || 1) + 1
                          );
                          handleBorderWidthChange(newValue);
                        }}
                        className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                      <input
                        type="color"
                        id="borderColorPicker"
                        value={localProps.borderColor || "#000000"}
                        onChange={(e) =>
                          handleBorderColorChange(e.target.value)
                        }
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                      />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundColor: localProps.borderColor || "#000000",
                        }}
                      />
                    </div>
                    <Input
                      id="borderColor"
                      value={localProps.borderColor || "#000000"}
                      onChange={(e) => handleBorderColorChange(e.target.value)}
                      className="flex-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={colorsOpen}
          onOpenChange={() => setColorsOpen(!colorsOpen)}
          className="bg-white border border-gray-300 rounded-md shadow-md"
        >
          <CollapsibleTrigger
            className={`flex w-full items-center justify-between p-2 font-medium ${colorsOpen && "border-b-2 border-gray-300"}`}
          >
            <span className="flex items-center">
              <MdColorLens className="mr-2 w-5 h-5"></MdColorLens>Colors
            </span>
            <div className="p-1 bg-vdcoffe rounded-md">
              <ChevronRight
                className={`h-4 w-4 text-gray-100 transition-transform ${colorsOpen ? "rotate-90" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 space-y-2">
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="backgroundColor"
                className="text-base font-medium text-gray-900"
              >
                Button Color
              </Label>
              <div className="flex gap-2">
                <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                  <input
                    type="color"
                    id="backgroundColorPicker"
                    value={localProps.backgroundColor || "#3B82F6"}
                    onChange={(e) => handleButtonColorChange(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: localProps.backgroundColor || "#3B82F6",
                    }}
                  />
                </div>
                <Input
                  id="backgroundColor"
                  value={localProps.backgroundColor || "#3B82F6"}
                  onChange={(e) => handleButtonColorChange(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>
            </div>
            {/* Text Color */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="textColor"
                className="text-base font-medium text-gray-900"
              >
                Text Color
              </Label>
              <div className="flex gap-2">
                <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                  <input
                    type="color"
                    id="textColorPicker"
                    value={localProps.textColor || "#FFFFFF"}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: localProps.textColor || "#FFFFFF",
                    }}
                  />
                </div>
                <Input
                  id="textColor"
                  value={localProps.textColor || "#FFFFFF"}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="containerBackgroundColor"
                className="text-base font-medium text-gray-900"
              >
                Block Background Color
              </Label>
              <div className="flex gap-2">
                <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                  <input
                    type="color"
                    id="containerBackgroundColorPicker"
                    value={localProps.containerBackgroundColor || "#FFFFFF"}
                    onChange={(e) =>
                      handleBackgroundColorChange(e.target.value)
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor:
                        localProps.containerBackgroundColor || "#FFFFFF",
                    }}
                  />
                </div>
                <Input
                  id="containerBackgroundColor"
                  value={localProps.containerBackgroundColor || "#FFFFFF"}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={sizesOpen}
          onOpenChange={() => setSizesOpen(!sizesOpen)}
          className="bg-white border border-gray-300 rounded-md shadow-md"
        >
          <CollapsibleTrigger
            className={`flex w-full items-center justify-between p-2 font-medium ${sizesOpen && "border-b-2 border-gray-300"}`}
          >
            <span className="flex items-center">
              <RxPadding className="mr-2 h-5 w-5"></RxPadding>Size & Layout
            </span>
            <div className="p-1 bg-vdcoffe rounded-md">
              <ChevronRight
                className={`h-4 w-4 text-gray-100 transition-transform ${sizesOpen ? "rotate-90" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 space-y-2">
            {/* Button Width */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="buttonWidth"
                className="text-base font-medium text-gray-900"
              >
                Button Size
              </Label>
              <div className="bg-white p-0.5 rounded-md border border-gray-200">
                <div className="flex">
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={localProps.width === "25%" ? "default" : "outline"}
                    onClick={() => handleWidthChange("25%")}
                  >
                    Small
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={localProps.width === "50%" ? "default" : "outline"}
                    onClick={() => handleWidthChange("50%")}
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={localProps.width === "75%" ? "default" : "outline"}
                    onClick={() => handleWidthChange("75%")}
                  >
                    Big
                  </Button>
                </div>
              </div>
            </div>

            {/* Button Alignment */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="contentAlignment"
                className="text-base font-medium text-gray-900"
              >
                Button Alignment
              </Label>
              <div className="bg-white p-0.5 rounded-md border border-gray-200">
                <div className="flex">
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.contentAlignment === "flex-start"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleContentAlignmentChange("flex-start")}
                  >
                    Left
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.contentAlignment === "center"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleContentAlignmentChange("center")}
                  >
                    Center
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.contentAlignment === "flex-end"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleContentAlignmentChange("flex-end")}
                  >
                    Right
                  </Button>
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="textAlignment"
                className="text-base font-medium text-gray-900"
              >
                Text Alignment
              </Label>
              <div className="bg-white p-0.5 rounded-md border border-gray-200">
                <div className="flex">
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.textAlignment === "left"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleTextAlignmentChange("left")}
                  >
                    Left
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.textAlignment === "center"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleTextAlignmentChange("center")}
                  >
                    Center
                  </Button>
                  <Button
                    type="button"
                    className="w-full duration-75 rounded-sm border-none"
                    variant={
                      localProps.textAlignment === "right"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleTextAlignmentChange("right")}
                  >
                    Right
                  </Button>
                </div>
              </div>
            </div>

            {/* Padding */}
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="padding"
                className="text-base font-medium text-gray-900"
              >
                Padding
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="paddingTop" className="text-xs text-gray-500">
                    Top
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "top",
                          Math.max(0, (localProps.padding?.top || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.padding?.top || 0}
                      onChange={(e) => {
                        handlePaddingChange("top", Number(e.target.value));
                      }}
                      min={0}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "top",
                          (localProps.padding?.top || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="paddingBottom"
                    className="text-xs text-gray-500"
                  >
                    Bottom
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "bottom",
                          Math.max(0, (localProps.padding?.bottom || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.padding?.bottom || 0}
                      onChange={(e) => {
                        handlePaddingChange("bottom", Number(e.target.value));
                      }}
                      min={0}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "bottom",
                          (localProps.padding?.bottom || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Left padding */}
                <div>
                  <Label
                    htmlFor="paddingLeft"
                    className="text-xs text-gray-500"
                  >
                    Left
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "left",
                          Math.max(0, (localProps.padding?.left || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.padding?.left || 0}
                      onChange={(e) => {
                        handlePaddingChange("left", Number(e.target.value));
                      }}
                      min={0}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "left",
                          (localProps.padding?.left || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Right padding */}
                <div>
                  <Label
                    htmlFor="paddingRight"
                    className="text-xs text-gray-500"
                  >
                    Right
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "right",
                          Math.max(0, (localProps.padding?.right || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.padding?.right || 0}
                      onChange={(e) => {
                        handlePaddingChange("right", Number(e.target.value));
                      }}
                      min={0}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePaddingChange(
                          "right",
                          (localProps.padding?.right || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
};

export default ButtonStylesTab;
