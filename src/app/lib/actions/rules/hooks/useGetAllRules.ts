import { useQuery } from "@tanstack/react-query";
import { rulesAction } from "..";

export const useGetAllRules = () =>
    useQuery({
        queryKey: ["all-rules"],
        queryFn: async () => {
            const response = await rulesAction.getRules()
            console.log("Hook received from server:", response);
            return response;
        },
        refetchOnMount: true,
        staleTime: 600000,
        gcTime: 600000,
});
