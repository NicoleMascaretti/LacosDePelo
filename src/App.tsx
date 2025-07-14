import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import React from "react";
import { ShoppingCart } from "lucide-react"
import Badge from "./components/ui/ShoppingCartWidget";

const App = () => {
    return (
        <div className="">
            <Badge />
        </div>
    );
}

export default App;