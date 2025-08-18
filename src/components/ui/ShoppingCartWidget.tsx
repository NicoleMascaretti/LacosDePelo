import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";

const ShoppingCartWidget = () => {
  const { carrinho, removeFromCart } = useCart(); // o useCart é pra gnt usar nos cards de produto dps
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const total = carrinho.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-5">
      <button
        onClick={() => setSidebarOpen(true)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <ShoppingCart size={30} />
        {carrinho.length > 0 && (
          <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
            {carrinho.length}
          </span>
        )}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 transition-transform z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Carrinho</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div>
          {carrinho.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <span className="block font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          ))}
          {carrinho.length === 0 && <p>Carrinho vazio</p>}
        </div>

        <div className="mt-4 font-semibold text-right">
          Total: R$ {total.toFixed(2)}
        </div>
      </aside>
    </div>
  );
};

export default ShoppingCartWidget;
