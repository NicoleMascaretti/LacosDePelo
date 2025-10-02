import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, User, LogOut, Package } from "lucide-react";

import { useFavorites } from "../hooks/useFavorites";
import { useCart } from "../hooks/useCart";

import Logo from "./ui/Logo";
import NavLink from "./ui/Navlink";
import DropdownProdutos from "./ui/DropdownProdutos";
import SearchInput from "./ui/SearchInput";
import TopBarInfo from "./ui/TopBarInfo";
import FavoriteList from "./ui/FavoriteList";
import ShoppingCartWidget from "./ui/ShoppingCartWidget";

const ACCOUNT_URL = "/account"; // Contas novas da Shopify

const Navbar = () => {
  const location = useLocation();

  const { favorites } = useFavorites();
  const { getTotalItems } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // auth (via backend /api/auth/status)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // dropdown user (desktop) + fechar ao clicar fora
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // const returnTo = window.location.pathname + window.location.search;

  // const API_BASE =
  //   import.meta.env.MODE === "development"
  //     ? "http://localhost:5173"
  //     : "https://lacosdepelo.vercel.app"; // coloque o domínio real do backend

  const startLogin = () => {
    window.location.href = `/api/auth/start?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  };

  const doLogout = () => {
    window.location.href = `/api/auth/logout?returnTo=/`;
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // fecha dropdown ao mudar rota
  useEffect(() => {
    setIsUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  // checa status auth
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/auth/status", { credentials: "include" });
        const j = await r.json();
        if (mounted) setIsAuthenticated(Boolean(j?.isAuthenticated));
      } catch {
        if (mounted) setIsAuthenticated(false);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location.pathname, location.search]);

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

              {/* Usuário (desktop) com dropdown */}
              {!authLoading && (
                <div className="relative hidden md:block" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen((v) => !v)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Abrir menu do usuário"
                    aria-expanded={isUserDropdownOpen}
                  >
                    <User className="h-6 w-6 text-gray-700" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-[70] p-2">
                      {!isAuthenticated ? (
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            startLogin();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          Entrar
                        </button>
                      ) : (
                        <>
                          <Link
                            to="/meus-pedidos"
                            className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Meus Pedidos
                          </Link>
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              doLogout();
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600"
                          >
                            Sair
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

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

      {/* Drawer mobile (fullscreen) com animação de slide */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            key="mobileMenu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col px-6 py-6 overflow-y-auto"
          >
            {/* Header do drawer */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Ir para Início"
              >
                <Logo className="h-10 w-auto" />
              </Link>
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
            <div className="mb-6">
              <SearchInput className="w-full" />
            </div>

            {/* Links principais */}
            <nav className="flex flex-col gap-6 text-lg font-medium text-gray-700">
              <NavLink
                to="/"
                activeClassName="text-teal-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </NavLink>
              <NavLink
                to="/produtos"
                activeClassName="text-teal-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produtos
              </NavLink>
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

            {/* MINHA CONTA (mobile) - antes das ações rápidas */}
            {!authLoading && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                  Minha conta
                </h4>

                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      startLogin();
                    }}
                    className="w-full bg-teal-600 ..."
                  >
                    Entrar / Criar conta
                  </button>
                ) : (
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/meus-pedidos"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-gray-800"
                      >
                        <Package className="h-5 w-5 text-gray-600" />
                        <span>Meus pedidos</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          doLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sair</span>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}

            {/* Ações rápidas (favoritos / carrinho) */}
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
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebars */}
      <FavoriteList
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
      <ShoppingCartWidget
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
