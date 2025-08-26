import type { ProductType } from "../../types/ProductType"
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from "../../hooks/useCart";

interface ProductCardProps {
  product: ProductType;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Imagem */}
      <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === 'list' ? 'w-48 h-full' : 'w-full h-48'
          }`}
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full text-white ${
            product.badge === 'Mais Vendido' ? 'bg-emerald-600' :
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
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Informações */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Categoria */}
        <div className="mb-2">
          <span className="text-xs text-teal-600 font-medium">{product.category}</span>
        </div>

        {/* Nome */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Avaliação */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
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

        {/* Preço */}
        <div className="flex items-center justify-between mb-4">
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
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group"
        >
          <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
        </button>
      </div>
    </div>
  );
}
