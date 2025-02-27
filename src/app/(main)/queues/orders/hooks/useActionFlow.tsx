"use client";

import { useState } from "react";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { TagType } from "@/app/types/orderApi";

export type Step = "scope" | "action" | "target" | "confirm";
export type ActionScope = "tag" | "order" | null;
export type ActionType =
  | "addTag"
  | "removeTag"
  | "pauseTag"
  | "resumeTag"
  | "inactiveTag"
  | "pauseOrders"
  | "resumeOrders"
  | "inactiveOrders"
  | "deleteOrders"
  | null;

interface UseActionFlowOptions {
  orders: number[];
}

export function useActionFlow({ orders }: UseActionFlowOptions) {
  const { data: tagsData } = useGetTags();
  const tags = tagsData?.data || [];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("scope");
  const [actionScope, setActionScope] = useState<ActionScope>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [currentTagId, setCurrentTagId] = useState<number | null>();
  const [target, setTarget] = useState<"selected" | "filtered" | null>(null);

  const toggleOpen = () => setOpen(!open);

  const goBack = () => {
    if (step === "scope") return;
    if (step === "action") {
      setStep("scope");
      setActionScope(null);
      return;
    }
    if (step === "target") {
      setStep("action");
      setActionType(null);
      return;
    }
    if (step === "confirm") {
      setStep("target");
      setTarget(null);
      return;
    }
  };

  const reset = () => {
    setStep("scope");
    setActionScope(null);
    setActionType(null);
    setSelectedTags([]);
    setCurrentTagId(null);
    setTarget(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTagSelect = (tagId: number) => {
    const selectedTag = tags.find((tag: TagType) => tag.id === tagId);
    if (selectedTag && !selectedTags.some((t) => t.id === selectedTag.id)) {
      setSelectedTags((prev) => [...prev, selectedTag]);
      setCurrentTagId(null);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const setScope = (scope: ActionScope) => {
    setActionScope(scope);
    setStep("action");
  };

  const setAction = (action: ActionType) => {
    setActionType(action);
    setStep("target");
  };

  const setTargetAndConfirm = (targetValue: "selected" | "filtered") => {
    setTarget(targetValue);
    setStep("confirm");
  };

  const availableTagsExist =
    tags.filter(
      (tag: TagType) =>
        !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
    ).length > 0;

  const prepareActionData = () => {
    if (!actionType || !target) return null;

    return {
      actionType,
      scope: target,
      options: selectedTags.length > 0 ? { tags: selectedTags } : undefined,
    };
  };

  return {
    state: {
      open,
      step,
      actionScope,
      actionType,
      selectedTags,
      currentTagId,
      target,
      orders,
      availableTagsExist,
      tags,
    },
    actions: {
      toggleOpen,
      prepareActionData,
      goBack,
      reset,
      handleClose,
      handleTagSelect,
      removeTag,
      setScope,
      setAction,
      setTargetAndConfirm,
    },
  };
}
