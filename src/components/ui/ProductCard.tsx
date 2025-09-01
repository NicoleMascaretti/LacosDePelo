import { Link } from 'react-router-dom';
import type { ProductType } from "../../types/ProductType"
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from "../../hooks/useCart";
import { useFavorites } from '../../hooks/useFavorites'
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductType;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede a navegação
    e.preventDefault();  // Impede a navegação
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      toast.error(`${product.name} removido dos favoritos.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} adicionado aos favoritos!`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede a navegação
    e.preventDefault();  // Impede a navegação
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <Link to={`/produto/${product.id}`} className="">
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full ${viewMode === 'list' ? 'flex flex-row' : ''
          }`}
      >
        {/* Imagem */}
        <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === 'list' ? 'w-48 h-full' : 'w-full h-72'
              }`}
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full text-white ${product.badge === 'Mais Vendido' ? 'bg-emerald-600' :
              product.badge === 'Promoção' ? 'bg-red-600' :
                product.badge === 'Novo' ? 'bg-blue-600' :
                  product.badge === 'Premium' ? 'bg-purple-600' :
                    product.badge === 'Natural' ? 'bg-green-600' : 'bg-teal-600'
              }`}>
              {product.badge}
            </span>
          )}

          {/* Esgotado */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Esgotado
              </span>
            </div>
          )}

          {/* Favorito */}
          <button onClick={handleFavoriteToggle} className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart className={`h-5 w-5 hover:text-red-500 transition-colors ${isProductFavorite
              ? 'text-red-500 fill-current'
              : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Informações */}
        <div className={`p-6 flex flex-col flex-grow ${viewMode === 'list' ? 'flex-1 flex-row gap-6' : ''}`}>
          <div className={`flex-grow ${viewMode === 'list' ? 'flex flex-row gap-6' : ''}`}>

            {/* LADO DA ESQUERDA */}
            <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
              {/* Categoria */}
              <div className="mb-2">
                <span className="text-xs text-teal-600 font-medium">{product.category}</span>
              </div>

              {/* Nome */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                {product.name}
              </h3>

              {/* Avaliação */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>

            {/* LADO DA DIREITA */}
            <div className={`${viewMode === 'list' ? 'flex flex-col justify-between items-end' : ''}`}>
              {/* Preço */}
              <div className={`flex items-center mb-4 ${viewMode === 'list' ? 'flex-col items-end' : 'justify-between'}`}>
                <span className="text-2xl font-bold text-emerald-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Botão Adicionar */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group ${viewMode === 'list' ? 'px-6 whitespace-nowrap' : 'w-full mt-auto'
                  }`}
              >
                <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
