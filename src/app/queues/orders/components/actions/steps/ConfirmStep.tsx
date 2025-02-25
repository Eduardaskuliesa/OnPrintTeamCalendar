import { Badge } from "@/components/ui/badge";
import { getTranslatedAction } from "../utils/getTranslatedAction";
import { Button } from "@/components/ui/button";
import { ActionType } from "../hooks/useActionFlow";
import { Loader2 } from "lucide-react";
import { TagType } from "@/app/types/orderApi";
import { bullTimeConvert } from "@/app/utils/bullTimeConvert";

interface ConfirmStepProps {
  actionType: ActionType;
  target: "selected" | "filtered" | null;
  orders: number[];
  selectedTags: TagType[];
  isLoading: boolean;
  goBack: () => void;
  handleConfirm: () => void;
}

export function ConfirmStep({
  actionType,
  target,
  orders,
  selectedTags,
  isLoading,
  goBack,
  handleConfirm,
}: ConfirmStepProps) {
  const noOrders = orders.length === 0 && target === 'selected';
  console.log(noOrders);
  return (
    <div className="px-2 py-2 space-y-3">
      <div className="bg-muted/50 rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Patvirtinti veiksmą</div>
        <div className="text-xs text-muted-foreground">
          {actionType?.includes("Tag") ? (
            <>
              {getTranslatedAction(actionType)} {selectedTags.length} tagus{" "}
              {target === "selected"
                ? `${orders.length} pasirinktiems`
                : "visiems filtruotiems"}{" "}
              užsakymams
            </>
          ) : (
            <>
              {getTranslatedAction(actionType)}{" "}
              {target === "selected"
                ? `${orders.length} pasirinktus`
                : "visus filtruotus"}{" "}
              užsakymus
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="bg-slate-200 border-2 border-blue-50 text-xs px-2 py-1"
            >
              {tag.tagName} - {bullTimeConvert(tag.scheduledFor)}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs px-2 py-1">
            {target === "selected"
              ? `${orders.length} Pasirinkta`
              : "Visi filtruoti"}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={goBack}>
          Atgal
        </Button>
        <Button
          variant={actionType?.includes("delete") ? "destructive" : "default"}
          size="sm"
          className="flex-1"
          onClick={handleConfirm}
          disabled={isLoading || !!noOrders}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Vykdoma...
            </>
          ) : (
            "Patvirtinti"
          )}
        </Button>
      </div>
    </div>
  );
}
