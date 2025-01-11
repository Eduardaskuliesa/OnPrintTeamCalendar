import { useQuery } from "@tanstack/react-query";
import { User } from "@/app/types/api";
import { getFreshUser } from "../getFreshUser";

export const useGetFreshUser = (userId: string) => 
    useQuery<User>({
      queryKey: ["user", userId],
      queryFn: async () => {
        const response = await getFreshUser(userId);
        return response.data as User;
      },
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: userId !== "",
    });