// FormattingToolbar.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeIcon,
  ChevronDownIcon,
} from "lucide-react";
import { BsDropletFill } from "react-icons/bs";
import useToolbarStore from "@/app/store/toolbarStore";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import useCodePanelStore from "@/app/store/codePanelStore";
import { Input } from "@/components/ui/input";
import FontFamily from "./FormattingToolbar/FontFamily";
import LinkToolbar from "./FormattingToolbar/LinkToolBar";
import useConstantPanelStore from "@/app/store/constantPanelStore";

export type Level = 1 | 2 | 3 | 4 | 5 | 6


const FormattingToolbar = () => {
  const { editor, closeToolbar } = useToolbarStore();
  const { openPanel, isOpen } = useCodePanelStore();
  const { openPanel: openConstantPanel, isOpen: isConstantPanelOpen } = useConstantPanelStore();
  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );

  // Define font sizes
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

  // Define colors for the palette
  const colorPalette = [
    ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
    ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
    ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
    ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
  ];

  const [showFontSizes, setShowFontSizes] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [customColor, setCustomColor] = useState("#000000");

  // Heading dropdown state and levels
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const headingLevels = [
    { level: 1, label: "Heading 1" },
    { level: 2, label: "Heading 2" },
    { level: 3, label: "Heading 3" },
    { level: 4, label: "Heading 4" },
    { level: 5, label: "Heading 5" },
    { level: 6, label: "Heading 6" },
  ];

  useEffect(() => {
    if (selectedComponentId === undefined) {
      closeToolbar();
    }
  }, [closeToolbar, selectedComponentId]);

  // Fix for highlighting active tools - Track active state
  useEffect(() => {
    if (editor) {
      // Update selected font size when cursor position changes
      const updateFontSize = () => {
        const attrs = editor.getAttributes('textStyle');
        if (attrs.fontSize) {
          const size = parseInt(attrs.fontSize, 10);
          if (!isNaN(size)) {
            setSelectedFontSize(size);
          }
        }
      };
      const updateColor = () => {
        const attrs = editor.getAttributes('textStyle');
        if (attrs.color) {
          setSelectedColor(attrs.color);
          setCustomColor(attrs.color);
        }
      };

      editor.on('selectionUpdate', () => {
        updateFontSize();
        updateColor();
      });

      editor.on('transaction', () => {
        updateFontSize();
        updateColor();
      });

      // Initial update
      updateFontSize();
      updateColor();

      return () => {
        editor.off('selectionUpdate');
        editor.off('transaction');
      };
    }
  }, [editor]);

  const toggleCodeView = useCallback(() => {
    if (!isOpen && editor && selectedComponentId) {
      openPanel(editor.getHTML(), selectedComponentId);
    }
  }, [isOpen, editor, selectedComponentId, openPanel]);

  const toggleConstantView = useCallback(() => {
    if (!isConstantPanelOpen && editor && selectedComponentId) {
      openConstantPanel(editor.getHTML(), selectedComponentId)
    }
  }, [editor, openConstantPanel, selectedComponentId, isConstantPanelOpen])

  const setFontSize = useCallback(
    (size: number) => {
      console.log("Setting font size to:", size);
      setSelectedFontSize(size);
      setShowFontSizes(false);
      if (editor) {
        editor.chain().focus().setFontSize(`${size}px`).run();
      }
    },
    [editor]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      console.log("Setting color to:", color);
      setSelectedColor(color);
      setCustomColor(color);
      if (editor) {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const getToolbarButtonClass = (isActive: boolean) => {
    return `p-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 text-blue-600" : ""}`;
  };


  return (
    <div
      className="flex flex-wrap items-center gap-1 mt-2 mb-2 py-1 px-2 bg-white shadow-md border rounded-xl border-gray-200"
      data-keep-component="true"
    >
      <FontFamily></FontFamily>
      {/* Bold */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={getToolbarButtonClass(editor.isActive('bold'))}
        title="Bold"
        type="button"
      >
        <BoldIcon size={16} />
      </button>

      {/* Italic */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={getToolbarButtonClass(editor.isActive('italic'))}
        title="Italic"
        type="button"
      >
        <ItalicIcon size={16} />
      </button>

      {/* Underline */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={getToolbarButtonClass(editor.isActive('underline'))}
        title="Underline"
        type="button"
      >
        <UnderlineIcon size={16} />
      </button>
      <LinkToolbar />
      {/* Heading Dropdown */}
      <div className="relative" data-keep-component="true">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setShowHeadingDropdown(!showHeadingDropdown);
            setShowFontSizes(false);
            setShowColorPicker(false);
          }}
          className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
          title="Heading"
          type="button"
        >
          <span className="text-sm font-medium">
            {editor.isActive("heading")
              ? `H${editor.getAttributes("heading").level}`
              : "P"}
          </span>
          <ChevronDownIcon size={14} />
        </button>
        {showHeadingDropdown && (
          <div
            className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-32"
            data-keep-component="true"
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {headingLevels.map((item) => (
                <button
                  key={item.level}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowHeadingDropdown(false);
                    if (item.level === 0) {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      editor.chain().focus().toggleHeading({ level: item.level as Level }).run();
                    }
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${(item.level === 0 && editor.isActive("paragraph")) ||
                    (item.level > 0 &&
                      editor.isActive("heading", { level: item.level }))
                    ? "bg-gray-100 font-medium"
                    : ""
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font Size Selector */}
      <div className="relative" data-keep-component="true">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setShowFontSizes(!showFontSizes);
            setShowColorPicker(false);
            setShowHeadingDropdown(false);
          }}
          className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
          title="Font Size"
          type="button"
        >
          <span className="text-sm font-medium">{selectedFontSize}px</span>
          <ChevronDownIcon size={14} />
        </button>
        {showFontSizes && (
          <div
            className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-24"
            data-keep-component="true"
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${selectedFontSize === size ? "bg-gray-100 font-medium" : ""
                    }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setFontSize(size);
                  }}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="relative" data-keep-component="true">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setShowColorPicker(!showColorPicker);
            setShowFontSizes(false);
            setShowHeadingDropdown(false);
          }}
          className={`p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 ${editor.getAttributes('textStyle').color ? 'text-blue-600' : ''
            }`}
          title="Text Color"
          type="button"
        >
          <BsDropletFill size={16} color={selectedColor} />
        </button>
        {showColorPicker && (
          <div
            className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-64"
            data-keep-component="true"
          >
            <div className="mb-3">
              {colorPalette.map((row, rowIndex) => (
                <div key={rowIndex} className="flex mb-1 gap-1">
                  {row.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-sm cursor-pointer transition-all hover:scale-110 ${selectedColor === color
                        ? "ring-2 ring-offset-1 ring-blue-500"
                        : "border border-gray-200"
                        }`}
                      style={{ backgroundColor: color }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleColorChange(color);
                        setShowColorPicker(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: customColor }}
                />
              </div>
              <Input
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 bg-white h-9"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text Alignment Buttons */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("left").run();
        }}
        className={getToolbarButtonClass(editor.isActive({ textAlign: "left" }))}
        title="Align Left"
        type="button"
      >
        <AlignLeftIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={getToolbarButtonClass(editor.isActive({ textAlign: "center" }))}
        title="Align Center"
        type="button"
      >
        <AlignCenterIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
        }}
        className={getToolbarButtonClass(editor.isActive({ textAlign: "right" }))}
        title="Align Right"
        type="button"
      >
        <AlignRightIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("justify").run();
        }}
        className={getToolbarButtonClass(editor.isActive({ textAlign: "justify" }))}
        title="Justify"
        type="button"
      >
        <AlignJustifyIcon size={16} />
      </button>

      <div className="border-l border-gray-300 mx-1"></div>

      {/* HTML Code View */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleCodeView();
        }}
        className={getToolbarButtonClass(isOpen)}
        title="HTML Code View"
        type="button"
      >
        <CodeIcon size={16} />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleConstantView();
        }}
        className={getToolbarButtonClass(isOpen)}
        title="HTML Code View"
        type="button"
      >
        <CodeIcon size={16} />
      </button>
    </div>
  );
};

export default FormattingToolbar;