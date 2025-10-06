import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type MoneyV2 = { amount: string; currencyCode: string };
type OrderNode = {
  id: string;
  name: string;
  processedAt?: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  totalPrice?: MoneyV2 | null; // <-- combina com o que o backend retorna
};

type OrdersResponseOk = {
  data?: {
    customer?: {
      email?: string | null;
      orders?: { nodes?: OrderNode[] };
    };
  };
};

type OrdersResponseErr = {
  error?: string;
  details?: unknown; // pode ser JSON da Shopify ou HTML (nonJson/snippet)
  endpointTried?: string;
  status?: number;
  bodySnippet?: string;
};

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderNode[]>([]);
  const [error, setError] = useState<OrdersResponseErr | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // ✅ chama o endpoint que criamos no backend
        const res = await fetch("/api/customer/orders", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        let json: OrdersResponseOk | OrdersResponseErr;

        try {
          json = JSON.parse(text);
        } catch {
          json = { error: "Non-JSON response", details: text.slice(0, 1000) };
        }

        if (!res.ok) {
          if (mounted) {
            setError(json as OrdersResponseErr);
            setLoading(false);
          }
          return;
        }

        const nodes =
          (json as OrdersResponseOk)?.data?.customer?.orders?.nodes ?? [];

        if (mounted) {
          setOrders(nodes);
          setLoading(false);
        }
      } catch (e: any) {
        if (mounted) {
          setError({ error: e?.message || "Erro inesperado" });
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>

        {/* Loading */}
        {loading && (
          <div className="p-6 bg-white rounded-xl shadow-sm">Carregando...</div>
        )}

        {/* Error (mostra details) */}
        {!loading && error && (
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <p className="text-red-600 font-semibold mb-3">
              Não foi possível carregar seus pedidos.
            </p>
            <pre className="text-xs whitespace-pre-wrap text-gray-700 overflow-auto max-h-80">
              {JSON.stringify(error, null, 2)}
            </pre>
            <div className="mt-4">
              <button
                onClick={() =>
                (window.location.href = `/api/auth/start?returnTo=${encodeURIComponent(
                  "/orders"
                )}`)
                }
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
              >
                Entrar novamente
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600">
              Você ainda não possui pedidos.
            </p>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{o.name}</h3>
                  <p className="text-sm text-gray-600">
                    {o.processedAt
                      ? new Date(o.processedAt).toLocaleString()
                      : "Data indisponível"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {o.fulfillmentStatus ?? "—"} | Pagamento:{" "}
                    {o.financialStatus ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-emerald-600">
                    {o.totalPrice
                      ? `R$ ${Number(o.totalPrice.amount).toFixed(2)}`
                      : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
