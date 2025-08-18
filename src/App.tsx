import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { CategoryProvider } from "./contexts/CategoryContext";

// Pages
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";

// Componentes fixos
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <CategoryProvider>
      <BrowserRouter>


        {/* Rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </BrowserRouter>
    </CategoryProvider>
  );
};

export default App;
