import React, { useState } from "react";
import {
  MoreVertical,
  Trash,
  Edit,
  Globe,
  Users,
  Package,
  Tag,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagType } from "@/app/types/orderApi";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import ConfirmModal from "@/app/ui/ConfirmModal";

interface Rule {
  id: number;
  ruleName: string;
  tags: number[];
  ruleType: "Global" | "Subscriber" | "Product" | "All";
}

interface RuleCardProps {
  rule: Rule;
  onDelete: (id: number) => void;
  onUpdate: (rule: Rule) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule, onUpdate, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: tagsData } = useGetTags();

  const tagObjects =
    tagsData?.data?.filter((tag: TagType) => rule.tags.includes(tag.id)) || [];

  const getRuleTypeIcon = () => {
    switch (rule.ruleType) {
      case "Global":
        return <Globe className="h-4 w-4 mr-1" />;
      case "Subscriber":
        return <Users className="h-4 w-4 mr-1" />;
      case "Product":
        return <Package className="h-4 w-4 mr-1" />;
      case "All":
        return <LayoutGrid className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-slate-50 border-2 border-blue-50 rounded-md shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          {getRuleTypeIcon()}
          {rule.ruleName}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => onUpdate(rule)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Redaguoti</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDeleteConfirm(true)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Ištrinti</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Badge
            variant="destructive"
            className="bg-vdcoffe text-gray-50 font-normal"
          >
            {rule.ruleType}
          </Badge>
        </div>

        <div className="mb-1 flex items-center">
          <Tag className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Tagai :</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {tagObjects.length > 0 ? (
            tagObjects.map((tag: TagType) => (
              <Badge
                key={tag.id}
                className="flex items-center rounded-md shadow-sm border-gray-200 border-t-dcoffe bg-white border  border-t-2 text-db text-xs py-1"
              >
                {tag.tagName}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500 italic">Nėra tagų</span>
          )}
        </div>
      </CardContent>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(rule.id)
        }}
        loading={false}
        message={`Ar tikrai norite ištrinti taisyklę "${rule.ruleName}"?`}
      />
    </Card>
  );
};
