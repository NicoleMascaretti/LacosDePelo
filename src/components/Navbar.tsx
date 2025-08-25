import { useState } from "react";
import Logo from "./ui/Logo";
import NavLink from "./ui/Navlink";
import DropdownCategoria from "./ui/DropdownCategoria";
import SearchInput from "./ui/SearchInput";
import ShoppingCartWidget from "./ui/ShoppingCartWidget";
import UserMenu from "./ui/UserMenu";
import TopBarInfo from "./ui/TopBarInfo";
import { Heart } from 'lucide-react';
import FavoriteList from "./ui/FavoriteList";


const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <>
      <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
        {/* Top bar */}
        <TopBarInfo />

        {/* Navbar principal */}
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
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
            <div className="flex items-center">
            {/* Favoritos */}
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsFavoritesOpen(true)}
            >
              <Heart className="h-6 w-6 text-gray-600" />
            </button>

            {/* Carrinho */}
            <ShoppingCartWidget />

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
    </>
  );
};

export default Navbar;
