"use client";

import { Package } from "lucide-react";
import { ActionButton } from "../ActionButton";
import { ActionType } from "../../hooks/useActionFlow";
import { TagSelection } from "../TagSelection";
import { TagType } from "@/app/types/orderApi";

interface TargetStepProps {
  actionType: ActionType;
  orders: number[];
  selectedTags: TagType[];
  currentTagId: number;
  availableTagsExist: boolean;
  onTagSelect: (tagId: number) => void;
  onTagRemove: (tagId: number) => void;
  setTargetAndConfirm: (target: "selected" | "filtered") => void;
}

export function TargetStep({
  actionType,
  orders,
  selectedTags,
  currentTagId,
  availableTagsExist,
  onTagSelect,
  onTagRemove,
  setTargetAndConfirm,
}: TargetStepProps) {
  return (
    <div className="space-y-3">
      {actionType?.includes("Tag") && (
        <TagSelection
          selectedTags={selectedTags}
          currentTagId={currentTagId}
          availableTagsExist={availableTagsExist}
          onTagSelect={onTagSelect}
          onTagRemove={onTagRemove}
        />
      )}

      <div>
        <ActionButton
          icon={Package}
          label="Pasirinkti užsakymai"
          description={`Taikyti ${orders.length} užsakymams`}
          onClick={() => setTargetAndConfirm("selected")}
        />
        <ActionButton
          icon={Package}
          label="Visi filtruoti užsakymai"
          description="Taikyti visiems filtruotiems užsakymams"
          onClick={() => setTargetAndConfirm("filtered")}
        />
      </div>
    </div>
  );
}
