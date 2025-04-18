export const bullTimeConvert = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} d.`
    if (hours > 0) return `${hours} val.`
    if (minutes > 0) return `${minutes} min.`
    return `${seconds} sek.`
}

