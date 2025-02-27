"use client"
import { Tags, Play, Pause, Trash2, Ban, X } from "lucide-react"
import { ActionButton } from "../ActionButton"
import { ActionScope, ActionType } from "../../hooks/useActionFlow"

interface ActionStepProps {
    actionScope: ActionScope
    setAction: (action: ActionType) => void
}

export function ActionStep({ actionScope, setAction }: ActionStepProps) {
    return (
        <div className="space-y-1">
            <div className="px-3 py-2 ml-7 text-xs font-medium text-muted-foreground">
                {actionScope === "tag" ? "Pasirinkite tago veiksmą" : "Pasirinkite užsakymo veiksmą"}
            </div>
            {actionScope === "tag" ? (
                <>
                    <ActionButton
                        icon={Tags}
                        label="Pridėti tagą"
                        onClick={() => setAction("addTag")}
                    />
                    <ActionButton
                        icon={X}
                        label="Pašalinti tagą"
                        onClick={() => setAction("removeTag")}
                    />
                    <ActionButton
                        icon={Pause}
                        label="Pristabdyti tagą"
                        onClick={() => setAction("pauseTag")}
                    />
                    <ActionButton
                        icon={Play}
                        label="Tęsti tagą"
                        onClick={() => setAction("resumeTag")}
                    />
                    <ActionButton
                        icon={Ban}
                        label="Neaktyvus tagas"
                        onClick={() => setAction("inactiveTag")}
                    />
                </>
            ) : (
                <>
                    <ActionButton
                        icon={Pause}
                        label="Pristabdyti užsakymus"
                        onClick={() => setAction("pauseOrders")}
                    />
                    <ActionButton
                        icon={Play}
                        label="Tęsti užsakymus"
                        onClick={() => setAction("resumeOrders")}
                    />
                    <ActionButton
                        icon={Ban}
                        label="Neaktyvūs užsakymai"
                        onClick={() => setAction("inactiveOrders")}
                    />
                    <ActionButton
                        icon={Trash2}
                        label="Ištrinti užsakymus"
                        variant="destructive"
                        onClick={() => setAction("deleteOrders")}
                    />
                </>
            )}
        </div>
    )
}