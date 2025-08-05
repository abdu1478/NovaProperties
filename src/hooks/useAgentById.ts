import { useQuery } from "@tanstack/react-query";
import { fetchAgentById } from "@/utils/api";

export const useAgentById = (id: string) =>
  useQuery({
    queryKey: ["agent", id],
    queryFn: () => fetchAgentById(id),
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
