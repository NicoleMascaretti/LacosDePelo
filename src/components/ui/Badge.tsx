import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { X } from "lucide-react";

interface produtos {
    id: number;
    nome: string;
    preco: number;
}

const produtos: produtos[] = [
    { id: 1, nome: "Produto 1", preco: 10 },
    { id: 2, nome: "Produto 2", preco: 20 },
    { id: 3, nome: "Produto 3", preco: 30 },
];

const Badge = () => {
    const [carrinho, setCarrinho] = useState<produtos[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const addCarrinho = (produto: produtos) => {
        setCarrinho((prevCarrinho) => [...prevCarrinho, produto]);
    }

    const removeCarrinho = (produtoId: number) => {
        setCarrinho((prevCarrinho) => prevCarrinho.filter((produto) => produto.id !== produtoId))
    }

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);

    return (
        <div className="p-5">
            <button onClick={() => setSidebarOpen(true)} className="relative p-2 rounded-full hover:bg-gray-200">
                <ShoppingCart size={30}/>
                {carrinho.length > 0 && (
                    <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
                        {carrinho.length}
                    </span>
                )}
            </button>

            {/* <div>
                {produtos.map(produtos => (
                    <div key={produtos.id}>
                        <span>{produtos.nome}</span>
                        <span>R$ {produtos.preco}</span>
                        <button onClick={() => addCarrinho(produtos)}>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                ))}
            </div> */}

            {sidebarOpen && (
                <div className="fixed insert-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2>
                        Carrinho
                    </h2>
                    <button onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div>
                    {carrinho.map((item) => (
                        <div key={item.id}>
                            <span>{item.nome}</span>
                            <span>R$ {item.preco}</span>
                            <button onClick={() => removeCarrinho(item.id)}>
                                Remover
                            </button>
                        </div>
                    ))}
                    {carrinho.length === 0 && (
                        <p>Carrinho vazio</p>
                    )}
                </div>
            </aside>
        </div>
        
    )
}

export default Badge;