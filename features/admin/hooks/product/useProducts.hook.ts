import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "../../types/product/products.type";

async function fetchProducts() {
  const res = await fetch("/api/admin/products");
  if (!res.ok) throw new Error("Falha ao buscar produtos");
  return res.json() as Promise<ProductType[]>;
}

export function useProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchProducts,
  });
}
