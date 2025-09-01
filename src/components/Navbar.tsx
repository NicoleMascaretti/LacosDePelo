import { useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";
import Logo from "./ui/Logo";
import NavLink from "./ui/Navlink";
import DropdownProdutos from "./ui/DropdownProdutos";
import SearchInput from "./ui/SearchInput";
import UserMenu from "./ui/UserMenu";
import TopBarInfo from "./ui/TopBarInfo";
import { Heart, ShoppingCart } from "lucide-react";
import FavoriteList from "./ui/FavoriteList";
import ShoppingCartWidget from "./ui/ShoppingCartWidget";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <Link to="/" aria-label="Ir para Início">
              <Logo className="h-12 w-auto" />
            </Link>

            {/* Links desktop */}
            <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
              <NavLink to="/" activeClassName="text-teal-600">
                Início
              </NavLink>
              <DropdownProdutos />
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
            {/* Busca desktop */}
            <SearchInput className="hidden md:flex w-full max-w-md" />

            {/* Ícones da navbar */}
            <div className="flex items-center space-x-6">
              {/* Favoritos */}
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsFavoritesOpen(true)}
                aria-label="Abrir favoritos"
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
                aria-label="Abrir carrinho"
              >
                <ShoppingCart
                  className={`h-6 w-6 ${getTotalItems() > 0 ? "text-teal-600" : "text-gray-600"
                    }`}
                />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Usuário */}
              <UserMenu />

              {/* Botão menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="Abrir menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu lateral mobile com animação */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="mobileMenu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-lg z-50 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] px-5 flex flex-col overflow-y-auto"
            >
              {/* Header do drawer (logo + fechar) */}
              <div className="flex items-center justify-between mb-4">
                <Logo className="h-9 w-auto" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Fechar menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Busca no mobile */}
              <div className="mb-4">
                <SearchInput className="flex md:hidden w-full" />
              </div>

              {/* Navegação */}
              <nav className="flex flex-col gap-4 text-gray-700 font-medium">
                <NavLink
                  to="/"
                  activeClassName="text-teal-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </NavLink>
                <DropdownProdutos />
                <NavLink
                  to="/sobre"
                  activeClassName="text-teal-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre
                </NavLink>
                <NavLink
                  to="/contato"
                  activeClassName="text-teal-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contato
                </NavLink>
              </nav>

              {/* Ações */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setIsFavoritesOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Abrir favoritos"
                  >
                    <Heart className="h-6 w-6 text-gray-700" />
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Abrir carrinho"
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                  </button>

                  <UserMenu />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Barra lateral de favoritos */}
      <FavoriteList
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      {/* Barra lateral do carrinho */}
      <ShoppingCartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
