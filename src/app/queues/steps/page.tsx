import React from 'react'
import { Timer, Mail, Tag, Pencil, Trash, ToggleLeft, Filter, Plus, MoreVertical, MoreHorizontal, BookTemplate, LayoutTemplate, BookType } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'


const DUMMY_STEPS = [
    {
        stepId: "step1",
        waitDuration: 30,
        actionType: "send_email",
        template: "first_reminder",
        templateName: "First Purchase Reminder",
        tag: "Business Cards Reminder",
        isActive: true,
        jobsAffected: 125
    },
    {
        stepId: "step2",
        waitDuration: 15,
        actionType: "send_email",
        template: "second_reminder",
        templateName: "Special Discount Offer",
        tag: "Flyers Follow-up",
        isActive: false,
        jobsAffected: 45
    },
    {
        stepId: "step3",
        waitDuration: 7,
        actionType: "send_email",
        template: "final_offer",
        templateName: "Final Reminder",
        tag: "Business Cards Final",
        isActive: true,
        jobsAffected: 89
    },
    {
        stepId: "step4",
        waitDuration: 7,
        actionType: "send_email",
        template: "final_offer",
        templateName: "Final Reminder",
        tag: "Business Cards Final",
        isActive: true,
        jobsAffected: 89
    }
]

const page = () => {
    return (
        <div className="p-6 max-w-6xl">
            {/* Header with actions */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Žingsniai</h1>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100/80 hover:bg-gray-100 rounded-md">
                        <Filter className="w-4 h-4 text-gray-700" />
                        <span className="text-sm text-gray-700">Filtruoti</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-sm text-white">Pridėti žingsnį</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DUMMY_STEPS.map((step) => (
                    <div key={step.stepId} className="bg-slate-50 border-blue-50 border rounded-lg shadow-md">
                        {/* Header with actions */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-300">
                            <div>
                                <div className="font-semibold text-gray-900">{step.tag}</div>

                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md">
                                    <MoreHorizontal className="w-4 h-4 text-gray-700" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <span className="text-gray-700">Atnaujinti</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span className={step.isActive ? "text-amber-600" : "text-green-600"}>
                                            {step.isActive ? "Išjungti" : "Įjungti"}
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span className="text-red-600">Ištrinti</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Details */}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Timer className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{step.waitDuration} dienų laukimas</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <BookType className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{step.actionType}</span>
                                    </div>
                                    <div className='flex items-center text-gray-600'>
                                        <Mail className='w-4 h-4 mr-2'></Mail>
                                        <span className="text-sm">{step.templateName}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-semibold text-gray-900">{step.jobsAffected}</div>
                                    <div className="text-sm text-gray-500">paveiktos eilės</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page