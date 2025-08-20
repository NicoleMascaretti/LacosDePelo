"use client";

import { useContext } from 'react';
import type { FavoritesContextData } from '../contexts/FavoriteListContext';
// Importamos o contexto e a interface do arquivo de contexto
import { FavoritesContext } from '../contexts/FavoriteListContext'; // Ajuste o caminho se necessário

// Criamos e exportamos o hook a partir daqui
export const useFavorites = (): FavoritesContextData => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }

  return context;
};