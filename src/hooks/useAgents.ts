import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/utils/api";

export const useAgents = () =>
  useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
