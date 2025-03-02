import React from "react";
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

interface AgentFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onClear: () => void;
}

export const AgentFilter = ({ value, onChange, onClear }: AgentFilterProps) => {
  const { data: salesAgentsData, isLoading } = useGetAllSalesAgents();

  const salesAgents = salesAgentsData?.data?.salesAgents || [];

  const selectedAgent = salesAgents.find(
    (agent: SalesAgent) => agent.id === value
  );

  const displayName = selectedAgent ? selectedAgent.name : "Vadybininkas";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border border-gray-300" asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-700" />
            {isLoading ? (
              <span className="flex items-center">
                Kraunama... <Loader2 className="ml-2 h-3 w-3 animate-spin" />
              </span>
            ) : (
              displayName
            )}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white" align="start">
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
                onClick={() => onChange(agent.id)}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                {agent.name}
              </DropdownMenuItem>
            ))}
            {value && (
              <DropdownMenuItem
                onClick={onClear}
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
};
