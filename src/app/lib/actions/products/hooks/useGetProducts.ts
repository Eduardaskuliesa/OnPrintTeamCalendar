import { useQuery } from "@tanstack/react-query";
import { productActions } from "..";

export const useGetAllProducts = () =>
  useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await productActions.getProducts()
      console.log("Hook received from server:", response);
      return response;
    },
    refetchOnMount: true,
    staleTime: 6000,
    gcTime: 6000,
  });
