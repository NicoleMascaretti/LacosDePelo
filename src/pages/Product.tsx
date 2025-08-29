import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

// Nossos hooks e funções de API
import { useLoading } from '../hooks/useLoading';
import { fetchProductById } from '../services/mockApi';
import type { ProductType } from '../types/ProductType'; // Importe o tipo
import Loading from '../components/ui/Loading'; // Importe a tela de carregamento
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { useCallback } from 'react';


const Product = () => {
  const { id } = useParams<{ id: string }>();

  const getProduct = useCallback(() => {
    if (!id) throw new Error("ID do produto não encontrado");
    return fetchProductById(parseInt(id));
  }, [id]);

  const { data: product, loading, error } = useLoading<ProductType>(getProduct);

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (loading) {
    return <Loading message="Carregando produto..." />;
  }
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error ? 'Ocorreu um Erro' : 'Produto não encontrado'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error ? error.message : 'O produto que você está procurando não existe ou foi removido.'}
          </p>
          <Link to="/">
            <Button>Voltar à Loja</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /*   if (!product) {
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
    } */

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
                className="w-full h-96 lg:h-[30rem] object-cover"
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
                      className={`h-5 w-5 ${i < Math.floor(product.rating)
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
                  <Heart className={`h-5 w-5 ${isFavorite(product.id)
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
              {(product.features && product.features.length > 0) && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Características</h3>
                  <ul className="space-y-3">
                    {product.features && product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Specifications */}
              {(product.specifications && Object.keys(product.specifications).length > 0) && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Especificações</h3>
                  <div className="space-y-4">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 capitalize">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;