import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useFavorites } from '../contexts/FavoriteListContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

const allProducts = [
  {
    id: 1,
    name: 'Ração Premier Golden Cães Adultos 15kg',
    price: 89.90,
    originalPrice: 109.90,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    badge: 'Mais Vendido',
    category: 'Ração e Alimentação',
    inStock: true,
    description: 'Ração super premium para cães adultos, formulada com ingredientes naturais e vitaminas essenciais para manter seu pet saudável e ativo.',
    features: [
      'Rico em proteínas de alta qualidade',
      'Sem conservantes artificiais', 
      'Fortalece o sistema imunológico',
      'Melhora a digestão',
      'Pelo mais brilhante e saudável'
    ],
    specifications: {
      peso: '15kg',
      idade: 'Cães adultos (1-7 anos)',
      tamanho: 'Todos os tamanhos',
      sabor: 'Frango e arroz'
    }
  },
  {
    id: 2,
    name: 'Brinquedo Mordedor Resistente Kong',
    price: 24.90,
    originalPrice: 34.90,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    badge: 'Promoção',
    category: 'Brinquedos',
    inStock: true,
    description: 'Brinquedo ultra resistente para cães que adoram mastigar. Feito com borracha natural de alta qualidade.',
    features: [
      'Material ultra resistente',
      'Estimula a dentição saudável',
      'Reduz o estresse e ansiedade',
      'Fácil de limpar',
      'Atóxico e seguro'
    ],
    specifications: {
      material: 'Borracha natural',
      tamanho: 'Médio (10cm)',
      peso: '150g',
      cor: 'Vermelho'
    }
  },
  {
    id: 3,
    name: 'Coleira Personalizada Premium Couro',
    price: 45.90,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    badge: 'Novo',
    category: 'Acessórios',
    inStock: true,
    description: 'Coleira de couro genuíno com possibilidade de personalização. Conforto e elegância para seu pet.',
    features: [
      'Couro genuíno de alta qualidade',
      'Personalização com nome do pet',
      'Fivela resistente em metal',
      'Confortável e durável',
      'Diferentes tamanhos disponíveis'
    ],
    specifications: {
      material: 'Couro genuíno',
      largura: '2,5cm',
      ajustável: '30-45cm',
      cor: 'Marrom'
    }
  },
  {
    id: 4,
    name: 'Shampoo Hipoalergênico Pet Clean',
    price: 32.90,
    originalPrice: 42.90,
    rating: 4.7,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    badge: 'Desconto',
    category: 'Higiene e Beleza',
    inStock: true,
    description: 'Shampoo especialmente formulado para pets com pele sensível. Limpeza suave e eficaz.',
    features: [
      'Fórmula hipoalergênica',
      'Ph neutro para pets',
      'Não irrita os olhos',
      'Aroma suave e duradouro',
      'Testado dermatologicamente'
    ],
    specifications: {
      volume: '500ml',
      tipo: 'Hipoalergênico',
      indicação: 'Peles sensíveis',
      ph: 'Neutro'
    }
  }
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '1');
  
  const product = allProducts.find(p => p.id === productId);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-8">O produto que você está procurando não existe ou foi removido.</p>
          <Link to="/produtos">
            <Button>Voltar aos Produtos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/produtos" className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos produtos
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-0">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 lg:col-span-2">
              <div className="mb-4">
                <span className="text-sm text-teal-600 font-medium">{product.category}</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-3">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center mb-6">
                <span className="text-4xl font-bold text-emerald-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through ml-3">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white h-14 text-lg font-semibold"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-14 border-2"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-5 w-5 ${
                    isFavorite(product.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-600'
                  }`} />
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Frete Grátis</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Garantia</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Entrega Rápida</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Características</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Especificações</h3>
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 capitalize">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;