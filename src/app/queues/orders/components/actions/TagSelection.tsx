"use client"

import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tags, X } from "lucide-react"
import { TAGS, TagType } from "./hooks/useActionFlow"


interface TagSelectionProps {
    selectedTags: TagType[]
    currentTagId: string
    availableTagsExist: boolean
    onTagSelect: (tagId: string) => void
    onTagRemove: (tagId: string) => void
}

export function TagSelection({
    selectedTags,
    currentTagId,
    availableTagsExist,
    onTagSelect,
    onTagRemove
}: TagSelectionProps) {
    return (
        <div className="space-y-3 px-2 py-1">
            <div className="space-y-2">
                <label className="text-sm ml-7 font-medium flex items-center gap-2">
                    <Tags className="w-4 h-4" />
                    Pasirinkti tagus
                </label>
                <Select value={currentTagId} onValueChange={onTagSelect} disabled={!availableTagsExist}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pasirinkite tagus" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTagsExist ? (
                            TAGS.filter((tag) => !selectedTags.some((t) => t.id === tag.id)).map((tag) => (
                                <SelectItem key={tag.id} value={tag.id} className="font-medium bg-white">
                                    {tag.name} - {tag.scheduledFor}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="empty" disabled>
                                Nėra galimų tagų
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="flex items-center bg-slate-100 border-2 shadow-md rounded-md px-2 py-1.5 border-blue-50 gap-1 text-sm"
                        >
                            {tag.name} - {tag.scheduledFor}
                            <button
                                onClick={() => onTagRemove(tag.id)}
                                className="ml-1 bg-red-100 rounded-lg p-0.5 text-red-600 hover:text-red-800"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}