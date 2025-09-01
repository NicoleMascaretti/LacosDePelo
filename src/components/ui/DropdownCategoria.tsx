import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../contexts/CategoryContext";
import { useCategories } from "../../hooks/useCategories";
import { ChevronDown, ChevronRight } from 'lucide-react';

// --- ARRAYS DE SUBMENU ATUALIZADOS ---
// Adicionada a opção "Ver todos" em cada um para navegar para a categoria pai.

const racao = [
    { id: 1, nome: "Ração Seca" },
    { id: 2, nome: "Ração Umida" },
    { id: 3, nome: "Ração Natural" },
    { id: 4, nome: "Ração Medicamentosa" },
    { id: 5, nome: "Ver todos" }, // Nome padronizado
];

const brinquedos = [
    { id: 1, nome: "Pelúcias" },
    { id: 2, nome: "Bolas" },
    { id: 3, nome: "Cordas" },
    { id: 4, nome: "Ver todos" }, // Adicionado
]

const higiene = [
    { id: 1, nome: "Tapetes" },
    { id: 2, nome: "Fraldas" },
    { id: 3, nome: "Coletor de fezes" },
    { id: 4, nome: "Alicates de unha" },
    { id: 5, nome: "Acessórios para banho" },
    { id: 6, nome: "Ver todos" }, // Adicionado
]

const acessorios = [
    { id: 1, nome: "Comedouros" },
    { id: 2, nome: "Bebedouros" },
    { id: 3, nome: "Porta rações" },
    { id: 4, nome: "Mamadeiras" },
    { id: 5, nome: "Ver todos" }, // Adicionado
]

const medicamentos = [
    { id: 1, nome: "Vermífugos" },
    { id: 2, nome: "Anti-inflamatórios" },
    { id: 3, nome: "Antibitóticos" },
    { id: 4, nome: "Antipulgas e carrapatos" },
    { id: 5, nome: "Ver todos" }, // Adicionado
]

// --- RESTANTE DO COMPONENTE ---

const categoriasPadrao = [
    { id: 1, nome: "Rações e Alimentação" },
    { id: 2, nome: "Brinquedos" },
    { id: 3, nome: "Higiene e Beleza" },
    { id: 4, nome: "Acessórios" },
    { id: 5, nome: "Medicamentos" },
];

const categoriasComSubmenu = [
    "Rações e Alimentação",
    "Brinquedos",
    "Higiene e Beleza",
    "Acessórios",
    "Medicamentos",
];

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'e')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

const DropdownCategoria = () => {
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { categorias, setCategorias } = useCategory();

    const { loading } = useCategories();

    useEffect(() => {
        if (categorias.length === 0) {
            setCategorias(categoriasPadrao);
        }
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSubmenuOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categorias, setCategorias]);

    const handleCategoryClick = (categoryName: string) => {
        const categorySlug = slugify(categoryName);
        navigate(`/produtos?categoria=${categorySlug}`);
        setOpen(false);
        setSubmenuOpen(null);
    };

    const handleViewAllProducts = () => {
        navigate('/produtos');
        setOpen(false);
        setSubmenuOpen(null);
    }

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {loading && <div className="text-gray-500 px-4 py-2">Carregando categorias...</div>}
            
            <a onClick={() => setOpen((prev) => !prev)} onMouseEnter={() => setOpen(true)} className="flex items-center gap-1 text-gray-700 hover:text-teal-600 hover:cursor-pointer transition-colors">
                Produtos
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''} mt-0.5`} />
            </a>

            {open && (
                <div onMouseLeave={() => { setOpen(false); setSubmenuOpen(null); }} className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                    <ul className="py-2">
                        {categorias.map((cat) => {
                            const hasSubmenu = categoriasComSubmenu.includes(cat.nome);

                            return (
                                <li
                                    key={cat.id}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer relative"
                                    onClick={() => handleCategoryClick(cat.nome)}
                                    onMouseEnter={() => {
                                        if (hasSubmenu) setSubmenuOpen(cat.nome);
                                    }}
                                >
                                    {cat.nome}
                                    {hasSubmenu && <ChevronRight className="h-4 w-4" />}

                                    {/* Submenu para 'Rações e Alimentação' */}
                                    {cat.nome === "Rações e Alimentação" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black" onMouseEnter={() => setSubmenuOpen(cat.nome)}>
                                            <ul className="py-2">
                                                {racao.map((item) => (
                                                    <li key={item.id} onClick={(e) => { e.stopPropagation(); item.nome === "Ver todos" ? handleCategoryClick(cat.nome) : handleCategoryClick(item.nome); }} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submenu para 'Brinquedos' */}
                                    {cat.nome === "Brinquedos" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black" onMouseEnter={() => setSubmenuOpen(cat.nome)}>
                                            <ul className="py-2">
                                                {brinquedos.map((item) => (
                                                    <li key={item.id} onClick={(e) => { e.stopPropagation(); item.nome === "Ver todos" ? handleCategoryClick(cat.nome) : handleCategoryClick(item.nome); }} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submenu para 'Higiene e Beleza' */}
                                    {cat.nome === "Higiene e Beleza" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black" onMouseEnter={() => setSubmenuOpen(cat.nome)}>
                                            <ul className="py-2">
                                                {higiene.map((item) => (
                                                    <li key={item.id} onClick={(e) => { e.stopPropagation(); item.nome === "Ver todos" ? handleCategoryClick(cat.nome) : handleCategoryClick(item.nome); }} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submenu para 'Acessórios' */}
                                    {cat.nome === "Acessórios" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black" onMouseEnter={() => setSubmenuOpen(cat.nome)}>
                                            <ul className="py-2">
                                                {acessorios.map((item) => (
                                                    <li key={item.id} onClick={(e) => { e.stopPropagation(); item.nome === "Ver todos" ? handleCategoryClick(cat.nome) : handleCategoryClick(item.nome); }} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submenu para 'Medicamentos' */}
                                    {cat.nome === "Medicamentos" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black" onMouseEnter={() => setSubmenuOpen(cat.nome)}>
                                            <ul className="py-2">
                                                {medicamentos.map((item) => (
                                                    <li key={item.id} onClick={(e) => { e.stopPropagation(); item.nome === "Ver todos" ? handleCategoryClick(cat.nome) : handleCategoryClick(item.nome); }} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                        
                        {/* --- NOVO: SEPARADOR E OPÇÃO "VER TODOS" --- */}
                        <hr className="my-1 border-gray-200" />
                        <li
                            className="flex justify-between items-center px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer"
                            onClick={handleViewAllProducts}
                        >
                            Ver Todos os Produtos
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria;