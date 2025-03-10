import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Minus, Pizza, Plus } from "lucide-react";
import React, { useState } from "react";
import { MdColorLens } from "react-icons/md";
import {
  BorderStyle,
  ContentAlignment,
  EmailImageProps,
} from "../../../emailComponents/Image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiShapeLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RxPadding } from "react-icons/rx";

interface ImageStylesTabProps {
  localProps: EmailImageProps;
  handleImageHeightPx: (value: string) => void;
  handleImageWidthPx: (value: string) => void;
  handleBackgroundColorChange: (value: string) => void;
  handleShapeChange: (value: number) => void;
  handleBorderStyleChange: (value: BorderStyle) => void;
  handleBorderWidthChange: (value: number) => void;
  handleBorderColorChange: (value: string) => void;
  resetImageDimensions: () => void;
  handleContentAlignmentChange: (value: ContentAlignment) => void;
  handlePaddingChange: (
    type: "top" | "bottom" | "left" | "right",
    value: number
  ) => void;
}

const ImageStylesTab: React.FC<ImageStylesTabProps> = ({
  localProps,
  handleImageHeightPx,
  handleImageWidthPx,
  resetImageDimensions,
  handleBorderStyleChange,
  handlePaddingChange,
  handleBorderWidthChange,
  handleBorderColorChange,
  handleBackgroundColorChange,
  handleContentAlignmentChange,
  handleShapeChange,
}) => {
  const [colorsOpen, setColorsOpen] = useState(false);
  const [borderOpen, setBorderOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [showCustomSlider, setShowCustomSlider] = useState(false);
  const [shapeMode, setShapeMode] = useState<
    "square" | "rounded" | "circle" | "custom"
  >(
    localProps.borderRadius === 0
      ? "square"
      : localProps.borderRadius === 20
        ? "rounded"
        : localProps.borderRadius === 9999
          ? "circle"
          : "custom"
  );

  console.log(localProps.width);
  console.log(localProps.height);

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
                  variant={shapeMode === "square" ? "default" : "outline"}
                  onClick={() => {
                    handleShapeChange(0);
                    setShapeMode("square");
                    setShowCustomSlider(false);
                  }}
                >
                  Square
                </Button>
                <Button
                  type="button"
                  className="w-full duration-75 rounded-sm border-none"
                  variant={shapeMode === "rounded" ? "default" : "outline"}
                  onClick={() => {
                    handleShapeChange(20);
                    setShapeMode("rounded");
                    setShowCustomSlider(false);
                  }}
                >
                  Rounded
                </Button>
                <Button
                  type="button"
                  className="w-full duration-75 rounded-sm border-none"
                  variant={shapeMode === "circle" ? "default" : "outline"}
                  onClick={() => {
                    handleShapeChange(9999);
                    setShapeMode("circle");
                    setShowCustomSlider(false);
                  }}
                >
                  Circle
                </Button>
                <Button
                  type="button"
                  className="w-full duration-75 rounded-sm border-none"
                  variant={shapeMode === "custom" ? "default" : "outline"}
                  onClick={() => {
                    setShowCustomSlider(!showCustomSlider);
                    setShapeMode("custom");
                    if (!showCustomSlider) {
                      if (localProps.borderRadius === 0) {
                        handleShapeChange(1);
                      } else if (localProps.borderRadius === 20) {
                        handleShapeChange(21);
                      } else if (localProps.borderRadius === 9999) {
                        handleShapeChange(9000);
                      }
                    }
                  }}
                >
                  <Pizza className="h-4 w-4 mr-1" /> Custom
                </Button>
              </div>
            </div>
            {showCustomSlider && (
              <div className="mt-2 px-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Slider
                    value={[localProps.borderRadius] as number[]}
                    max={200}
                    step={1}
                    onValueChange={(value) => {
                      handleShapeChange(value[0]);
                      setShapeMode("custom");
                    }}
                  />
                  <span className="w-12 text-sm">
                    {localProps.borderRadius}px
                  </span>
                </div>
              </div>
            )}
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
                      onChange={(e) => handleBorderColorChange(e.target.value)}
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
              Block Background Color
            </Label>
            <div className="flex gap-2">
              <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                <input
                  type="color"
                  id="backgroundColorPicker"
                  value={localProps.containerBackgroundColor || "#FFFFFF"}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
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
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
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
            <RxPadding className="mr-2 h-5 w-5"></RxPadding>Size & Layout
          </span>
          <div className="p-1 bg-vdcoffe rounded-md">
            <ChevronRight
              className={`h-4 w-4 text-gray-100 transition-transform ${layoutOpen ? "rotate-90" : ""}`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-2">
          <div className="grid w-full items-center gap-1.5">
            <div className="flex justify-between">
              <Label className="text-base font-medium text-gray-900">
                Image Dimensions
              </Label>
              <Button
                type="button"
                variant="outline"
                className="text-xs h-6 px-2"
                onClick={resetImageDimensions}
              >
                Reset to Default
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  id="imageWidthPx"
                  type="number"
                  placeholder="Width (px)"
                  className="bg-white"
                  min={10}
                  max={600}
                  defaultValue={
                    localProps.width?.includes("px")
                      ? localProps.width.replace("px", "")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value, 10);

                    if (!isNaN(numValue) && numValue > 600) {
                      e.target.value = "600";
                      handleImageWidthPx("600");
                    } else {
                      handleImageWidthPx(value);
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                <Input
                  id="imageHeightPx"
                  type="number"
                  placeholder="Height (px)"
                  className="bg-white"
                  min={10}
                  max={600}
                  defaultValue={
                    typeof localProps.height === "string" &&
                    localProps.height.includes("px")
                      ? localProps.height.replace("px", "")
                      : typeof localProps.height === "number"
                        ? localProps.height
                        : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue) && numValue > 600) {
                      e.target.value = "600";
                      handleImageHeightPx("600");
                    } else {
                      handleImageHeightPx(value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {/* Image Alignment */}
          <div className="grid w-full items-center gap-1.5">
            <Label
              htmlFor="contentAlignment"
              className="text-base font-medium text-gray-900"
            >
              Image Alignment
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
                    max={600}
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
                    max={600}
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
                <Label htmlFor="paddingLeft" className="text-xs text-gray-500">
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
                    max={600}
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
                <Label htmlFor="paddingRight" className="text-xs text-gray-500">
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
                    max={600}
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
  );
};

export default ImageStylesTab;
