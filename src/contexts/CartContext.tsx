import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { ProductType } from "../types/ProductType";

interface CartContextType {
  carrinho: ProductType[];
  addToCart: (produto: ProductType) => void;
  removeFromCart: (id: number) => void;
  getCartTotal: () => number;
}

// Exportando o contexto para ser usado no hook
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<ProductType[]>([]);

  const addToCart = (produto: ProductType) => {
    setCarrinho((prev) => [...prev, produto]);
  };

  const removeFromCart = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return carrinho.reduce((total, item) => total + item.price, 0);
  };

  const value = useMemo(() => ({
    carrinho,
    addToCart,
    removeFromCart,
    getCartTotal
  }), [carrinho]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};