import { useState, useRef, useEffect } from "react";

const categorias = [
    { id: 1, nome: "Alimentação" },
    { id: 2, nome: "Higiene" },
    { id: 3, nome: "Brinquedos" },
    { id: 4, nome: "Acessórios" },
    { id: 5, nome: "Petiscos" },
];

const DropdownCategoria = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event:MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={() => setOpen((prev) => !prev)} onMouseEnter={() => setOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">
                Categorias
            </button>

            {/* Dropdown menu */}
            {open && (
                <div onMouseLeave={() => setOpen(false)} className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                    <ul className="py-2">
                        {categorias.map((cat) => (
                            <li key={cat.id} className="px-4 py-2 hover:bg-green-400 cursor-pointer">
                                {cat.nome}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DropdownCategoria;