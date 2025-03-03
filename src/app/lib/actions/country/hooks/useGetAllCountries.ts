import { useQuery } from "@tanstack/react-query";
import { countriesActions } from "..";


export const useGetAllCountries = () =>
    useQuery({
        queryKey: ["all-countries"],
        queryFn: async () => {
            const response = await countriesActions.getCountries()
            console.log("Hook received from server:", response);
            return response;
        },
        refetchOnMount: true,
        staleTime: 6000,
        gcTime: 6000,
    });
