import React from "react";
import Navbar from "../components/Navbar";
import ButtonsHome from "../components/ui/ButtonsHome";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-orange-50">
      {/* Navbar fixo */}
      <Navbar />

      {/* Conteúdo da Home depois */}
      <main className="container mx-auto py-8 ">
        <div className="mt-5 flex gap-5"> 
          <div className="mt-20">
            <h1 className="text-4xl lg:text-6xl leading-tight text-gray-900 font-bold">Carinho e estilo para <br /> o seu <span className="text-teal-600">pet</span> em cada <br /> produto</h1>

            <p className="text-xl text-gray-600 leading-relaxed mt-5">Na Laços de Pelo, oferecemos produtos de qualidade com o <br /> carinho e atenção que seu melhor amigo merece. Beleza e bem-estar em cada detalhe.</p>

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
          <div className="">
            <img className="rounded-xl shadow-2xl w-full h-full" src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80" alt="Imagem de exemplo" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
