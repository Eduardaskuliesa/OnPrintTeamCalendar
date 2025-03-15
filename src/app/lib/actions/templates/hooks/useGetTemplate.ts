import { Template } from "@/app/types/emailTemplates";
import { useQuery } from "@tanstack/react-query";
import { tempalteActions } from "..";

export const useGetTemplate = (id: Template["id"]) =>
  useQuery({
    queryKey: [`template${id}`, id],
    queryFn: async () => {
      const response = await tempalteActions.getTemplate(id);
      return response;
    },
  });
