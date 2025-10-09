import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';
import type { ProductType } from '../types/ProductType';
import Loading from '../components/ui/Loading';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { gql, useQuery } from '@apollo/client';

/** Helper: extrai um texto de categoria de um metafield (trata list/json e string simples) */
function extractCategory(meta?: { value?: string; type?: string } | null) {
  if (!meta) return "";

  const raw = (meta.value || "").trim();
  if (!raw) return "";

  if (meta.type?.startsWith("list") || (raw.startsWith("[") && raw.endsWith("]"))) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return String(arr[0]).trim();
    } catch {}
  }

  return raw.replace(/^"(.*)"$/, "$1").trim();
}

const GET_PRODUCT_BY_HANDLE_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      productType
      images(first: 1) {
        edges { node { url altText } }
      }
      # preço/variant para checkout
      variants(first: 1) {
        nodes {
          id
          price { amount }
        }
      }
      # categoria vinda de metafield
      metafield(namespace: "custom", key: "category") {
        value
        type
      }
      # fallback de preço
      priceRange { minVariantPrice { amount } }
    }
  }
`;

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants?: { nodes?: { id: string; price?: { amount: string } }[] };
  metafield?: { value?: string; type?: string } | null;
  priceRange: { minVariantPrice: { amount: string } };
}
interface GetProductData { product: ShopifyProduct; }

const Product = () => {
  const { handle } = useParams<{ handle: string }>();

  const { loading, error, data } = useQuery<GetProductData>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    { variables: { handle: handle as string }, skip: !handle }
  );

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (loading) return <Loading message="Carregando produto..." />;

  if (error || !data?.product) {
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
          <Link to="/"><Button>Voltar à Loja</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  // pega primeira variante (quando existir)
  const firstVariant = data.product.variants?.nodes?.[0];
  const variantId = firstVariant?.id; // gid://shopify/ProductVariant/...
  const variantPrice = firstVariant?.price?.amount
    ? parseFloat(firstVariant.price.amount)
    : undefined;

  const categoryText =
    extractCategory(data.product.metafield) ||
    data.product.productType ||
    'Sem categoria';

  const product: ProductType = {
    id: data.product.id,
    handle: data.product.handle,
    name: data.product.title,
    description: data.product.description,
    image: data.product.images.edges[0]?.node.url || '',
    price: variantPrice ?? parseFloat(data.product.priceRange.minVariantPrice.amount),
    category: categoryText,
    variantId, // <- importante para o carrinho/checkout
    rating: 4.8,
    reviews: 70,
    inStock: true,
    features: [],
    specifications: {},
  };

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) removeFromFavorites(product.id);
    else addToFavorites(product);
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
            {/* Imagem */}
            <div className="relative bg-white flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-96 lg:h-[30rem] object-contain" />
            </div>

            {/* Informações */}
            <div className="p-6 lg:p-12 lg:col-span-2">
              <div className="mb-3">
                <span className="text-sm text-teal-600 font-medium">{product.category}</span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
                {product.name}
              </h1>

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
                  onClick={() =>
                    addToCart(product, {
                      variantId: product.variantId,         // <- passa o GID da variante
                      price: product.price,                  // (opcional) força o preço da variante
                    })
                  }
                  disabled={!product.inStock || !product.variantId}
                  title={!product.variantId ? 'Indisponível no momento' : undefined}
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
                  <Heart
                    className={`h-5 w-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  />
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
              {(product.features?.length || 0) > 0 && (
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Características</h3>
                  <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                    {product.features?.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mr-2 lg:mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Especificações</h3>
                  <div className="space-y-3 lg:space-y-4 text-sm lg:text-base">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 capitalize">{key}:</span>
                        <span className="text-gray-600">{value as any}</span>
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
