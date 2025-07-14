import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface Product {
  id: number;
  nome: string;
  preco: number;
}

interface CartContextType {
  carrinho: Product[];
  addCarrinho: (produto: Product) => void;
  removeCarrinho: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<Product[]>([]);

  const addCarrinho = (produto: Product) => {
    setCarrinho((prev) => [...prev, produto]);
  };

  const removeCarrinho = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ carrinho, addCarrinho, removeCarrinho }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro do CartProvider");
  }
  return context;
};