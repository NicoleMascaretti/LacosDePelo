import { useState, useRef, useEffect } from "react";
import { useCategory } from "../../contexts/CategoryContext";

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

const DropdownCategoria = () => {
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { categorias, setCategorias } = useCategory();

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
            <a onClick={() => setOpen((prev) => !prev)} onMouseEnter={() => setOpen(true)} className="text-gray-700 hover:text-teal-600 hover:cursor-pointer transition-colors">
                Categorias
            </a>

            {/* Dropdown menu */}
            {open && (
                <div onMouseLeave={() => { setOpen(false); setSubmenuOpen(null); }} className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                    <ul className="py-2">
                        {categorias.map((cat) => (
                            <li
                                key={cat.id}
                                className="px-4 py-2 hover:bg-teal-400 hover:text-white cursor-pointer relative"
                                onMouseEnter={() => {
                                    if (cat.nome === "Ração e alimentos" || cat.nome === "Brinquedos" || cat.nome === "Higiene e beleza" || cat.nome === "Acessórios" || cat.nome === "Medicamentos") setSubmenuOpen(cat.nome);
                                }}
                                onMouseLeave={() => {
                                    if (cat.nome === "Ração e alimentos" || cat.nome === "Brinquedos" || cat.nome == "Higiene e beleza" || cat.nome === "Acessórios" || cat.nome === "Medicamentos") setSubmenuOpen(null);
                                }}
                            >
                                {cat.nome}
                                {/* Submenu para 'Ração e alimentos' */}
                                {cat.nome === "Ração e alimentos" && submenuOpen === cat.nome && (
                                    <div
                                        className="absolute left-full top-0 mt-0 w-56 bg-white border rounded shadow-lg z-50 text-black"
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
                                        className="absolute left-full top-0 mt-0 w-56 bg-white border rounded shadow-lg z-50 text-black"
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
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria;