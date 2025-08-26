import { useState, useRef, useEffect } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { useCategories } from "../../hooks/useCategories";
import { ChevronDown, ChevronRight } from 'lucide-react'; // Importe o ChevronRight também

const racao = [
    { id: 1, nome: "Ração Seca" },
    { id: 2, nome: "Ração Umida" },
    { id: 3, nome: "Ração Natural" },
    { id: 4, nome: "Ração Medicamentosa" },
    { id: 5, nome: "Ver todos os produtos" },
];

const brinquedos = [
    { id: 1, nome: "Pelúcias" },
    { id: 2, nome: "Bolas" },
    { id: 3, nome: "Cordas" },
]

const higiene = [
    { id: 1, nome: "Tapetes" },
    { id: 2, nome: "Fraldas" },
    { id: 3, nome: "Coletor de fezes" },
    { id: 4, nome: "Alicates de unha" },
    { id: 5, nome: "Acessórios para banho" },
]

const acessorios = [
    { id: 1, nome: "Comedouros" },
    { id: 2, nome: "Bebedouros" },
    { id: 3, nome: "Porta rações" },
    { id: 4, nome: "Mamadeiras" },
]

const medicamentos = [
    { id: 1, nome: "Vermífugos" },
    { id: 2, nome: "Anti-inflamatórios" },
    { id: 3, nome: "Antibitóticos" },
    { id: 4, nome: "Antipulgas e carrapatos"}
]

const categoriasPadrao = [
    { id: 1, nome: "Ração e alimentos" },
    { id: 2, nome: "Brinquedos" },
    { id: 3, nome: "Higiene e beleza" },
    { id: 4, nome: "Acessórios" },
    { id: 5, nome: "Medicamentos" },
];

// Lista para identificar facilmente quais categorias têm submenu
const categoriasComSubmenu = [
    "Ração e alimentos",
    "Brinquedos",
    "Higiene e beleza",
    "Acessórios",
    "Medicamentos",
];


const DropdownCategoria = () => {
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { categorias, setCategorias } = useCategory();

    // Busca categorias da Shopify e popula o contexto automaticamente
    const { loading, error } = useCategories();

    useEffect(() => {
        // Preenche o contexto se estiver vazio
        if (categorias.length === 0) {
            setCategorias(categoriasPadrao);
        }
        function handleClickOutside(event:MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSubmenuOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [categorias, setCategorias]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {loading && <div className="text-gray-500 px-4 py-2">Carregando categorias...</div>}
            {/* Tem ver isso daqui depois com a API. Esse erro aparece no front do usuário na Navbar*/}
            {/* {error && <div className="text-red-500 px-4 py-2">Erro: {error}</div>} */}
            
            {/* Botão principal com a seta animada */}
            <a onClick={() => setOpen((prev) => !prev)} onMouseEnter={() => setOpen(true)} className="flex items-center gap-1 text-gray-700 hover:text-teal-600 hover:cursor-pointer transition-colors">
                Categorias
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </a>

            {/* Dropdown menu */}
            {open && (
                <div onMouseLeave={() => { setOpen(false); setSubmenuOpen(null); }} className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                    <ul className="py-2">
                        {categorias.map((cat) => {
                            const hasSubmenu = categoriasComSubmenu.includes(cat.nome);

                            return (
                                <li
                                    key={cat.id}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer relative"
                                    onMouseEnter={() => {
                                        if (hasSubmenu) setSubmenuOpen(cat.nome);
                                    }}
                                    onMouseLeave={() => {
                                        if (hasSubmenu) setSubmenuOpen(null);
                                    }}
                                >
                                    {cat.nome}
                                    {/* Adiciona a seta para a direita se houver submenu */}
                                    {hasSubmenu && <ChevronRight className="h-4 w-4" />}

                                    {/* Submenu para 'Ração e alimentos' */}
                                    {cat.nome === "Ração e alimentos" && submenuOpen === cat.nome && (
                                        <div
                                            className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black"
                                            onMouseEnter={() => setSubmenuOpen(cat.nome)}
                                            onMouseLeave={() => setSubmenuOpen(null)}
                                        >
                                            <ul className="py-2">
                                                {racao.map((item) => (
                                                    <li key={item.id} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Submenu para brinquedos */}
                                    {cat.nome === "Brinquedos" && submenuOpen === cat.nome && (
                                        <div
                                            className="absolute left-full top-0 -mt-0.5 w-56 bg-white border rounded shadow-lg z-50 text-black"
                                            onMouseEnter={() => setSubmenuOpen(cat.nome)}
                                            onMouseLeave={() => setSubmenuOpen(null)}
                                        >
                                            <ul className="py-2">
                                                {brinquedos.map((item) => (
                                                    <li key={item.id} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                        {item.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* ... (restante dos submenus permanece igual) ... */}

                                     {cat.nome === "Higiene e beleza" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 mt-0 w-56 bg-white border rounded shadow-lg z-50 text-black"
                                            onMouseEnter={() => setSubmenuOpen(cat.nome)}
                                            onMouseLeave={() => setSubmenuOpen(null)}>
                                                <ul>
                                                    {higiene.map((item) => (
                                                        <li key={item.id} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                            {item.nome}
                                                        </li>
                                                    ))}
                                                </ul>
                                        </div>
                                    )}
                                    {cat.nome === "Acessórios" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 mt-0 w-56 bg-white border rounded shadow-lg z-50 text-black"
                                            onMouseEnter={() => setSubmenuOpen(cat.nome)}
                                            onMouseLeave={() => setSubmenuOpen(null)}>
                                                <ul>
                                                    {acessorios.map((item) => (
                                                        <li key={item.id} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                            {item.nome}
                                                        </li>
                                                    ))}
                                                </ul>
                                        </div>
                                    )}
                                    {cat.nome === "Medicamentos" && submenuOpen === cat.nome && (
                                        <div className="absolute left-full top-0 mt-0 w-56 bg-white border rounded shadow-lg z-50 text-black"
                                            onMouseEnter={() => setSubmenuOpen(cat.nome)}
                                            onMouseLeave={() => setSubmenuOpen(null)}>
                                                <ul>
                                                    {medicamentos.map((item) => (
                                                        <li key={item.id} className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer">
                                                            {item.nome}
                                                        </li>
                                                    ))}
                                                </ul>
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria;