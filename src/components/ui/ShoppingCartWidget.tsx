import { useState } from "react";
import { ShoppingCart, X, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";

const ShoppingCartWidget = () => {
  const { carrinho, removeFromCart } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const total = carrinho.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-5">
      {/* Botão carrinho */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100"
      >
        <ShoppingCart size={24} />
        {carrinho.length > 0 && (
          <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
            {carrinho.length}
          </span>
        )}
      </button>

      {/* Fundo escuro */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-full sm:w-1/3 h-full bg-white shadow-lg p-5 transition-transform duration-500 z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}

          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShoppingBag /> Carrinho de Compras ({carrinho.length} itens)</h2>
            <p className="text-sm text-muted-foreground text-gray-500">
              Revise seus produtos antes de finalizar a compra
            </p>
          </div>

        {/* <div className="flex items-center justify-between mb-6">
          <ShoppingBag />
          <h2 className="text-lg font-semibold">Carrinho de Compras ({carrinho.length} itens)</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div>
          <p>Revise seus produtos antes de finalizar a compra</p>
        </div> */}
        {/* Conteúdo */}
        <div className="flex flex-col h-[calc(100%-3rem)]">
          {carrinho.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center text-center text-gray-600 mb-96">
              <ShoppingBag size={64} className="mb- text-gray-400" />
              <h3 className="text-lg font-semibold text-foreground text-black">Seu carrinho está vazio</h3>
              <p className="text-md text-gray-500 mt-1">
                Adicione alguns produtos para começar suas compras
              </p>
            </div>
            
          ) : (
            <div className="flex-1 overflow-y-auto">
              {carrinho.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4 border-b pb-2"
                >
                  <div>
                    <span className="block font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total (só aparece se tiver item) */}
          {carrinho.length > 0 && (
            <div className="mt-4 font-semibold text-right">
              Total: R$ {total.toFixed(2)}
            </div>
          )}
        </div>
        <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" onClick={() => setSidebarOpen(false)}>
          <X size={18} />
        </button>
      </aside>
    </div>
  );
};

export default ShoppingCartWidget;
