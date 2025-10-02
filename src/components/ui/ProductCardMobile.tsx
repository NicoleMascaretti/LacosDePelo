import ProductCardBase from "./ProductCardBase";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { ProductType } from "../../types/ProductType";

export default function ProductCardMobile({ product }: { product: ProductType }) {
  return (
    <ProductCardBase product={product}>
      {({ isProductFavorite, handleFavoriteToggle, handleAddToCart }) => (
        <div className="bg-white rounded-lg shadow flex flex-row overflow-hidden min-h-[170px]">
          {/* Imagem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 m-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full shadow"
            >
              <Heart
                className={`h-4 w-4 ${isProductFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
              />
            </button>
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-between flex-grow p-3">
            {/* Nome + Avaliação */}
{/*             <div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                  />
                ))}
                <span>({product.reviews})</span>
              </div>
            </div> */}

            {/* Preço + Botão */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-emerald-600 text-base">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 
                           text-white w-full py-3 rounded-md text-sm sm:text-base 
                           font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.inStock ? "Adicionar" : "Esgotado"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProductCardBase>
  );
}
