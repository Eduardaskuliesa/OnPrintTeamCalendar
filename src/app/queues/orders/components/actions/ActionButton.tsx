"use client"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
    icon: LucideIcon
    label: string
    description?: string
    onClick: () => void
    variant?: "default" | "destructive"
    selected?: boolean
}

export function ActionButton({
    icon: Icon,
    label,
    description,
    onClick,
    variant = "default",
    selected = false
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-md transition-all text-left",
                "hover:bg-slate-100",
                selected && "bg-blue-50",
                variant === "destructive" && "hover:bg-red-50 hover:text-red-600",
            )}
        >
            <Icon
                className={cn(
                    "w-4 h-4",
                    variant === "destructive" ? "text-red-600" : "text-primary",
                    selected && "text-blue-600"
                )}
            />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </button>
    )
}