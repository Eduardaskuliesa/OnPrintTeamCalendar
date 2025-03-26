"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronDownIcon } from "lucide-react"
import useToolbarStore from "@/app/store/toolbarStore"

const fontFamilies = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "Courier New" },
    { label: "Verdana", value: "Verdana, Geneva" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },
    { label: "Impact", value: "Impact, Charcoal" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
    { label: "Lucida Sans", value: "Lucida Sans" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Roboto", value: "Roboto" },
    { label: "Lato", value: "Lato" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Oswald", value: "Oswald" },
    { label: "Raleway", value: "Raleway" },
    { label: "Merriweather", value: "Merriweather" },
    { label: "Ubuntu", value: "Ubuntu" },
    { label: "PT Sans", value: "PT Sans" },
    { label: "Futura", value: "Futura" },
]

const FontFamily = () => {
    const { editor } = useToolbarStore()
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedFont, setSelectedFont] = useState({ label: "Font", value: "" })

    // Update the selected font when the editor changes
    useEffect(() => {
        if (!editor) return

        const updateSelectedFont = () => {
            for (const font of fontFamilies) {
                if (editor.isActive("textStyle", { fontFamily: font.value })) {
                    setSelectedFont(font)
                    return
                }
            }
            setSelectedFont({ label: "Font", value: "" })
        }

        updateSelectedFont()

        editor.on("selectionUpdate", updateSelectedFont)

        return () => {
            editor.off("selectionUpdate", updateSelectedFont)
        }
    }, [editor])

    const handleSelect = useCallback(
        (font: string) => {
            if (editor) {
                editor.chain().focus().setFontFamily(font.value).run()
                setSelectedFont(font)
            }
            setShowDropdown(false)
        },
        [editor],
    )

    const handleUnsetFont = useCallback(
        (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (editor) {
                editor.chain().focus().unsetFontFamily().run()
                setSelectedFont({ label: "Font", value: "" })
            }
            setShowDropdown(false)
        },
        [editor],
    )

    return (
        <div className="relative" data-keep-component="true">
            <button
                onMouseDown={(e) => {
                    e.preventDefault()
                    setShowDropdown((prev) => !prev)
                }}
                className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 min-w-[120px]"
                title="Font Family"
                type="button"
            >
                <span className="text-sm font-medium truncate" style={{ fontFamily: selectedFont.value || "inherit" }}>
                    {selectedFont.label}
                </span>
                <ChevronDownIcon size={14} className="ml-auto flex-shrink-0" />
            </button>

            {showDropdown && (
                <div
                    className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-48"
                    data-keep-component="true"
                >
                    <div className="max-h-80 overflow-y-auto py-1">
                        {fontFamilies.map((font) => (
                            <button
                                key={font.value}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleSelect(font)
                                }}
                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${editor && editor.isActive("textStyle", { fontFamily: font.value }) ? "bg-gray-100 font-medium" : ""
                                    }`}
                                style={{ fontFamily: font.value }}
                            >
                                {font.label}
                            </button>
                        ))}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                            onMouseDown={handleUnsetFont}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors text-gray-600"
                        >
                            Default font
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FontFamily

