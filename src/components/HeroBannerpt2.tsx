import { Shield, Truck, Heart, Award } from 'lucide-react';

const HeroBannerpt2 = () => {
  const features = [
    {
      icon: Shield,
      title: 'Produtos Garantidos',
      description: 'Todos os produtos com garantia de qualidade e procedência'
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Trabalhamos para que você receba seu pedido o mais rápido possível'
    },
    {
      icon: Heart,
      title: 'Amor pelos Pets',
      description: 'Selecionamos cada produto pensando no bem-estar dos animais'
    },
    {
      icon: Award,
      title: 'Melhor Preço',
      description: 'Preços competitivos e promoções exclusivas'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Por que escolher a
                <span className="text-teal-600"> Laços de Pelo</span>?
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Somos uma empresa especializada em produtos para pets, combinando carinho e qualidade
                em cada produto. Nossa seleção cuidadosa une produtos próprios de alta qualidade
                com parcerias confiáveis através de dropshipping.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Nossa missão é criar laços especiais entre você e seu pet através de produtos
                que unem funcionalidade, beleza e bem-estar, sempre com a conveniência da
                compra online e preços justos.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">
                📞 Atendimento Especializado
              </h3>
              <p className="text-gray-600 mb-3">
                Nossa equipe está sempre pronta para ajudar você a escolher o melhor para seu pet.
              </p>
              <a href="/contato">
                <button className="bg-white text-teal-600 px-6 py-2 rounded-full font-semibold hover:bg-teal-50 transition-colors">
                  Falar Conosco
                </button>
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80"
              alt="Cachorro feliz"
              className="rounded-2xl shadow-2xl w-full"
            />
            {/*             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-teal-600 fill-current" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">10.000+</div>
                  <div className="text-gray-600">Pets Felizes</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerpt2;