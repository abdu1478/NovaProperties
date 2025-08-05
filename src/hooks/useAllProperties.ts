import { useQuery } from "@tanstack/react-query";
import { fetchAllProperties, type Property } from "@/utils/api";

type PropertiesResponse = {
  data: Property[];
  total: number;
};
export const useAllProperties = () => {
  return useQuery<PropertiesResponse, Error>({
    queryKey: ["properties", "all"],
    queryFn: fetchAllProperties,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};
