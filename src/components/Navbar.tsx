import { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from '../hooks/useCart';
import Logo from "./ui/Logo";
import NavLink from "./ui/Navlink";
import DropdownCategoria from "./ui/DropdownCategoria";
import SearchInput from "./ui/SearchInput";
import UserMenu from "./ui/UserMenu";
import TopBarInfo from "./ui/TopBarInfo";
import { Heart, ShoppingCart } from 'lucide-react';
import FavoriteList from "./ui/FavoriteList";
import ShoppingCartWidget from "./ui/ShoppingCartWidget";


const Navbar = () => {
  const [search, setSearch] = useState("");
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { favorites } = useFavorites();
  return (
    <>
      <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
        {/* Top bar */}
        <TopBarInfo />

        {/* Navbar principal */}
        <div className="container px-4 mx-auto flex items-center justify-between py-6">
          {/* Logo + Links */}
          <div className="flex items-center gap-8">
            <Logo className="h-12 w-auto" />

            <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
              <NavLink to="/" activeClassName="text-teal-600">
                Início
              </NavLink>
              <NavLink to="/produtos" activeClassName="text-teal-600">
                Produtos
              </NavLink>
              <DropdownCategoria />
              <NavLink to="/sobre" activeClassName="text-teal-600">
                Sobre
              </NavLink>
              <NavLink to="/contato" activeClassName="text-teal-600">
                Contato
              </NavLink>
            </nav>
          </div>

          {/* Área da direita */}
          <div className="flex items-center space-x-4">
            {/* Busca */}
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Ícones da navbar */}
            <div className="flex items-center space-x-6">
              {/* Favoritos */}
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsFavoritesOpen(true)}
              >
                <Heart className="h-6 w-6 text-gray-600" />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Carrinho */}
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className={`h-6 w-6 ${getTotalItems() > 0 ? 'text-teal-600' : 'text-gray-600'}`} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Usuário */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Barra lateral de favoritos */}
      <FavoriteList
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      <ShoppingCartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
