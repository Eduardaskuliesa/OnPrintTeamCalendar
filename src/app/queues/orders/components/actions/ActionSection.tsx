"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Package } from "lucide-react"
import { useActionFlow } from "./hooks/useActionFlow"
import { ScopeStep } from "./steps/ScopeStep"
import { ActionStep } from "./steps/ActionStep"
import { TargetStep } from "./steps/TargetStep"
import { ConfirmStep } from "./steps/ConfirmStep"
import { useBulkActions } from "./hooks/useBoolkActions"

interface ActionSectionProps {
    orders: number[]
}

export default function ActionSection({ orders }: ActionSectionProps) {
    const { state, actions } = useActionFlow({ orders })
    const { executeAction, isLoading } = useBulkActions();
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const isSelect = target.closest('[role="combobox"]') ||
                target.closest('[role="listbox"]')

            if (containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                !isSelect) {
                actions.handleClose()
            }
        }

        let lastScrollY = window.scrollY
        const handleScroll = () => {
            const scrollDifference = Math.abs(window.scrollY - lastScrollY)
            if (scrollDifference > 40 && state.open) {
                actions.handleClose()
            }

            lastScrollY = window.scrollY
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('scroll', handleScroll)


        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [actions, state.open])

    const handleConfirm = async () => {
        if (!state.actionType || !state.target) return;

        console.log(state)
        try {
            await executeAction(
                state.actionType,
                state.target,
                orders,
                state.selectedTags.length > 0 ? { tags: state.selectedTags } : undefined
            );

            actions.handleClose();
        } catch (err) {
            console.error("Failed to execute action:", err);
        }
    }

    const renderStep = () => {
        switch (state.step) {
            case "scope":
                return <ScopeStep
                    actionScope={state.actionScope}
                    setScope={actions.setScope}
                />
            case "action":
                return <ActionStep
                    actionScope={state.actionScope}
                    setAction={actions.setAction}
                />
            case "target":
                return <TargetStep
                    actionType={state.actionType}
                    orders={orders}
                    selectedTags={state.selectedTags}
                    currentTagId={state.currentTagId}
                    availableTagsExist={state.availableTagsExist}
                    onTagSelect={actions.handleTagSelect}
                    onTagRemove={actions.removeTag}
                    setTargetAndConfirm={actions.setTargetAndConfirm}
                />
            case "confirm":
                return <ConfirmStep
                    actionType={state.actionType}
                    target={state.target}
                    orders={orders}
                    selectedTags={state.selectedTags}
                    isLoading={isLoading}
                    goBack={actions.goBack}
                    handleConfirm={handleConfirm}
                />
        }
    }

    return (
        <div className="relative mb-4" ref={containerRef}>
            <Button
                onClick={actions.toggleOpen}
                variant="outline"
                className="bg-dcoffe text-db hover:bg-vdcoffe hover:text-gray-50 transition-colors h-9"
            >
                <Package className="w-4 h-4 mr-1.5" />
                Masiniai veiksmai
            </Button>

            {state.open && (
                <Card className="absolute z-50 bg-white top-[calc(100%+4px)] left-0 w-[320px] py-1.5 rounded-md px-2 shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="max-h-[450px] overflow-y-auto">
                        {(state.step !== "scope" && state.step !== 'confirm') && (
                            <Button variant="ghost" size="sm" className="absolute top-2 left-1.5 h-6 w-6 p-0" onClick={actions.goBack}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {renderStep()}
                    </div>
                </Card>
            )}
        </div>
    )
}