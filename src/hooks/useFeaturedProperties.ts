import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProperties } from "@/utils/api";

export const useFeaturedProperties = () =>
  useQuery({
    queryKey: ["properties", "featured"],
    queryFn: fetchFeaturedProperties,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
