import { useQuery } from "@tanstack/react-query";
import { fetchIndividualProperty } from "@/utils/api";

export const usePropertyById = (id: string) =>
  useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchIndividualProperty(id),
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });
