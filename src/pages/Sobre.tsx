import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';
import HeroBannerpt2 from '../components/HeroBannerpt2';
import { Shield, Heart, Truck, Award, Users, Star, PawPrint } from 'lucide-react';
import { useState, useEffect } from "react";

const Sobre = () => {
const [loading, setLoading] = useState(true);

  // esse pedaço é só pra simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: Users, label: 'Priorizamos sua Satisfação' },
    { icon: Star, label: 'Produtos de Qualidade' },
    { icon: Truck, label: 'Entrega Rápida' },
    { icon: Heart, label: 'Comunicação Clara e Empática ' }
  ];

  const values = [
    {
      icon: Heart,
      description: 'Cada produto é escolhido pensando no bem-estar e felicidade dos pets.'
    },
    {
      icon: Shield,
      description: 'Trabalhamos apenas com marcas confiáveis e produtos testados.'
    },
    {
      icon: Award,
      description: 'Nossa equipe está sempre pronta para ajudar você e seu pet.'
    },
    {
      icon: Truck,
      description: 'Logística eficiente para que seu pet não fique sem seus produtos favoritos.'
    }
  ];

    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-teal-500">
            <PawPrint size={80} />
          </div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-green-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Sobre a <span className="text-gradient-to-r from-teal-600 to-orange-400">Laços de Pelo</span>
          </h1>
          <p className="text-xl lg:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Criamos laços especiais entre você e seu melhor amigo através de produtos de qualidade, com todo o 
            carinho e dedicação que seu pet merece.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-teal-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2"></div>
                <h3 className="text-black-600">{stat.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main About Component */}
      <HeroBannerpt2 />

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Os princípios que nos guiam na missão de criar laços especiais entre pets e seus donos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Acreditamos que cada pet merece o melhor cuidado e carinho. Por isso, nossa missão é 
                oferecer produtos de alta qualidade que fortaleçam os laços entre você e seu animal de estimação.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Combinamos a paixão pelos animais com a expertise em e-commerce para criar uma experiência 
                única de compra, onde cada produto é cuidadosamente selecionado pensando no bem-estar dos pets.
              </p>
              <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <Heart className="h-5 w-5 text-teal-600 mr-2" />
                  Compromisso com a Qualidade
                </h3>
                <p className="text-gray-600">
                  Cada produto passa por rigorosa seleção para garantir que apenas o melhor chegue até você e seu pet.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80"
                alt="Gato descansando"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Tem alguma dúvida?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está sempre pronta para ajudar você a encontrar o melhor para seu pet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href='https://wa.me/5511995984383?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.' className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-colors">
              Falar no WhatsApp
            </a>
            <a href='/contato' className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-colors">
              Enviar E-mail
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;