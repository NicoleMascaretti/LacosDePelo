import { useEffect, useState } from "react";
import { fetchProducts } from "../services/Api";
import type { ProductType } from "../types/ProductType"; 
import ProductCard from "../components/ui/ProductCard";

const products: ProductType[] = [
  {
    id: 1,
    name: "Ração Premium para Cães",
    price: 129.9,
    originalPrice: 159.9,
    category: "Rações",
    rating: 4.5,
    reviews: 23,
    image: "https://place-puppy.com/300x300",
    inStock: true,
    badge: "Mais Vendido",
  }
]

export default function Produtos() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => alert("Erro ao carregar produtos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Carregando produtos...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode="grid" />
      ))}
    </div>
  );
}
