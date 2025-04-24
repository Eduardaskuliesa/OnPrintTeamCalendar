import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Loader2 } from "lucide-react";
import { useGetAllSalesAgents } from "@/app/lib/actions/salesAgent/hooks/useGetAllSalesAgents";
import { SalesAgent } from "@/app/types/orderApi";
import { Checkbox } from "@/components/ui/checkbox";

interface AgentFilterProps {
  selectedAgents: number[];
  onChange: (agentIds: number[]) => void;
  onClear: () => void;
}

export const AgentFilter = ({
  selectedAgents,
  onChange,
  onClear,
}: AgentFilterProps) => {
  const { data: salesAgentsData, isLoading } = useGetAllSalesAgents();

  const salesAgents = salesAgentsData?.data?.salesAgents || [];

  useEffect(() => {
    console.log(selectedAgents)
  }, [selectedAgents])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border border-gray-300" asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center truncate">
            <User className="h-4 w-4 mr-2 text-gray-700" />
            {isLoading ? (
              <span className="flex items-center">
                Kraunama... <Loader2 className="ml-2 h-3 w-3 animate-spin" />
              </span>
            ) : (
              selectedAgents.length > 0
                ? `Pasirinkta ${selectedAgents.length} vadybininkai`
                : "Vadybininkas"
            )}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 max-h-[300px] custom-scrollbar overflow-y-auto bg-white" align="start">
        {isLoading ? (
          <div className="py-2 px-4 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Kraunama...</span>
          </div>
        ) : (
          <>
            {salesAgents.map((agent: SalesAgent) => (
              <DropdownMenuItem
                key={agent.id}
                onSelect={(e) => {
                  e.preventDefault();
                  const newSelected = selectedAgents.includes(agent.id)
                    ? selectedAgents.filter((id) => id !== agent.id)
                    : [...selectedAgents, agent.id];
                  onChange(newSelected);
                }}
                className="py-2 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <Checkbox checked={selectedAgents.includes(agent.id)} />
                <span className="ml-2">{agent.name}</span>
              </DropdownMenuItem>
            ))}
            {selectedAgents.length > 0 && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  onClear()
                }
                }
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
              >
                Išvalyti
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

