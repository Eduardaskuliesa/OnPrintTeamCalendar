"use client"

import { Tags, Package } from "lucide-react"
import { ActionButton } from "../ActionButton"
import { ActionScope } from "../../hooks/useActionFlow"

interface ScopeStepProps {
    actionScope: ActionScope
    setScope: (scope: ActionScope) => void
}

export function ScopeStep({ actionScope, setScope }: ScopeStepProps) {
    return (
        <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Pasirinkite veiksmų sritį
            </div>
            <ActionButton
                icon={Tags}
                label="Tagų veiksmai"
                description="Pridėti, pašalinti arba keisti tagus"
                onClick={() => setScope("tag")}
                selected={actionScope === "tag"}
            />
            <ActionButton
                icon={Package}
                label="Užsakymų veiksmai"
                description="Valdyti užsakymų būseną"
                onClick={() => setScope("order")}
                selected={actionScope === "order"}
            />
        </div>
    )
}