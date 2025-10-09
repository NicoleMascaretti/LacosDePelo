import ProductCardBase from "./ProductCardBase";
/* import { Heart, ShoppingCart, Star } from "lucide-react"; */
import { Heart, ShoppingCart } from "lucide-react";
import type { ProductType } from "../../types/ProductType";

export default function ProductCardMobile({ product }: { product: ProductType }) {
  const displayName = (product.name?.trim() || product.handle) as string;
  const canAddToCart = Boolean(product.variantId);
  const category = (product.category || "").trim();

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

            {/* Overlay Esgotado (igual ao desktop) */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Esgotado
                </span>
              </div>
            )}

            <button
              onClick={handleFavoriteToggle}
              className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full shadow"
            >
              <Heart
                className={`h-4 w-4 ${isProductFavorite ? "text-red-500 fill-current" : "text-gray-600"}`}
              />
            </button>
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-between flex-grow p-3 min-w-0">
            {/* Nome + Categoria */}
            <div className="min-w-0">
              <h3
                className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 break-words mb-1"
                title={displayName}
              >
                {displayName}
              </h3>

              {category && (
                <span
                  className="inline-block text-[11px] text-teal-700 bg-teal-50 rounded px-2 py-0.5 mb-1 truncate max-w-full"
                  title={category}
                >
                  {category}
                </span>
              )}
            </div>

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
                disabled={!product.inStock || !canAddToCart}
                title={!product.inStock ? "Produto esgotado" : !canAddToCart ? "Indisponível no momento" : undefined}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 
                           text-white w-full py-3 rounded-md text-sm sm:text-base 
                           font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {canAddToCart ? "Adicionar ao Carrinho" : (product.inStock ? "Indisponível" : "Produto Esgotado")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProductCardBase>
  );
}
