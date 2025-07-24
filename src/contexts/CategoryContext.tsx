import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Categoria {
    id: number
    nome: string
}

interface CategoryContextType {
    categorias: Categoria[]
    setCategorias: (categorias: Categoria[]) => void
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    return (
        <CategoryContext.Provider value={{ categorias, setCategorias }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory deve ser usado dentro do CategoryProvider");
    }
    return context;
};
