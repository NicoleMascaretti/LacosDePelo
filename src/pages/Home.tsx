import Navbar from "../components/Navbar";
import { ArrowRight } from 'lucide-react';
import ButtonsHome from "../components/ui/ButtonsHome";
import ProductCard from "../components/ui/ProductCard";
import Footer from "../components/ui/Footer";
import HeroBannerpt2 from "../components/HeroBannerpt2";
import CardCategoria from "../components/ui/CardCategoria";
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

      {/* Hero*/}
      <div className="bg-gradient-to-br from-teal-50 to-orange-50">
        <section className="py-16 lg:py-24">
          <div className="container max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Carinho e estilo para seu
                    <span className="text-teal-600"> pet </span>
                    em cada produto
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed">
                    Na Laços de Pelo, oferecemos produtos de qualidade com o carinho
                    e atenção que seu melhor amigo merece. Beleza e bem-estar em cada detalhe.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/produtos">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-semibold transition-colors flex items-center justify-center group">
                      Ver Produtos
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </a>

                  <a href="/sobre">
                    <button className="border-2 border-orange-400 text-orange-500 hover:bg-orange-400 hover:text-white px-8 py-4 rounded-full font-semibold transition-colors">
                      Conheça Nossa História
                    </button>
                  </a>

                </div>

                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">5k+</div>
                    <div className="text-gray-600">Produtos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">24h</div>
                    <div className="text-gray-600">Entrega</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">100%</div>
                    <div className="text-gray-600">Garantia</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
                    alt="Cachorro e gato felizes"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10"></div>
              </div>
            </div>
          </div>
        </section>



        {/* Cards de categorias */}
        <section className="container mx-auto ">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Explore Nossas Categorias
          </h2>
          <p className="text-center text-gray-600 text-xl">
            Encontre tudo que seu pet precisa, dividido em categorias para facilitar sua busca
          </p>
        </section>
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-2 md:gap-8 lg:gap-10 mt-10">
            <CardCategoria img={"public/racao.jpg"} titulo={"Rações e Alimentação"} sub={"Rações premium e Snacks para seu pet"} />
            <CardCategoria img={"public/brinquedos.jpg"} titulo={"Brinquedos"} sub={"Brinquedos diversos para cachorros e gatos"} />
            <CardCategoria img={"public/banho.avif"} titulo={"Higiene e Beleza"} sub={"Produtos para banho e cuidados pessoais"} />
            <CardCategoria img={"public/acessorios.jpg"} titulo={"Acessórios"} sub={"Acessórios estilosos e funcionais"} />
            <CardCategoria img={"public/medicamentos.avif"} titulo={"Medicamentos"} sub={"Medicamentos e suplementos para pets"} />
            <CardCategoria img={"public/casinhas.jpg"} titulo={"Casinhas e Transporte"} sub={"Casinhas confortáveis e transporte"} />
          </div>
        </div>
      </div>
      {/* Produtos em Destaque */}
      <section className="container max-w-7xl mx-auto mt-24 mb-12 ">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Produtos em Destaque
        </h2>
        <p className="text-center text-gray-600 mb-12 text-xl">
          Os produtos mais amados pelos nossos clientes, com qualidade garantida
          <br />e preços especiais
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mockProducts.map((p) => (
            <div key={p.id} className="flex justify-center">
              <div className="w-full" >
                <ProductCard product={p} viewMode="grid" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold transition-colors">
            <a href="/produtos">Ver Todos os Produtos</a>
          </button>
        </div>
      </section>

      {/* HeroBanner2 */}
      <HeroBannerpt2 />
      {/* Footer (já pronto) */}
      <Footer />

    </div>
  );
};

export default Home;
