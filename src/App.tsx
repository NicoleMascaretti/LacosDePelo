// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { FavoritesProvider } from "@/contexts/FavoritesContext";
// import React from "react";
// import { ShoppingCart } from "lucide-react"
// import Badge from "./components/ui/ShoppingCartWidget";

import CardCategoria from "./components/ui/CardCategoria";
import img1 from "../public/Cachorro1.jpg"

const App = () => {
    return (
        <div className="flex gap-20 mt-5 ms-1 me-1">
            <CardCategoria img={img1} icon={"🥘"} titulo={"Ração e alimentação"} sub={"Rações premium e snaks"}/>
            <CardCategoria img={img1} icon={"🎾"} titulo={"Brinquedos"} sub={"Diversão garantida"}/>
            <CardCategoria img={img1} icon={"🛁"} titulo={"Higiêne e beleza"} sub={"Cuidados essenciais"}/>
        </div>
    );
}

export default App;