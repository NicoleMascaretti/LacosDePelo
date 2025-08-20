//Esse pedaço comentado é pra quando tiver API e Back
/* import { useProducts } from "../hooks/useProduct";
import ProductCard from "./ui/ProductCard";

export default function ProductList() {
  const { products, loading, error } = useProducts({});

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} viewMode="grid" />
      ))}
    </div>
  );
}
 */

import ProductCard from "./ui/ProductCard";
import type { ProductType } from "../types/ProductType";

const mockProducts: ProductType[] = [
  {
    id: 1,
    name: "Ração Premium para Cães",
    price: 129.9,
    originalPrice: 159.9, // essa informação é opcional por conta do jeito que está no product type
    category: "Rações",
    rating: 4.5,
    reviews: 23,
    image: "https://place-puppy.com/300x300",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 2,
    name: "Brinquedo Mordedor",
    price: 39.9,
    originalPrice: 49.9,
    category: "Brinquedos",
    rating: 4,
    reviews: 12,
    image: "https://placekitten.com/300/300",
    inStock: true,
    badge: "Novo",
  },
  {
    id: 3,
    name: "Coleira Estilosa",
    price: 59.9,
    category: "Acessórios",
    rating: 5,
    reviews: 8,
    image: "https://placebear.com/300/300",
    inStock: true,
  },
];

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} product={p} viewMode="grid" />
      ))}
    </div>
  );
}


