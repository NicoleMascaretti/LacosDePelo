import { useState, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { slugify } from '../../services/slug'

export default function DropdownProdutos() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // --- Dados do menu e submenus ---
  const categorias = [
    { id: 1, nome: "Rações e Alimentação" },
    { id: 2, nome: "Brinquedos" },
    { id: 3, nome: "Higiene e Beleza" },
    { id: 4, nome: "Acessórios" },
    { id: 5, nome: "Medicamentos" },
    { id: 6, nome: "Ver Todos os Produtos" },
  ];

  const categoriasComSubmenu = [
    "Rações e Alimentação",
    "Brinquedos",
    "Higiene e Beleza",
    "Acessórios",
    "Medicamentos",
  ];

  const submenuData: { [key: string]: { id: number; nome: string }[] } = {
    "Rações e Alimentação": [
      { id: 1, nome: "Ração Seca" },
      { id: 2, nome: "Ração Úmida" },
      { id: 3, nome: "Ração Natural" },
      { id: 4, nome: "Ração Medicamentosa" },
    ],
    Brinquedos: [
      { id: 1, nome: "Pelúcias" },
      { id: 2, nome: "Bolas" },
      { id: 3, nome: "Cordas" },
    ],
    "Higiene e Beleza": [
      { id: 1, nome: "Tapetes" },
      { id: 2, nome: "Fraldas" },
      { id: 3, nome: "Coletor de fezes" },
      { id: 4, nome: "Alicates de unha" },
      { id: 5, nome: "Acessórios para banho" },
    ],
    Acessórios: [
      { id: 1, nome: "Comedouros" },
      { id: 2, nome: "Bebedouros" },
      { id: 3, nome: "Porta rações" },
    ],
    Medicamentos: [
      { id: 1, nome: "Vermífugos" },
      { id: 2, nome: "Anti-inflamatórios" },
      { id: 3, nome: "Antibitóticos" },
      { id: 4, nome: "Antipulgas e carrapatos" },
    ],
  };

  // --- Funções de navegação e controle do menu ---
  const handleCategoryClick = (categoria: string) => {
    const rota =
      categoria === "Ver Todos os Produtos"
        ? "/produtos"
        : `/produtos?categoria=${slugify(categoria)}`;
    navigate(rota);
    setIsOpen(false);
    setSubmenuOpen(null);
  };

  const handleMouseEnterMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
      setSubmenuOpen(null);
    }, 150);
  };

  const handleMouseEnterItem = (catNome: string) => {
    if (categoriasComSubmenu.includes(catNome)) {
      setSubmenuOpen(catNome);
    }
  };

  const handleMouseLeaveItem = () => {
    setSubmenuOpen(null);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <button className="group flex items-center hover:text-teal-600">
        Produtos <ChevronDown className="ml-1 mt-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 text-black">
          <ul className="py-2">
            {categorias.map((cat) => {
              const hasSubmenu = categoriasComSubmenu.includes(cat.nome);

              return (
                <li
                  key={cat.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer relative"
                  onClick={() => handleCategoryClick(cat.nome)}
                  onMouseEnter={() => handleMouseEnterItem(cat.nome)}
                  onMouseLeave={handleMouseLeaveItem}
                >
                  {cat.nome}
                  {hasSubmenu && <ChevronRight className="h-4 w-4" />}
                  {hasSubmenu && submenuOpen === cat.nome && (
                    <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black">
                      <ul className="py-2">
                        {submenuData[cat.nome].map((item) => (
                          <li
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(item.nome);
                            }}
                            className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer"
                          >
                            {item.nome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
