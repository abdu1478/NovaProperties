import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/utils/api";

export const useTestimonials = () =>
  useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
