import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ProductType } from "../types/ProductType";

// type VariantAwareId = { productId: string; variantId?: string };

export interface CartItem extends ProductType {
  quantity: number;
  /** GID da variante da Shopify (ex.: gid://shopify/ProductVariant/123456789) */
}

interface AddToCartOptions {
  /** GID da variante da Shopify */
  variantId?: string;
  /** Permite sobrescrever o preço (ex.: preço da variante) */
  price?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductType, opts?: AddToCartOptions) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: ProductType, opts?: AddToCartOptions) => {
    // usa o variantId de opts OU o que veio no produto
    const variantIdFinal = opts?.variantId ?? (product as any).variantId;
    const priceFinal = typeof opts?.price === "number" ? opts!.price : product.price;

    console.log("🛒 Adicionando ao carrinho:", {
      name: product.name,
      productId: product.id,
      variantIdFromProduct: (product as any).variantId,
      variantIdFromOpts: opts?.variantId,
      variantIdFinal,
    });

    setItems((prev) => {
      // se tem variantId, diferenciamos por (productId + variantId)
      // se não tem, comportamento legado (só productId)
      const idx = prev.findIndex(
        (it) =>
          it.id === product.id &&
          (variantIdFinal ? it.variantId === variantIdFinal : true)
      );

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }

      return [
        ...prev,
        {
          ...product,
          price: priceFinal,
          variantId: variantIdFinal,   // ✅ salva o variantId de fato
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(it.id === productId && (variantId ? it.variantId === variantId : true))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        const matchByProduct = it.id === productId;
        const matchByVariant = variantId ? it.variantId === variantId : true;
        return matchByProduct && matchByVariant ? { ...it, quantity } : it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
