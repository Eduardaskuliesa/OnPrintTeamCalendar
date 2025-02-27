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
    resetAndClear: () => void,
    options?: { tags?: TagType[] }
  ) => {
    const tagsIds = options?.tags?.map((tag) => tag.id) || [];
    console.log(where);
    const sendDataTagScope = {
      tagIds: tagsIds,
      orderIds: orderIds.map((order) => order),
    };
    const sendDataOrderScope = {
      orderIds: orderIds.map((order) => order),
    };

    const sendDataFilteredTagScope = {
      where,
      tagIds: tagsIds
    }

    const sendDataFilteredOrderScope = {
      where
    }
    setIsLoading(true);
    setError(null);

    try {
      if (scope === "selected") {
        switch (actionType) {
          case "pauseOrders":
            try {
              const result = await ordersActions.orderScope.pauseOrders(
                sendDataOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti užsakymai buvo sustabdyti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "resumeOrders":
            try {
              const result = await ordersActions.orderScope.resumeOrders(
                sendDataOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti užsakymai buvo pratęsti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "inactiveOrders":
            try {
              const result = await ordersActions.orderScope.inactiveOrders(
                sendDataOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti užsakymai buvo išjungti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "deleteOrders":
            try {
              const result = await ordersActions.orderScope.deleteOrders(
                sendDataOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti užsakymai buvo ištrynti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "addTag":
            try {
              const result = await ordersActions.tagScope.addTagsToOrders(
                sendDataTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo pridėti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "removeTag":
            try {
              const result = await ordersActions.tagScope.removeTagsFromoOrders(
                sendDataTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo ištryntį");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "resumeTag":
            try {
              const result = await ordersActions.tagScope.resumeTagsOrders(
                sendDataTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo pratęsti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "pauseTag":
            try {
              const result = await ordersActions.tagScope.pauseTagsOrders(
                sendDataTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo sustabdyti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          case "inactiveTag":
            try {
              const result = await ordersActions.tagScope.inactiveTagsOrders(
                sendDataTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Pasirinkti tagai buvo išjungti");
              resetAndClear();
            } catch (error) {
              console.log(error);
            }

            break;
          default:
            throw new Error(`Unknown action type: ${actionType}`);
        }
      } else if (scope === "filtered") {
        switch (actionType) {
          case "pauseOrders":
            try {
              const result = await ordersActions.bulk.pauseOrdersBulk(
                sendDataFilteredOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break;
          case "resumeOrders":
            try {
              const result = await ordersActions.bulk.resumeOrdersBulk(
                sendDataFilteredOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break;
          case "inactiveOrders":
            try {
              const result = await ordersActions.bulk.inactiveOrdersBulk(
                sendDataFilteredOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break;
          case "deleteOrders":
            try {
              const result = await ordersActions.bulk.deleteOrdersBulk(
                sendDataFilteredOrderScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break;

          case "addTag":
            try {
              const result = await ordersActions.bulk.addTagsToFilteredOrders(
                sendDataFilteredTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break;
          case "removeTag":
            try {
              const result = await ordersActions.bulk.removeTagsToFilteredOrders(
                sendDataFilteredTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break
          case "pauseTag":
            try {
              const result = await ordersActions.bulk.pauseTagsToFilteredOrders(
                sendDataFilteredTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break
          case "resumeTag":
            try {
              const result = await ordersActions.bulk.resumeTagsToFilteredOrders(
                sendDataFilteredTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break
          case "inactiveTag":
            try {
              const result = await ordersActions.bulk.inactiveTagsToFilteredOrders(
                sendDataFilteredTagScope
              );
              if (!result.success) {
                toast.error("Įvyko klaida");
                break;
              }
              await queryClient.invalidateQueries({ queryKey: ["orders"] });
              toast.success("Sėkmingai gavome užklausą, prašome palaukti, gali užtrukti iki kelių minučių", {
                autoClose: 6000
              });
              resetAndClear();
            } catch (error) {
              console.log(error);
            }
            break
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
