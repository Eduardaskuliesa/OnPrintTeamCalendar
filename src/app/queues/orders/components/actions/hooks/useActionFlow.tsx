"use client"

import { useState } from "react"

export type Step = "scope" | "action" | "target" | "confirm"
export type ActionScope = "tag" | "order" | null
export type ActionType =
    | "addTag"
    | "removeTag"
    | "pauseTag"
    | "resumeTag"
    | "inactiveTag"
    | "pauseOrders"
    | "resumeOrders"
    | "inactiveOrders"
    | "deleteOrders"
    | null

export type TagType = {
    id: string
    name: string
    scheduledFor: string
}

export const TAGS: TagType[] = [
    { id: "1", name: "Svarbu", scheduledFor: "2val" },
    { id: "2", name: "Skubu", scheduledFor: "4val" },
    { id: "3", name: "Peržiūra", scheduledFor: "8val" },
    { id: "4", name: "Sekti", scheduledFor: "24val" },
]

interface UseActionFlowOptions {
    orders: number[]
}

export function useActionFlow({ orders }: UseActionFlowOptions) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<Step>("scope")
    const [actionScope, setActionScope] = useState<ActionScope>(null)
    const [actionType, setActionType] = useState<ActionType>(null)
    const [selectedTags, setSelectedTags] = useState<TagType[]>([])
    const [currentTagId, setCurrentTagId] = useState<string>("")
    const [target, setTarget] = useState<"selected" | "filtered" | null>(null)

    const toggleOpen = () => setOpen(!open)

    const goBack = () => {
        if (step === "scope") return
        if (step === "action") {
            setStep("scope")
            setActionScope(null)
            return
        }
        if (step === "target") {
            setStep("action")
            setActionType(null)
            return
        }
        if (step === "confirm") {
            setStep("target")
            setTarget(null)
            return
        }
    }

    const reset = () => {
        setStep("scope")
        setActionScope(null)
        setActionType(null)
        setSelectedTags([])
        setCurrentTagId("")
        setTarget(null)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTagSelect = (tagId: string) => {
        const selectedTag = TAGS.find((tag) => tag.id === tagId)
        if (selectedTag && !selectedTags.some((t) => t.id === selectedTag.id)) {
            setSelectedTags((prev) => [...prev, selectedTag])
            setCurrentTagId("")
        }
    }

    const removeTag = (tagId: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId))
    }

    const setScope = (scope: ActionScope) => {
        setActionScope(scope)
        setStep("action")
    }

    const setAction = (action: ActionType) => {
        setActionType(action)
        setStep("target")
    }

    const setTargetAndConfirm = (targetValue: "selected" | "filtered") => {
        setTarget(targetValue)
        setStep("confirm")
    }

    const availableTagsExist =
        TAGS.filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id)).length > 0


    const prepareActionData = () => {
        if (!actionType || !target) return null

        return {
            actionType,
            scope: target,
            options: selectedTags.length > 0 ? { tags: selectedTags } : undefined
        }
    }

    console.log(prepareActionData)

    return {
        state: {
            open,
            step,
            actionScope,
            actionType,
            selectedTags,
            currentTagId,
            target,
            orders,
            availableTagsExist
        },
        actions: {
            toggleOpen,
            prepareActionData,
            goBack,
            reset,
            handleClose,
            handleTagSelect,
            removeTag,
            setScope,
            setAction,
            setTargetAndConfirm
        }
    }
}