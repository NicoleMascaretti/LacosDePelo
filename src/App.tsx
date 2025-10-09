import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Providers
import { CategoryProvider } from "./contexts/CategoryContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoriteListContext";

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


// Animação
import { AnimatePresence, motion } from "framer-motion";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/produtos" element={<Page><Produtos /></Page>} />
        <Route path="/sobre" element={<Page><Sobre /></Page>} />
        <Route path="/contato" element={<Page><Contato /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/orders" element={<Page><Orders /></Page>} />
        <Route path="/produto/:handle" element={<Page><Product /></Page>} />
        <Route path="/termos-de-uso" element={<Page><TermosDeUso /></Page>} />
        <Route path="/politica-de-privacidade" element={<Page><PoliticaDePrivacidade /></Page>} />
        <Route path="/trocas-e-devolucoes" element={<Page><TrocasEDevolucoes /></Page>} />
        <Route path="*" element={<Page><Erro404 /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <CategoryProvider>
          <BrowserRouter>
            <Toaster richColors position="top-right" />
            <AnimatedRoutes />
          </BrowserRouter>
        </CategoryProvider>
      </CartProvider>
    </FavoritesProvider>
  );
}
