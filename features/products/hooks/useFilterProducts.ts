import { ListingParams } from "../types/productsFindParams.type";

export default function useFilterProducts() {
 
  function buildUrl(params: ListingParams): string {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        sp.set(key, value);
      }
    }
    const query = sp.toString();
    return query ? `/products?${query}` : "/products";
  }

  return {
    buildUrl,
  };
}
