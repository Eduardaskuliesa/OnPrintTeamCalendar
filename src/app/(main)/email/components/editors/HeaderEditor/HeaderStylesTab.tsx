import React, { useState } from "react";
import {
  BorderStyle,
  EmailHeadingProps,
} from "../../../emailComponents/Header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Layout, Minus, Plus } from "lucide-react";
import { RiShapeLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MdColorLens } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";

interface HeaderStyleTabProps {
  localProps: EmailHeadingProps;
  handleBorderRadius: (value: number) => void;
  handleBorderStyle: (value: BorderStyle) => void;
  handleBorderWidth: (value: number) => void;
  handleBorderColor: (value: string) => void;
  handleMarginChangeAll: (value: number) => void;
  handlePaddingChangeAll: (value: number) => void;
  handleBackgroundColor: (value: string) => void;
  handlePaddingChange: (
    side: "top" | "bottom" | "left" | "right",
    value: number
  ) => void;
  handleMarginChange: (
    side: "top" | "bottom" | "left" | "right",
    value: number
  ) => void;
}

const HeaderStylesTab: React.FC<HeaderStyleTabProps> = ({
  handleBorderRadius,
  localProps,
  handleBorderStyle,
  handleBorderWidth,
  handleBorderColor,
  handleBackgroundColor,
  handlePaddingChange,
  handleMarginChangeAll,
  handlePaddingChangeAll,
  handleMarginChange,
}) => {
  const [borderOpen, setBorderOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);

  const [applyPaddingToAll, setApplyPaddingToAll] = useState(false);
  const [applyMarginToAll, setApplyMarginToAll] = useState(false);

  return (
    <div className="space-y-4">
      <Collapsible
        open={borderOpen}
        onOpenChange={() => setBorderOpen(!borderOpen)}
        className="bg-white border border-gray-300 rounded-md shadow-md"
      >
        <CollapsibleTrigger
          className={`flex w-full items-center justify-between p-2 font-medium ${borderOpen && "border-b-2 border-gray-300"}`}
        >
          <span className="flex items-center">
            <RiShapeLine className="mr-2 h-5 w-5"></RiShapeLine> Container
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
                    localProps.containerBorderRadius === 0
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleBorderRadius(0)}
                >
                  Square
                </Button>
                <Button
                  type="button"
                  className="w-full duration-75 rounded-sm border-none"
                  variant={
                    localProps.containerBorderRadius === 8
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleBorderRadius(8)}
                >
                  Round
                </Button>
                <Button
                  type="button"
                  className="w-full duration-75 rounded-sm border-none"
                  variant={
                    localProps.containerBorderRadius === 9999
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleBorderRadius(9999)}
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
              onValueChange={(value: BorderStyle) => handleBorderStyle(value)}
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
                        handleBorderWidth(newValue);
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
                        handleBorderWidth(parseInt(e.target.value) || 1)
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
                        handleBorderWidth(newValue);
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
                      onChange={(e) => handleBorderColor(e.target.value)}
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
                    onChange={(e) => handleBorderColor(e.target.value)}
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
              Block Background Color
            </Label>
            <div className="flex gap-2">
              <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                <input
                  type="color"
                  id="backgroundColorPicker"
                  value={localProps.containerBackgroundColor || "#FFFFFF"}
                  onChange={(e) => handleBackgroundColor(e.target.value)}
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
                id="backgroundColor"
                value={localProps.containerBackgroundColor || "#FFFFFF"}
                onChange={(e) => handleBackgroundColor(e.target.value)}
                className="flex-1 bg-white"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible
        open={layoutOpen}
        onOpenChange={() => setLayoutOpen(!layoutOpen)}
        className="bg-white border border-gray-300 rounded-md shadow-md"
      >
        <CollapsibleTrigger
          className={`flex w-full items-center justify-between p-2 font-medium ${layoutOpen && "border-b-2 border-gray-300"}`}
        >
          <span className="flex items-center">
            <Layout className="mr-2 w-[1.1rem] h-[1.1rem]"></Layout>Layout
          </span>
          <div className="p-1 bg-vdcoffe rounded-md">
            <ChevronRight
              className={`h-4 w-4 text-gray-100 transition-transform ${layoutOpen ? "rotate-90" : ""}`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-2">
          <div className="grid w-full items-center gap-1.5 mt-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="padding"
                className="text-base font-medium text-gray-900"
              >
                Padding
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="applyPaddingToAll"
                  checked={applyPaddingToAll}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    setApplyPaddingToAll(isChecked);

                  }}
                />
                <Label
                  htmlFor="applyPaddingToAll"
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  Apply to all sides
                </Label>
              </div>
            </div>

            {applyPaddingToAll ? (
              <div>
                <Label htmlFor="paddingAll" className="text-xs text-gray-500">
                  All Sides
                </Label>
                <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      handlePaddingChangeAll(
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
                      handlePaddingChangeAll(Number(e.target.value));
                    }}
                    min={0}
                    max={100}
                    className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handlePaddingChangeAll((localProps.padding?.top || 0) + 1)
                    }
                    className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ) : (
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
                      max={100}
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
                      max={100}
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
                      max={100}
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
                      max={100}
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
            )}
          </div>

          {/* Margin Control */}
          <div className="grid w-full items-center gap-1.5 mt-4">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="margin"
                className="text-base font-medium text-gray-900"
              >
                Margin
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="applyMarginToAll"
                  checked={applyMarginToAll}
                  onCheckedChange={(checked) => {
                    setApplyMarginToAll(checked === true);
                  }}
                />
                <Label
                  htmlFor="applyMarginToAll"
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  Apply to all sides
                </Label>
              </div>
            </div>
            {applyMarginToAll ? (
              <div>
                <Label htmlFor="marginAll" className="text-xs text-gray-500">
                  All Sides
                </Label>
                <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      handleMarginChangeAll(
                        Math.max(0, (localProps.margin?.top || 0) - 1)
                      )
                    }
                    className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={localProps.margin?.top || 0}
                    onChange={(e) => {
                      handleMarginChangeAll(Number(e.target.value));
                    }}
                    min={0}
                    max={100}
                    className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleMarginChangeAll((localProps.margin?.top || 0) + 1)
                    }
                    className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="marginTop" className="text-xs text-gray-500">
                    Top
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "top",
                          Math.max(0, (localProps.margin?.top || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.margin?.top || 0}
                      onChange={(e) => {
                        handleMarginChange("top", Number(e.target.value));
                      }}
                      min={0}
                      max={100}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "top",
                          (localProps.margin?.top || 0) + 1
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
                    htmlFor="marginBottom"
                    className="text-xs text-gray-500"
                  >
                    Bottom
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "bottom",
                          Math.max(0, (localProps.margin?.bottom || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.margin?.bottom || 0}
                      onChange={(e) => {
                        handleMarginChange("bottom", Number(e.target.value));
                      }}
                      min={0}
                      max={100}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "bottom",
                          (localProps.margin?.bottom || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="marginLeft" className="text-xs text-gray-500">
                    Left
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "left",
                          Math.max(0, (localProps.margin?.left || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.margin?.left || 0}
                      onChange={(e) => {
                        handleMarginChange("left", Number(e.target.value));
                      }}
                      min={0}
                      max={100}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "left",
                          (localProps.margin?.left || 0) + 1
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
                    htmlFor="marginRight"
                    className="text-xs text-gray-500"
                  >
                    Right
                  </Label>
                  <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "right",
                          Math.max(0, (localProps.margin?.right || 0) - 1)
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={localProps.margin?.right || 0}
                      onChange={(e) => {
                        handleMarginChange("right", Number(e.target.value));
                      }}
                      min={0}
                      max={100}
                      className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleMarginChange(
                          "right",
                          (localProps.margin?.right || 0) + 1
                        )
                      }
                      className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HeaderStylesTab;
