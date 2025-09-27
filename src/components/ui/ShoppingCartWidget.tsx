import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./Sheet";
// opcional: se usa sonner para toast
// import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCartWidget: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!items.length) return;

    // Verifica se todos os itens possuem variantId (necessário para o checkout da Shopify)
    const missingVariant = items.find((i) => !(i as any).variantId);
    if (missingVariant) {
      // toast?.error?.("Alguns itens não possuem variantId da Shopify. Verifique o catálogo.");
      alert("Alguns itens não possuem variantId da Shopify. Verifique o catálogo.");
      return;
    }

    const lines = items.map((i) => ({
      merchandiseId: (i as any).variantId as string, // GID da variante
      quantity: i.quantity,
    }));

    try {
      setIsCheckingOut(true);

      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ lines }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Falha ao iniciar checkout.");
      }

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!data.checkoutUrl) {
        throw new Error(data.error || "Checkout URL não retornada pelo servidor.");
      }

      // Redireciona para o checkout da Shopify
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      // toast?.error?.(err?.message || "Erro ao iniciar checkout.");
      alert(err?.message || "Erro ao iniciar checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full bg-white sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Compras ({items.length} {items.length === 1 ? "item" : "itens"})
          </SheetTitle>
          <SheetDescription>Revise seus produtos antes de finalizar a compra</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground">Adicione alguns produtos para começar suas compras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 p-1 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">R$ {getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Redirecionando..." : "Finalizar Compra"}
              </Button>

              <Button variant="outline" className="w-full" onClick={clearCart} disabled={isCheckingOut}>
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCartWidget;
