import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext"; //necessario um arquivo para realizar os fetches no backend
import type { ProductType } from "../types/ProductType";

export default function FavoriteList() {
  const { isAuthenticated, userId } = useAuth();
  const [favorites, setFavorites] = useState<ProductType[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localFavs = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isAuthenticated) {
      fetchFavoritesFromBackend(userId).then((backendFavs) => {
        // Merge únicos (sem duplicar por id)
        const merged = [
          ...backendFavs,
          ...localFavs.filter(
            (local) => !backendFavs.find((b) => b.id === local.id)
          ),
        ];
        setFavorites(merged);
        localStorage.setItem("favorites", JSON.stringify(merged));
      });
    } else {
      setFavorites(localFavs);
    }
  }, [isAuthenticated, userId]);

  function removeFavorite(id: string) {
    const updated = favorites.filter((p) => p.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  function clearAll() {
    setFavorites([]);
    localStorage.removeItem("favorites");
  }

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-16 right-4 w-80 bg-white border p-4 shadow-xl rounded-xl z-50"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Favoritos</h2>
        <button onClick={clearAll} className="text-sm text-red-500">Limpar tudo</button>
      </div>
      <ul>
        {favorites.map((p) => (
          <li key={p.id} className="flex justify-between items-center border-b py-2">
            <span>{p.name}</span>
            <div className="flex gap-2">
              <button className="text-blue-500 text-sm">Ver</button>
              <button onClick={() => removeFavorite(p.id)} className="text-red-500 text-sm">Remover</button>
            </div>
          </li>
        ))}
      </ul>
      {favorites.length === 0 && <p className="text-gray-500 text-sm mt-4">Nenhum favorito ainda.</p>}
    </div>
  );
}
