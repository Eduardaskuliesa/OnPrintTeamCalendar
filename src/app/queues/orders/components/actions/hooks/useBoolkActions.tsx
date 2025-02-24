"use client";
import { ordersActions } from "@/app/lib/actions/orders";
import { TagType } from "@/app/types/orderApi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export function useBulkActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const executeAction = async (
    actionType: string,
    scope: "selected" | "filtered",
    orderIds: number[],
    where: any,
    reset: () => void,
    options?: { tags?: TagType[] }
  ) => {
    const tagsIds = options?.tags?.map((tag) => tag.id) || [];
    console.log(where);
    const sendData = {
      tagIds: tagsIds,
      orderIds: orderIds.map((order) => order),
    };

    console.log("SendDATA:", sendData, actionType);
    setIsLoading(true);
    setError(null);

    try {
      if (scope === "selected") {
        switch (actionType) {
          case "pauseOrders":
            break;
          // case "resumeOrders":
          //     await resumeSelectedOrders(orderIds)
          //     break
          // case "inactiveOrders":
          //     await inactiveSelectedOrders(orderIds)
          //     break
          // case "deleteOrders":
          //     await deleteSelectedOrders(orderIds)
          //     break
          // case "addTag":
          //     await addTagToSelectedOrders(orderIds, options?.tags || [])
          //     break
          // case "removeTag":
          //     await removeTagFromSelectedOrders(orderIds, options?.tags || [])
          //     break
          case "resumeTag":
            try {
              const result = await ordersActions.tagScope.resumeTagsOrders(
                sendData
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo pratęsti");
              reset();
            } catch (error) {
              console.log(error);
            }

            break;
          case "pauseTag":
            try {
              const result = await ordersActions.tagScope.pauseTagsOrders(
                sendData
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo sustabdyti");
              reset();
            } catch (error) {
              console.log(error);
            }

            break;
          case "inactiveTag":
            try {
              const result = await ordersActions.tagScope.inactiveTagsOrders(
                sendData
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo sustabdyti");
              reset();
            } catch (error) {
              console.log(error);
            }

            break;
          default:
            throw new Error(`Unknown action type: ${actionType}`);
        }
      } else if (scope === "filtered") {
        // For filtered actions, we don't need orderIds
        switch (actionType) {
          // case "pauseOrders":
          //     await pauseOrders()
          //     break
          // case "resumeOrders":
          //     await resumeOrders()
          //     break
          // case "inactiveOrders":
          //     await inactiveOrders()
          //     break
          // case "deleteOrders":
          //     await deleteOrders()
          //     break
          // case "addTag":
          //     await addTagToOrders(options?.tags || [])
          //     break
          // case "removeTag":
          //     await removeTagFromOrders(options?.tags || [])
          //     break
          // case "pauseTag":
          //     await pauseTagForOrders(options?.tags || [])
          //     break
          // case "resumeTag":
          //     await resumeTagForOrders(options?.tags || [])
          //     break
          // case "inactiveTag":
          //     await inactiveTagForOrders(options?.tags || [])
          //     break
          default:
            throw new Error(`Unknown action type: ${actionType}`);
        }
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeAction,
    isLoading,
    error,
  };
}
