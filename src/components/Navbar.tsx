import React, { useState } from "react";
import Logo from "./ui/Logo";
import NavLink from "./ui/Navlink";
import DropdownCategoria from "./ui/DropdownCategoria";
import SearchInput from "./ui/SearchInput";
import ShoppingCartWidget from "./ui/ShoppingCartWidget";
import UserMenu from "./ui/UserMenu";
import TopBarInfo from "./ui/TopBarInfo";
import FavoriteList from "./ui/FavoriteList";

const Navbar = () => {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-white">
      {/* Top bar com info de contato */}
      <TopBarInfo />

      {/* Navbar principal */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-auto" />
        </div>

        {/* Links de navegação */}
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

        {/* Área da direita (busca, favoritos, carrinho, user) */}
        <div className="flex items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Favoritos futuramente */}
          {/* <FavoriteList />  */}
          <UserMenu />
          <ShoppingCartWidget />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
