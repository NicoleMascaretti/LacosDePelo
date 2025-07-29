import { useEffect, useState } from "react";
import { useCategory } from "../contexts/CategoryContext";

// Ajuste a interface conforme a resposta da Shopify
interface ShopifyCategory {
  id: number;
  title: string;
}

export function useCategories() {
  const { setCategorias } = useCategory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://SUA-LOJA.myshopify.com/admin/api/2023-01/collections.json", {
      headers: {
        "X-Shopify-Access-Token": "SUA_ACCESS_TOKEN",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        return res.json();
      })
      .then((data) => {
        // Adapte conforme a estrutura da resposta da Shopify
        const categorias = (data.collections || []).map((cat: ShopifyCategory) => ({
          id: cat.id,
          nome: cat.title,
        }));
        setCategorias(categorias);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setCategorias]);

  return { loading, error };
}