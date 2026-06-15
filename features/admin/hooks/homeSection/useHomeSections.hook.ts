import { useQuery } from "@tanstack/react-query";
import { getHomeSections } from "../../services/homeSection.service";

export function useHomeSections() {
  return useQuery({
    queryKey: ["admin", "home-sections"],
    queryFn: getHomeSections,
  });
}
