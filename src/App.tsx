import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
// Componentes
import ProductList from "./components/ProductList";
import ShoppingCartWidget from "./components/ui/ShoppingCartWidget";

// Providers
import { CategoryProvider } from "./contexts/CategoryContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from './contexts/FavoriteListContext';

// Pages
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Product from "./pages/Product";
import Erro404 from "./pages/Erro404";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import TrocasEDevolucoes from "./pages/TrocasEDevolucoes";

// Componentes fixos
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <FavoritesProvider>
      <CartProvider>
        <CategoryProvider>
          <BrowserRouter>
            <Toaster richColors position="top-right" />

            {/* Rotas */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/login" element={<Login />} />
              <Route path="/meus-pedidos" element={<Orders />} />
              <Route path="/produto/:handle" element={<Product />} />
              <Route path="*" element={<Erro404 />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
              <Route path="/trocas-e-devolucoes" element={<TrocasEDevolucoes />} />
            </Routes>
          </BrowserRouter>
        </CategoryProvider>
      </CartProvider>
    </FavoritesProvider>
  );
};

export default App;
