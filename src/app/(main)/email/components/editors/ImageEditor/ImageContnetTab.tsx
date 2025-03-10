/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmailImageProps, ImageWidth } from "../../../emailComponents/Image";
import { ChevronRight, Upload, Link2, Image } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { FaSlack } from "react-icons/fa6";



interface ImageContentTabProps {
    localProps: EmailImageProps;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTargetChange: (value: "_blank" | "_self") => void;
    handleObjectFitChange: (value: "cover" | "none") => void;
    handleWidthChange: (width: ImageWidth) => void;
}

const ImageContentTab: React.FC<ImageContentTabProps> = ({
    localProps,
    handleChange,
    handleTargetChange,
    handleObjectFitChange,
    handleWidthChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showWidthSlider, setShowWidthSlider] = useState(false);
    const [contentOpen, setContentOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [customWidth, setCustomWidth] = useState(
        localProps.width === "25%" ? 25 :
            localProps.width === "50%" ? 50 :
                localProps.width === "100%" ? 100 : 50
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const srcEvent = {
                target: {
                    name: "src",
                    value: imageUrl
                }
            } as React.ChangeEvent<HTMLInputElement>;

            handleChange(srcEvent);
        }
    };

    const handleCustomWidthChange = (values: number[]) => {
        const value = values[0];
        setCustomWidth(value);
        const width = `${value}%` as ImageWidth;
        handleWidthChange(width);
    };

    return (
        <div className="space-y-4">
            {/* Image Content Section */}
            <Collapsible
                open={contentOpen}
                onOpenChange={() => setContentOpen(!contentOpen)}
                className="bg-white border border-gray-300 rounded-md shadow-md"
            >
                <CollapsibleTrigger
                    className={`flex w-full items-center justify-between p-2 font-medium ${contentOpen && "border-b-2 border-gray-300"}`}
                >
                    <span className="flex items-center">
                        <Image className="mr-2 h-5 w-5" /> Image Content
                    </span>
                    <div className="p-1 bg-vdcoffe rounded-md">
                        <ChevronRight
                            className={`h-4 w-4 text-gray-100 transition-transform ${contentOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="p-2 space-y-4">
                    {/* Image Upload */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label
                            htmlFor="imageUpload"
                            className="text-base font-medium text-gray-900"
                        >
                            Image
                        </Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            >
                                <Upload className="h-4 w-4 mr-2" /> Upload
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Input
                                placeholder="or enter image URL"
                                className="bg-white flex-1"
                                id="imageSrc"
                                name="src"
                                value={localProps.src || ""}
                                onChange={handleChange}
                            />
                        </div>

                        {localProps.src && (
                            <div className="mt-2 relative border border-gray-200 rounded-md p-2 bg-gray-50">
                                <div className="flex justify-center">
                                    <img
                                        src={localProps.src}
                                        alt={localProps.alt || "Preview"}
                                        className="max-h-40 object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alt Text */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label
                            htmlFor="imageAlt"
                            className="text-base font-medium text-gray-900"
                        >
                            Alt
                        </Label>
                        <Input
                            placeholder="Describe the image"
                            className="bg-white"
                            id="imageAlt"
                            name="alt"
                            value={localProps.alt || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Image Object Fit Options */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label className="text-base font-medium text-gray-900">
                            Image Fit
                        </Label>
                        <div className="bg-white p-0.5 rounded-md border border-gray-200">
                            <div className="flex">
                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={localProps.objectFit === "cover" || !localProps.objectFit ? "default" : "outline"}
                                    onClick={() => handleObjectFitChange("cover")}
                                >
                                    Cover
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={localProps.objectFit === "none" ? "default" : "outline"}
                                    onClick={() => handleObjectFitChange("none")}
                                >
                                    None
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Image Size */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label className="text-base font-medium text-gray-900">
                            Image Size
                        </Label>
                        <div className="bg-white p-0.5 rounded-md border border-gray-200">
                            <div className="flex">
                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={
                                        !showWidthSlider && localProps.width === "25%" ? "default" : "outline"
                                    }
                                    onClick={() => {
                                        handleWidthChange("25%");
                                        setShowWidthSlider(false);
                                        setCustomWidth(25);
                                    }}
                                >
                                    Small
                                </Button>

                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={
                                        !showWidthSlider && localProps.width === "50%" ? "default" : "outline"
                                    }
                                    onClick={() => {
                                        handleWidthChange("50%");
                                        setShowWidthSlider(false);
                                        setCustomWidth(50);
                                    }}
                                >
                                    Medium
                                </Button>

                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={
                                        !showWidthSlider && localProps.width === "100%" ? "default" : "outline"
                                    }
                                    onClick={() => {
                                        handleWidthChange("100%");
                                        setShowWidthSlider(false);
                                        setCustomWidth(100);
                                    }}
                                >
                                    Large
                                </Button>

                                <Button
                                    type="button"
                                    className="w-full duration-75 rounded-sm border-none"
                                    variant={showWidthSlider ? "default" : "outline"}
                                    onClick={() => setShowWidthSlider(!showWidthSlider)}
                                >
                                    Custom
                                </Button>
                            </div>
                        </div>

                        {/* Width slider */}
                        {showWidthSlider && (
                            <div className="mt-2 px-2">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Slider
                                        value={[customWidth]}
                                        max={100}
                                        step={1}
                                        onValueChange={handleCustomWidthChange}
                                    />
                                    <span className="w-12 text-sm">{customWidth}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Link Section */}
            <Collapsible
                open={linkOpen}
                onOpenChange={() => setLinkOpen(!linkOpen)}
                className="bg-white border border-gray-300 rounded-md shadow-md"
            >
                <CollapsibleTrigger
                    className={`flex w-full items-center justify-between p-2 font-medium ${linkOpen && "border-b-2 border-gray-300"}`}
                >
                    <span className="flex items-center">
                        <Link2 className="mr-2 h-5 w-5" /> Link Settings
                    </span>
                    <div className="p-1 bg-vdcoffe rounded-md">
                        <ChevronRight
                            className={`h-4 w-4 text-gray-100 transition-transform ${linkOpen ? "rotate-90" : ""}`}
                        />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 space-y-4">
                    {/* Link URL */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label
                            htmlFor="imageUrl"
                            className="text-base font-medium text-gray-900"
                        >
                            Link URL
                        </Label>
                        <Input
                            placeholder="URL to your website"
                            className="bg-white"
                            id="imageUrl"
                            name="href"
                            value={localProps.href || ""}
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
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default ImageContentTab;