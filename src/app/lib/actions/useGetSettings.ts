import { useQuery } from "@tanstack/react-query";
import { getGlobalSettings } from "./settings/global/getGlobalSettings";

export const useGlobalSettings = () => {
  return useQuery({
    queryKey: ["getGlobalSettings"],
    queryFn: () => getGlobalSettings(),
  });
};
