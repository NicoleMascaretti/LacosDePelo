import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/ui/Footer";

type Money = { amount: string; currencyCode: string };
type LineItem = { title: string; quantity: number };

type Order = {
  id: string;
  name?: string | null;
  number?: number | null;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  statusUrl?: string | null;
  totalPriceSet?: { shopMoney: Money };
  lineItems?: { nodes: LineItem[] };
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/customer/orders", { credentials: "include" });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Erro ao carregar pedidos");
        if (mounted) setOrders(j.orders || []);
      } catch (e: any) {
        if (mounted) setErr(e.message || "Erro inesperado");
      } finally {
        if (mounted) setLoading(false);
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

        {/* Estados de feedback */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-gray-600">Carregando seus pedidos…</p>
          </div>
        )}

        {err && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-red-600">Não foi possível carregar seus pedidos.</p>
            <p className="text-gray-600 mt-1 text-sm">{err}</p>
          </div>
        )}

        {!loading && !err && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-gray-700">Você ainda não possui pedidos.</p>
          </div>
        )}

        {/* Lista de pedidos */}
        <div className="space-y-4">
          {orders.map((o) => {
            const total = o.totalPriceSet?.shopMoney;
            const title = o.name || (o.number ? `Pedido #${o.number}` : "Pedido");
            return (
              <div key={o.id} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">
                      Realizado em {new Date(o.processedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      {o.financialStatus && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100">
                          Pagamento: {o.financialStatus}
                        </span>
                      )}
                      {o.fulfillmentStatus && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100">
                          Entrega: {o.fulfillmentStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {total && (
                      <p className="text-lg font-semibold text-gray-900">
                        {Number(total.amount).toLocaleString(undefined, {
                          style: "currency",
                          currency: total.currencyCode || "BRL",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Itens do pedido */}
                {o.lineItems?.nodes?.length ? (
                  <ul className="mt-4 text-sm text-gray-800 list-disc pl-5 space-y-1">
                    {o.lineItems.nodes.map((li, idx) => (
                      <li key={idx} className="leading-5">
                        {li.title} × {li.quantity}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Acompanhar pedido */}
                {o.statusUrl && (
                  <a
                    className="inline-block mt-4 text-teal-600 hover:underline font-medium"
                    href={o.statusUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Acompanhar pedido
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
