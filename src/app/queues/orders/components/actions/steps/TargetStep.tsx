"use client"

import { Package } from "lucide-react"
import { ActionButton } from "../ActionButton"
import { ActionType, TagType } from "../hooks/useActionFlow"
import { TagSelection } from "../TagSelection"

interface TargetStepProps {
    actionType: ActionType
    orders: number[]
    selectedTags: TagType[]
    currentTagId: string
    availableTagsExist: boolean
    onTagSelect: (tagId: string) => void
    onTagRemove: (tagId: string) => void
    setTargetAndConfirm: (target: "selected" | "filtered") => void
}

export function TargetStep({
    actionType,
    orders,
    selectedTags,
    currentTagId,
    availableTagsExist,
    onTagSelect,
    onTagRemove,
    setTargetAndConfirm
}: TargetStepProps) {
    return (
        <div className="space-y-3">
            {actionType?.includes("Tag") && (
                <TagSelection
                    selectedTags={selectedTags}
                    currentTagId={currentTagId}
                    availableTagsExist={availableTagsExist}
                    onTagSelect={onTagSelect}
                    onTagRemove={onTagRemove}
                />
            )}

            <div>
                <div className="px-3 py-2 ml-5 text-xs font-medium text-muted-foreground">
                    Pasirinkite taikinį
                </div>
                <ActionButton
                    icon={Package}
                    label="Pasirinkti užsakymai"
                    description={`Taikyti ${orders.length} užsakymams`}
                    onClick={() => setTargetAndConfirm("selected")}
                />
                <ActionButton
                    icon={Package}
                    label="Visi filtruoti užsakymai"
                    description="Taikyti visiems filtruotiems užsakymams"
                    onClick={() => setTargetAndConfirm("filtered")}
                />
            </div>
        </div>
    )
}
