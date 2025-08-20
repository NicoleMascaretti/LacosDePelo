import { useEffect, useState } from "react";
import type { ProductType } from "../types/ProductType";
interface UseProductsProps {
  tag?: string;
}

export function useProducts({ tag }: UseProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
        const res = await fetch(`/products${query}`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tag]);

  return { products, loading, error };
}

