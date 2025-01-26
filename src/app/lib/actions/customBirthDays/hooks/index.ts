import { useQuery } from "@tanstack/react-query";
import { customBirthDayActions } from "..";
import { getAllCustomDays } from "../getAllCustomDays";

export const useGetAllCustomBirthDaysByUser = (userId: string) => {
  return useQuery({
    queryKey: ["birthdays", userId],
    queryFn: () => customBirthDayActions.getAllCustomBirthDaysByUser(userId),
  });
};

export const useGetAllCustomDays = () => {
  return useQuery({
    queryKey: ["customDays"],
    queryFn: () => getAllCustomDays(),
  });
};
