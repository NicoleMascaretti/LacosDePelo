import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

// Nossos hooks e funções de API
//import { useLoading } from '../hooks/useLoading';
//import { fetchProductById } from '../services/mockApi';
import type { ProductType } from '../types/ProductType'; // Importe o tipo
import Loading from '../components/ui/Loading'; // Importe a tela de carregamento
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { gql, useQuery } from '@apollo/client';
//import { useCallback } from 'react';

const GET_PRODUCT_BY_HANDLE_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      productType 
      priceRange {
        minVariantPrice {
          amount
        }
      }
      images(first: 1) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

// Tipos para a resposta da API
interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  priceRange: { minVariantPrice: { amount: string; } };
  images: { edges: { node: { url: string; altText: string | null; } }[]; };
}

interface GetProductData {
  product: ShopifyProduct;
}

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { loading, error, data } = useQuery<GetProductData>(
    /*   const { id } = useParams<{ id: string }>();
    
      /*   const getProduct = useCallback(() => {
          if (!id) throw new Error("ID do produto não encontrado");
          return fetchProductById((id));
        }, [id]);
      
        const { data: product, loading, error } = useLoading<ProductType>(getProduct); */

    GET_PRODUCT_BY_HANDLE_QUERY,
    {
      // A API da Shopify espera o ID completo no formato "gid://shopify/Product/NUMERO"
      // O seu useParams te dá só o número, então precisamos montar o ID completo.
      // Se o seu ID já vier completo da navegação, você pode passar apenas { variables: { id } }
      variables: { handle: handle },
      skip: !handle,
    }
  );

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (loading) {
    return <Loading message="Carregando produto..." />;
  }
  if (error || !data || !data.product) {
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

  // bloco para traduzir os dados da Shopify para o formato que o JSX espera
  const product: ProductType = {
    id: data.product.id,
    handle: data.product.handle,
    name: data.product.title,
    description: data.product.description,
    price: parseFloat(data.product.priceRange.minVariantPrice.amount),
    image: data.product.images.edges[0]?.node.url || '',
    category: data.product.productType || 'Shopify', // Tenta usar o tipo do produto, se não, usa 'Shopify'
    rating: 4.8, // Valor padrão, pois não vem da API por padrão
    reviews: 70, // Valor padrão
    inStock: true, // Valor padrão
    // Para 'features' e 'specifications', precisaríamos usar Metafields da Shopify (um passo mais avançado)
    features: [],
    specifications: {}
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0">
            {/* Imagem do produto */}
            <div className="relative bg-white flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[30rem] object-contain"
              />
            </div>

            {/* Informações */}
            <div className="p-6 lg:p-12 lg:col-span-2">
              <div className="mb-3">
                <span className="text-sm text-teal-600 font-medium">{product.category}</span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
                {product.name}
              </h1>

              {/* Avaliações */}
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 lg:h-5 lg:w-5 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm lg:text-base text-gray-600 ml-2 lg:ml-3">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* Preço */}
              <div className="flex items-center mb-4 lg:mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-emerald-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base lg:text-xl text-gray-500 line-through ml-3">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Descrição */}
              <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                {product.description}
              </p>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 lg:h-14 text-base lg:text-lg font-semibold"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </Button>


                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 lg:h-14 border-2 w-full sm:w-auto"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-600'
                    }`} />
                </Button>
              </div>

              {/* Benefícios */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Frete Grátis</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Garantia</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Entrega Rápida</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 p-6 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {((product.features?.length || 0) > 0) && (
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                    Características
                  </h3>
                  <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                    {product.features?.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mr-2 lg:mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                    Especificações
                  </h3>
                  <div className="space-y-3 lg:space-y-4 text-sm lg:text-base">
                    {Object.entries(product.specifications).map(([key, value]) => (
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