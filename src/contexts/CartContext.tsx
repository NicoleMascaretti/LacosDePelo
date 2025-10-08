import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ProductType } from "../types/ProductType";

// type VariantAwareId = { productId: string; variantId?: string };

export interface CartItem extends ProductType {
  quantity: number;
  /** GID da variante da Shopify (ex.: gid://shopify/ProductVariant/123456789) */
  variantId?: string;
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
    const { variantId, price } = opts || {};

    setItems((prev) => {
      // se veio variantId, diferenciamos por (productId + variantId).
      // se não, mantemos o mesmo comportamento antigo (apenas por productId).
      const idx = prev.findIndex(
        (it) =>
          it.id === product.id &&
          // se veio variantId, precisa bater; se não veio, aceita qualquer (compatibilidade)
          (variantId ? it.variantId === variantId : true)
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
          // se quiser usar o preço da variante, passe em opts.price
          price: typeof price === "number" ? price : product.price,
          variantId,
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
