import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../services/slug";

export default function DropdownProdutos() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const categorias = [
    { id: 1, nome: "Rações e Alimentação" },
    { id: 2, nome: "Brinquedos" },
    { id: 3, nome: "Higiene e Beleza" },
    { id: 4, nome: "Acessórios" },
    { id: 5, nome: "Medicamentos" },
    { id: 6, nome: "Ver Todos os Produtos" },
  ];

  const handleCategoryClick = (categoria: string) => {
    const rota =
      categoria === "Ver Todos os Produtos"
        ? "/produtos"
        : `/produtos?categoria=${slugify(categoria)}`;
    navigate(rota);
    setIsOpen(false);
  };

  const handleMouseEnterMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <button
        className="group flex items-center hover:text-teal-600"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Produtos
        <ChevronDown className="ml-1 mt-0.5 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 text-black"
          role="menu"
        >
          <ul className="py-2">
            {categorias.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.nome)}
                  className="w-full text-left px-4 py-2 hover:bg-teal-400 hover:text-white transition-colors"
                  role="menuitem"
                >
                  {cat.nome}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
