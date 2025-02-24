export function getTranslatedAction(actionType: string | null): string {
    if (!actionType) return ""

    const translations: Record<string, string> = {
        "add": "Pridėti",
        "remove": "Pašalinti",
        "pause": "Pristabdyti",
        "resume": "Atnaujinti",
        "inactive": "Neaktyvinti",
        "delete": "Ištrinti"
    }

    if (actionType.includes("Tag")) {
        const action = actionType.replace("Tag", "")
        return translations[action] || action
    } else if (actionType.includes("Orders")) {
        const action = actionType.replace("Orders", "")
        return translations[action] || action
    }

    return actionType
}