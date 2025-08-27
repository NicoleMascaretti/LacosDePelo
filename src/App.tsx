import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

// Componentes fixos
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <FavoritesProvider>
      <CartProvider>
        <CategoryProvider>
          <BrowserRouter>


            {/* Rotas */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/produtos/:id" element={<Product />} />
            </Routes>
          </BrowserRouter>
        </CategoryProvider>
      </CartProvider>
    </FavoritesProvider>
  );
};

export default App;
