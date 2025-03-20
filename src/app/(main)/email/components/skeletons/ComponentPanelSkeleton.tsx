import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ComponentPanelSkeleton = () => {
    return (
        <div className="min-h-[350px] shadow-md rounded-md bg-slate-50 border-blue-50 border-2 p-10 space-y-6">
            <Skeleton className="w-32 h-5 animate-pulse"></Skeleton>
            <div className="flex flex-row gap-2">
                <Skeleton className="h-8 w-44 animate-pulse"></Skeleton>
                <Skeleton className="h-8 w-44 animate-pulse"></Skeleton>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-[320px]">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md border-2 p-4 aspect-square">
                        <Skeleton className="w-6 h-6 rounded-md mb-2 animate-pulse"></Skeleton>
                        <Skeleton className="h-4 w-16 animate-pulse"></Skeleton>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ComponentPanelSkeleton