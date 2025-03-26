"use client";

import React, { useState, useCallback, useEffect } from "react";
import { LinkIcon, ExternalLinkIcon, UnlinkIcon, CheckIcon } from "lucide-react";
import useToolbarStore from "@/app/store/toolbarStore";
import { Input } from "@/components/ui/input";

const LinkToolbar: React.FC = () => {
    const { editor } = useToolbarStore();
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Check if link is active when selection changes
    useEffect(() => {
        if (!editor) return;

        const updateLinkStatus = () => {
            const isLinkActive = editor.isActive('link');
            if (isLinkActive) {
                const attrs = editor.getAttributes('link');
                if (attrs.href) {
                    setLinkUrl(attrs.href);
                    setIsEditing(true);
                }
            } else {
                setIsEditing(false);
            }
        };

        editor.on('selectionUpdate', updateLinkStatus);
        editor.on('transaction', updateLinkStatus);

        // Initial check
        updateLinkStatus();

        return () => {
            editor.off('selectionUpdate', updateLinkStatus);
            editor.off('transaction', updateLinkStatus);
        };
    }, [editor]);

    const toggleLinkInput = useCallback(() => {
        setShowLinkInput(!showLinkInput);
        if (!showLinkInput && editor && !isEditing) {
            // Pre-populate with selected text if not already a link
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to, '');

            // If there's selected text that could be a URL, use it as initial value
            if (text && (text.startsWith('http') || text.startsWith('www'))) {
                setLinkUrl(text.startsWith('www') ? `https://${text}` : text);
            } else {
                setLinkUrl('');
            }
        }
    }, [showLinkInput, editor, isEditing]);

    const applyLink = useCallback(() => {
        if (!editor) return;

        // Normalize URL if needed
        let normalizedUrl = linkUrl.trim();
        if (normalizedUrl && !normalizedUrl.startsWith('http') && !normalizedUrl.startsWith('mailto:')) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        if (normalizedUrl) {
            editor.chain().focus().setLink({ href: normalizedUrl, target: '_blank' }).run();
        }

        setShowLinkInput(false);
    }, [editor, linkUrl]);

    const removeLink = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
        setShowLinkInput(false);
        setIsEditing(false);
        setLinkUrl('');
    }, [editor]);

    const openLink = useCallback(() => {
        if (linkUrl) {
            window.open(linkUrl, '_blank');
        }
    }, [linkUrl]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyLink();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowLinkInput(false);
        }
    }, [applyLink]);

    if (!editor) {
        return null;
    }

    const getToolbarButtonClass = (isActive: boolean) => {
        return `p-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 text-blue-600" : ""}`;
    };

    return (
        <div className="relative" data-keep-component="true">
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleLinkInput();
                }}
                className={getToolbarButtonClass(editor.isActive('link') || showLinkInput)}
                title="Link"
                type="button"
            >
                <LinkIcon size={16} />
            </button>

            {showLinkInput && (
                <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-80" data-keep-component="true">
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium mb-1">
                            {isEditing ? 'Edit link' : 'Add link'}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1"
                                autoFocus
                            />
                            <button
                                onClick={applyLink}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                title="Apply Link"
                            >
                                <CheckIcon size={16} />
                            </button>
                        </div>

                        {isEditing && (
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={openLink}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <ExternalLinkIcon size={12} /> Open link
                                </button>
                                <button
                                    onClick={removeLink}
                                    className="text-xs text-red-600 hover:underline flex items-center gap-1 ml-auto"
                                >
                                    <UnlinkIcon size={12} /> Remove link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkToolbar;