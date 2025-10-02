import { Link } from 'react-router-dom';
import type { ProductType } from "../../types/ProductType";
/* import { Star, Heart, ShoppingCart } from 'lucide-react'; */
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from "../../hooks/useCart";
import { useFavorites } from '../../hooks/useFavorites';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductType;
  viewMode: 'grid' | 'list'; // só afeta desktop
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      toast.error(`${product.name} removido dos favoritos.`);
    } else {
      addToFavorites(product);
      toast.success(`${product.name} adicionado aos favoritos!`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <Link to={`/produto/${product.id}`} className="block">
      <div
        className={`
          bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full
          flex flex-row
          md:${viewMode === 'list' ? 'flex-row' : 'flex-col'}
        `}
      >
        {/* Imagem */}
        <div
          className={`
            relative w-32 flex-shrink-0
            md:${viewMode === 'list' ? 'w-48' : 'w-full'}
          `}
        >
          <img
            src={product.image}
            alt={product.name}
            className={`
              object-cover transition-transform duration-300 group-hover:scale-105
              h-32 w-32
              md:${viewMode === 'list' ? 'w-48 h-full' : 'w-full h-72'}
            `}
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white
              ${product.badge === 'Mais Vendido'
                  ? 'bg-emerald-600'
                  : product.badge === 'Promoção'
                    ? 'bg-red-600'
                    : product.badge === 'Novo'
                      ? 'bg-blue-600'
                      : product.badge === 'Premium'
                        ? 'bg-purple-600'
                        : product.badge === 'Natural'
                          ? 'bg-green-600'
                          : 'bg-teal-600'
                }`}
            >
              {product.badge}
            </span>
          )}

          {/* Esgotado */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                Esgotado
              </span>
            </div>
          )}

          {/* Favorito */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`h-4 w-4 ${isProductFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
            />
          </button>
        </div>

        {/* Informações */}
        <div
          className={`
            p-3 flex flex-col flex-grow
            md:p-6
            md:${viewMode === 'list' ? 'flex-1 flex-row gap-6' : ''}
          `}
        >
          <div className={`flex-grow md:${viewMode === 'list' ? 'flex flex-row gap-6' : ''}`}>
            {/* LADO ESQUERDO */}
            <div className="flex-1">
              <span className="text-[11px] text-teal-600 font-medium">{product.category}</span>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                {product.name}
              </h3>
            </div>

            {/* LADO DIREITO */}
            <div
              className={`mt-2 md:mt-0 ${viewMode === 'list'
                  ? 'md:flex md:flex-col md:justify-between md:items-end'
                  : ''
                }`}
            >
              <div className="flex items-center mb-2 md:mb-4">
                <span className="text-base md:text-2xl font-bold text-emerald-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs md:text-sm text-gray-500 line-through ml-2">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`
                  bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-md font-semibold transition-colors
                  flex items-center justify-center text-xs md:text-base
                  px-3 py-2 md:py-3
                  w-full md:${viewMode === 'list' ? 'px-6 w-auto whitespace-nowrap' : 'w-full mt-auto'}
                `}
              >
                <ShoppingCart className="h-4 w-4 mr-1 md:h-5 md:w-5 md:mr-2" />
                {product.inStock ? 'Adicionar' : 'Esgotado'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
