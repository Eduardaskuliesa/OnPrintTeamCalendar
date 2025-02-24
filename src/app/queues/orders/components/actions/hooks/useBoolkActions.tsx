"use client"

import { useState } from "react"
import { TagType } from "./useActionFlow"

// import {
//     pauseOrders, pauseSelectedOrders,
//     resumeOrders, resumeSelectedOrders,
//     inactiveOrders, inactiveSelectedOrders,
//     deleteOrders, deleteSelectedOrders,
//     addTagToOrders, addTagToSelectedOrders,
//     removeTagFromOrders, removeTagFromSelectedOrders,
//     pauseTagForOrders, pauseTagForSelectedOrders,
//     resumeTagForOrders, resumeTagForSelectedOrders,
//     inactiveTagForOrders, inactiveTagForSelectedOrders
// } from "@/app/actions/orderActions"

export function useBulkActions() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const executeAction = async (
        actionType: string,
        scope: "selected" | "filtered",
        orderIds: number[],
        options?: { tags?: TagType[] }
    ) => {
        setIsLoading(true)
        setError(null)

        try {
            // Map the action type and scope to the appropriate server action
            if (scope === "selected") {
                switch (actionType) {
                    // case "pauseOrders":
                    //     await pauseSelectedOrders(orderIds)
                    //     break
                    // case "resumeOrders":
                    //     await resumeSelectedOrders(orderIds)
                    //     break
                    // case "inactiveOrders":
                    //     await inactiveSelectedOrders(orderIds)
                    //     break
                    // case "deleteOrders":
                    //     await deleteSelectedOrders(orderIds)
                    //     break
                    // case "addTag":
                    //     await addTagToSelectedOrders(orderIds, options?.tags || [])
                    //     break
                    // case "removeTag":
                    //     await removeTagFromSelectedOrders(orderIds, options?.tags || [])
                    //     break
                    // case "pauseTag":
                    //     await pauseTagForSelectedOrders(orderIds, options?.tags || [])
                    //     break
                    // case "resumeTag":
                    //     await resumeTagForSelectedOrders(orderIds, options?.tags || [])
                    //     break
                    // case "inactiveTag":
                    //     await inactiveTagForSelectedOrders(orderIds, options?.tags || [])
                    //     break
                    default:
                        throw new Error(`Unknown action type: ${actionType}`)
                }
            } else if (scope === "filtered") {
                // For filtered actions, we don't need orderIds
                switch (actionType) {
                    // case "pauseOrders":
                    //     await pauseOrders()
                    //     break
                    // case "resumeOrders":
                    //     await resumeOrders()
                    //     break
                    // case "inactiveOrders":
                    //     await inactiveOrders()
                    //     break
                    // case "deleteOrders":
                    //     await deleteOrders()
                    //     break
                    // case "addTag":
                    //     await addTagToOrders(options?.tags || [])
                    //     break
                    // case "removeTag":
                    //     await removeTagFromOrders(options?.tags || [])
                    //     break
                    // case "pauseTag":
                    //     await pauseTagForOrders(options?.tags || [])
                    //     break
                    // case "resumeTag":
                    //     await resumeTagForOrders(options?.tags || [])
                    //     break
                    // case "inactiveTag":
                    //     await inactiveTagForOrders(options?.tags || [])
                    //     break
                    default:
                        throw new Error(`Unknown action type: ${actionType}`)
                }
            }

            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        executeAction,
        isLoading,
        error
    }
}