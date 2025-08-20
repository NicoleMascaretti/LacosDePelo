import React from 'react';
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./Sheet";
import { Button } from "./Button";
import { useFavorites } from "../../hooks/useFavorites";
import type { ProductType } from '../../types/ProductType';

interface FavoriteListProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteList: React.FC<FavoriteListProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites, clearAllFavorites } = useFavorites();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            Meus Favoritos
          </SheetTitle>
          <SheetDescription>
            {favorites.length === 0 
              ? "Você ainda não tem produtos favoritos" 
              : `${favorites.length} produto${favorites.length > 1 ? 's' : ''} favorito${favorites.length > 1 ? 's' : ''}`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhum produto favorito ainda</p>
              <p className="text-sm text-gray-400">
                Clique no coração dos produtos para adicioná-los aos seus favoritos
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {favorites.map((product: ProductType) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFromFavorites(product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar Todos ao Carrinho
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={clearAllFavorites}
            >
              Limpar Favoritos
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoriteList;