import { useEffect, useState } from "react";
// import { fetchProducts } from "../services/Api";
import type { ProductType } from "../types/ProductType"; 
import ProductCard from "../components/ui/ProductCard";

const mockProducts: ProductType[] = [
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
  },
  {
    id: 2,
    name: "Brinquedo Mordedor",
    price: 39.9,
    originalPrice: 49.9,
    category: "Brinquedos",
    rating: 4.8,
    reviews: 12,
    image: "https://place-puppy.com/301x301",
    inStock: true,
    badge: "Novo",
  },
  {
    id: 3,
    name: "Coleira Ajustável",
    price: 24.9,
    originalPrice: 29.9,
    category: "Acessórios",
    rating: 4.2,
    reviews: 8,
    image: "https://place-puppy.com/302x302",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 4,
    name: "Shampoo Suave para Pets",
    price: 19.9,
    originalPrice: 25.9,
    category: "Higiene",
    rating: 4.7,
    reviews: 15,
    image: "https://place-puppy.com/303x303",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 5,
    name: "Tapete Higiênico",
    price: 59.9,
    originalPrice: 69.9,
    category: "Higiene",
    rating: 4.3,
    reviews: 10,
    image: "https://place-puppy.com/304x304",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 6,
    name: "Ração Sênior para Gatos",
    price: 99.9,
    originalPrice: 119.9,
    category: "Rações",
    rating: 4.6,
    reviews: 18,
    image: "https://place-puppy.com/305x305",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 7,
    name: "Arranhador para Gatos",
    price: 89.9,
    originalPrice: 109.9,
    category: "Brinquedos",
    rating: 4.9,
    reviews: 22,
    image: "https://place-puppy.com/306x306",
    inStock: true,
    badge: "Novo",
  },
  {
    id: 8,
    name: "Comedouro Antiformiga",
    price: 34.9,
    originalPrice: 44.9,
    category: "Acessórios",
    rating: 4.1,
    reviews: 6,
    image: "https://place-puppy.com/307x307",
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 9,
    name: "Vermífugo Oral",
    price: 49.9,
    originalPrice: 59.9,
    category: "Medicamentos",
    rating: 4.4,
    reviews: 9,
    image: "https://place-puppy.com/308x308",
    inStock: true,
    badge: "Mais Vendido",
  },
  {
    id: 10,
    name: "Fralda Descartável para Pets",
    price: 44.9,
    originalPrice: 54.9,
    category: "Higiene",
    rating: 4.0,
    reviews: 5,
    image: "https://place-puppy.com/309x309",
    inStock: true,
    badge: "Novo",
  }
];

export default function Produtos() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolver depois isso daqui
  //  useEffect(() => {
  //   fetchProducts()
  //     .then(setProducts)
  //     .catch(() => alert("Erro ao carregar produtos"))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    // Simula carregamento de produtos mockados
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500); // 0.5s para simular loading
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
