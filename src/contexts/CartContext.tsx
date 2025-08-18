import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

export interface Product {
  id: number;
  nome: string;
  preco: number;
}

interface CartContextType {
  carrinho: Product[];
  addToCart: (produto: Product) => void;
  removeFromCart: (id: number) => void;
  getCartTotal: () => number;
}

// Exportando o contexto para ser usado no hook
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<Product[]>([]);

  const addToCart = (produto: Product) => {
    setCarrinho((prev) => [...prev, produto]);
  };

  const removeFromCart = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco, 0);
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