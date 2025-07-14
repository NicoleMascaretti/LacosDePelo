import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, Heart, User, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoritesDrawer from "./FavoritesDrawer";

const Header = () => {
  const { favorites } = useFavorites();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b">
            <div className="flex items-center space-x-4">
              <span>📞 (11) 99999-9999</span>
              <span>📧 contato@lacosdepelo.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Frete Grátis acima de R$ 100</span>
              <span>🚚 Entrega em 24h</span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <a href="/">
                  <img 
                    src="/lovable-uploads/622c5e12-a72b-4f54-b165-d35b8f7325b6.png" 
                    alt="Laços de Pelo" 
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              
              <nav className="hidden lg:flex items-center space-x-6">
                <a href="/" className="text-gray-700 hover:text-teal-600 transition-colors">Início</a>
                <a href="/produtos" className="text-gray-700 hover:text-teal-600 transition-colors">Produtos</a>
                
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-gray-700 hover:text-teal-600 transition-colors bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                        Categorias
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-[900px] p-0">
                        <div className="grid grid-cols-4 gap-0 bg-white">
                          {/* Alimentação */}
                          <div className="p-6 border-r border-gray-100">
                            <h3 className="text-teal-600 font-semibold mb-4 text-sm">🍽️ Alimentação</h3>
                            <div className="space-y-2">
                              <a href="/produtos?categoria=racao-seca" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração Seca Premium
                              </a>
                              <a href="/produtos?categoria=racao-natural" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração Natural e Orgânica
                              </a>
                              <a href="/produtos?categoria=racao-umida" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração Úmida e Sachês
                              </a>
                              <a href="/produtos?categoria=racao-medicamentosa" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração Terapêutica
                              </a>
                              <a href="/produtos?categoria=racao-filhotes" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração para Filhotes
                              </a>
                              <a href="/produtos?categoria=racao-senior" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Ração para Idosos
                              </a>
                              <a href="/produtos?categoria=suplementos" className="block text-sm text-gray-700 hover:text-teal-600 transition-colors">
                                Suplementos e Vitaminas
                              </a>
                            </div>
                            <a href="/produtos?categoria=alimentacao" className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mt-4 font-medium">
                              Ver todos os produtos →
                            </a>
                          </div>

                          {/* Petiscos e Snacks */}
                          <div className="p-6 border-r border-gray-100">
                            <h3 className="text-coral-500 font-semibold mb-4 text-sm">🦴 Petiscos & Snacks</h3>
                            <div className="space-y-2">
                              <a href="/produtos?categoria=petiscos-naturais" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Petiscos Naturais
                              </a>
                              <a href="/produtos?categoria=bifinhos" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Bifinhos e Strips
                              </a>
                              <a href="/produtos?categoria=biscoitos" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Biscoitos e Cookies
                              </a>
                              <a href="/produtos?categoria=ossos-recreativos" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Ossos Recreativos
                              </a>
                              <a href="/produtos?categoria=petisco-dental" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Petiscos Dentais
                              </a>
                              <a href="/produtos?categoria=petisco-gatos" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Petiscos para Gatos
                              </a>
                              <a href="/produtos?categoria=petisco-funcional" className="block text-sm text-gray-700 hover:text-coral-500 transition-colors">
                                Petiscos Funcionais
                              </a>
                            </div>
                            <a href="/produtos?categoria=petiscos" className="inline-flex items-center text-sm text-coral-500 hover:text-coral-600 mt-4 font-medium">
                              Ver todos os petiscos →
                            </a>
                          </div>

                          {/* Acessórios e Brinquedos */}
                          <div className="p-6 border-r border-gray-100">
                            <h3 className="text-purple-600 font-semibold mb-4 text-sm">🎾 Acessórios & Brinquedos</h3>
                            <div className="space-y-2">
                              <a href="/produtos?categoria=coleiras-guias" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Coleiras e Guias
                              </a>
                              <a href="/produtos?categoria=camas-almofadas" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Camas e Almofadas
                              </a>
                              <a href="/produtos?categoria=brinquedos-interativos" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Brinquedos Interativos
                              </a>
                              <a href="/produtos?categoria=brinquedos-pelucia" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Brinquedos de Pelúcia
                              </a>
                              <a href="/produtos?categoria=comedouros-bebedouros" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Comedouros e Bebedouros
                              </a>
                              <a href="/produtos?categoria=transportadoras" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Transportadoras
                              </a>
                              <a href="/produtos?categoria=roupas-acessorios" className="block text-sm text-gray-700 hover:text-purple-600 transition-colors">
                                Roupas e Acessórios
                              </a>
                            </div>
                            <a href="/produtos?categoria=acessorios" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mt-4 font-medium">
                              Ver todos os acessórios →
                            </a>
                          </div>

                          {/* Higiene e Saúde */}
                          <div className="p-6">
                            <h3 className="text-green-600 font-semibold mb-4 text-sm">🧼 Higiene & Saúde</h3>
                            <div className="space-y-2">
                              <a href="/produtos?categoria=shampoos-condicionadores" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Shampoos e Condicionadores
                              </a>
                              <a href="/produtos?categoria=produtos-dentais" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Produtos Dentais
                              </a>
                              <a href="/produtos?categoria=antipulgas-carrapatos" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Antipulgas e Carrapatos
                              </a>
                              <a href="/produtos?categoria=medicamentos" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Medicamentos
                              </a>
                              <a href="/produtos?categoria=produtos-limpeza" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Produtos de Limpeza
                              </a>
                              <a href="/produtos?categoria=primeiros-socorros" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Primeiros Socorros
                              </a>
                              <a href="/produtos?categoria=areia-sanitaria" className="block text-sm text-gray-700 hover:text-green-600 transition-colors">
                                Areia Sanitária
                              </a>
                            </div>
                            <a href="/produtos?categoria=higiene-saude" className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mt-4 font-medium">
                              Ver todos os produtos →
                            </a>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                
                <a href="/sobre" className="text-gray-700 hover:text-teal-600 transition-colors">Sobre</a>
                <a href="/contato" className="text-gray-700 hover:text-teal-600 transition-colors">Contato</a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="bg-transparent outline-none flex-1"
                />
              </div>
              
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsFavoritesOpen(true)}
              >
                <Heart className={`h-6 w-6 ${favorites.length > 0 ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="h-6 w-6 text-gray-600" />
              </button>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <FavoritesDrawer 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />
    </>
  );
};

export default Header;