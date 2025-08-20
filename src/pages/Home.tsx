import React from "react";
import Navbar from "../components/Navbar";
import ButtonsHome from "../components/ui/ButtonsHome";
import ProductCard from "../components/ui/ProductCard"; 
import type { ProductType } from "../types/ProductType";

// 👇 produtos mockados (pode mover para um arquivo separado se preferir)
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
    rating: 4,
    reviews: 12,
    image: "https://placekitten.com/300/300",
    inStock: true,
    badge: "Promoção",
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
    badge: "Novo",
  },
  {
    id: 4,
    name: "Shampoo Hipoalergênico",
    price: 32.9,
    category: "Higiene",
    rating: 4.8,
    reviews: 15,
    image: "https://placebeard.it/300x300",
    inStock: true,
    badge: "Secreto",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-orange-50">
      {/* Navbar fixo */}
      <Navbar />

      {/* Hero (já pronto) */}
      <main className="container mx-auto py-8">
        <div className="mt-5 flex gap-5">
          <div className="mt-20">
            <h1 className="text-4xl lg:text-6xl leading-tight text-gray-900 font-bold">
              Carinho e estilo para <br /> o seu{" "}
              <span className="text-teal-600">pet</span> em cada <br /> produto
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mt-5">
              Na Laços de Pelo, oferecemos produtos de qualidade com o <br />{" "}
              carinho e atenção que seu melhor amigo merece. Beleza e bem-estar
              em cada detalhe.
            </p>

            <div className="mt-10">
              <ButtonsHome />
            </div>

            <div className="flex justify-around text-center pt-8 mt-5">
              <div className="w-1/3">
                <p className="text-3xl font-bold text-teal-600">5k+</p>
                <p className="text-md text-gray-500">Produtos</p>
              </div>
              <div className="w-1/3">
                <p className="text-3xl font-bold text-orange-500">24h</p>
                <p className="text-md text-gray-500">Entrega</p>
              </div>
              <div className="w-1/3">
                <p className="text-3xl font-bold text-teal-600">100%</p>
                <p className="text-md text-gray-500">Garantia</p>
              </div>
            </div>
          </div>
          <div>
            <img
              className="rounded-xl shadow-2xl w-full h-full"
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
              alt="Imagem de exemplo"
            />
          </div>
        </div>
      </main>

      {/* Produtos em Destaque */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Produtos em Destaque
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Os produtos mais amados pelos nossos clientes, com qualidade garantida
          e preços especiais
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mockProducts.map((p) => (
            <ProductCard key={p.id} product={p} viewMode="grid" />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-700 transition">
            Ver Todos os Produtos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
