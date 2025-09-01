"use client";

import type { ReactNode } from 'react';
import React, { 
  createContext, 
  useState, 
  useEffect,
  useCallback
} from 'react';
import type { ProductType } from '../types/ProductType'; 

// 1. A interface continua a mesma
export interface FavoritesContextData {
  favorites: ProductType[];
  addToFavorites: (product: ProductType) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearAllFavorites: () => void;
}

// 2. Exportamos o Contexto para que o hook possa acessá-lo de outro arquivo
export const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);

// 3. O Provider continua o mesmo
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<ProductType[]>([]);

  // ... (toda a lógica do provider continua exatamente a mesma)
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('app-favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Falha ao carregar favorites do localStorage", error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((product: ProductType) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(item => item.id === product.id)) {
        return [...prevFavorites, product];
      }
      return prevFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== productId));
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);
  
  const isFavorite = useCallback((productId: string) => {
    return favorites.some(item => item.id === productId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, clearAllFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// 4. O hook 'useFavorites' foi REMOVIDO deste arquivo.