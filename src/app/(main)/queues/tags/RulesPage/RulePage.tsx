import React, { useState } from 'react'
import { PageHeader } from '../PageHeader'
import { useGetAllRules } from '@/app/lib/actions/rules/hooks/useGetAllRules'

import { Plus, Loader2 } from 'lucide-react'
import { RuleCard } from './RuleCard'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import RuleFormUpdate from './RuleUpdateForm'
import RuleCallFormButton from './RuleCallFormButton'


// Mock API functions - replace with your actual implementations
const deleteRule = async (ruleId: number) => {
    // Replace with actual API call
    return { success: true };
};

interface Rule {
    id: number;
    ruleName: string;
    tags: number[];
    ruleType: 'Global' | 'Subscriber' | 'Product' | 'All';
}

const RulePage = () => {
    const { data: rulesData, isFetching } = useGetAllRules()
    const [deletingRuleIds, setDeletingRuleIds] = useState<number[]>([])
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const queryClient = useQueryClient()

    const rules = rulesData?.data.data || []

    const handleDeleteRule = async (ruleId: number) => {
        setDeletingRuleIds(prev => [...prev, ruleId])

        try {
            const response = await deleteRule(ruleId)

            if (response.success) {
                toast.success('Taisyklė sėkmingai ištrinta')
                await queryClient.invalidateQueries({ queryKey: ['rules'] })
            } else {
                toast.error('Nepavyko ištrinti taisyklės')
            }
        } catch (error) {
            console.error('Error deleting rule:', error)
            toast.error('Įvyko klaida trinant taisyklę')
        } finally {
            setDeletingRuleIds(prev => prev.filter(id => id !== ruleId))
        }
    }

    const handleUpdateRule = (rule: Rule) => {
        setSelectedRule(rule)
        setShowUpdateForm(true)
    }

    return (
        <div>
            <PageHeader
                isFetching={isFetching}
                headerName='Taisyklės'
                searchQuery=""
                onSearchChange={() => { }}
            >
                <RuleCallFormButton
                    buttonClassName="flex group items-center gap-2 px-4 py-2 bg-dcoffe hover:bg-vdcoffe rounded-md transition-colors whitespace-nowrap"
                    iconClassName="w-4 h-4 text-db group-hover:text-gray-50"
                >
                    <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-db group-hover:text-gray-50" />
                        <span className="text-sm text-db group-hover:text-gray-50">
                            Pridėti taisyklę
                        </span>
                    </span>
                </RuleCallFormButton>
            </PageHeader>

            {isFetching ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : rules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {rules.map((rule: any) => (
                        <RuleCard
                            key={rule.id}
                            rule={rule}
                            onDelete={handleDeleteRule}
                            onUpdate={handleUpdateRule}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg mt-6">
                    <p className="text-gray-500">Nėra taisyklių</p>
                    <p className="text-gray-400 text-sm mt-2">Spauskite &quot;Pridėti taisyklę&quot; norėdami sukurti naują taisyklę</p>
                </div>
            )}

            {/* Update Form Modal */}
            {showUpdateForm && selectedRule && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => {
                        setShowUpdateForm(false);
                        setSelectedRule(null);
                    }}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-lg mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <RuleFormUpdate
                            rule={selectedRule}
                            onCancel={() => {
                                setShowUpdateForm(false);
                                setSelectedRule(null);
                            }}
                            isOpen={showUpdateForm}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default RulePage