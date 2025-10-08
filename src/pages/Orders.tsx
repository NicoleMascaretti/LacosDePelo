import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

/** ==== Tipagens ==== */
type MoneyV2 = { amount: string; currencyCode: string };
type OrderItem = { title: string; quantity: number };

type OrderNode = {
  id: string;
  name: string;
  processedAt?: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  totalPrice?: MoneyV2 | null;
  /** novo (opcional): preenchido se o backend já estiver com a query de lineItems */
  items?: OrderItem[];
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
  details?: unknown;
  endpointTried?: string;
  status?: number;
  bodySnippet?: string;
};

/** ==== Helpers visuais ==== */
const brDate = (iso?: string) => {
  if (!iso) return "Data indisponível";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const money = (m?: MoneyV2 | null) => {
  if (!m) return "—";
  const amount = Number(m.amount || "0");
  const currency = m.currencyCode || "BRL";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `R$ ${amount.toFixed(2)}`;
  }
};

const chipClass = {
  success:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  warn: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  muted:
    "bg-gray-100 text-gray-700 ring-1 ring-gray-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  danger:
    "bg-rose-50 text-rose-700 ring-1 ring-rose-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
};

function FulfillmentChip({ status }: { status?: string | null }) {
  const s = (status || "").toUpperCase();
  if (s === "FULFILLED") return <span className={chipClass.success}>Enviado</span>;
  if (s === "PARTIALLY_FULFILLED")
    return <span className={chipClass.info}>Parcialmente enviado</span>;
  if (s === "UNFULFILLED") return <span className={chipClass.warn}>A enviar</span>;
  if (s === "CANCELLED") return <span className={chipClass.danger}>Cancelado</span>;
  return <span className={chipClass.muted}>{status ?? "—"}</span>;
}

function PaymentChip({ status }: { status?: string | null }) {
  const s = (status || "").toUpperCase();
  if (s === "PAID") return <span className={chipClass.success}>Pago</span>;
  if (s === "PARTIALLY_PAID")
    return <span className={chipClass.info}>Parcialmente pago</span>;
  if (s === "AUTHORIZED") return <span className={chipClass.info}>Autorizado</span>;
  if (s === "PENDING") return <span className={chipClass.warn}>Pendente</span>;
  if (s === "REFUNDED") return <span className={chipClass.muted}>Reembolsado</span>;
  return <span className={chipClass.muted}>{status ?? "—"}</span>;
}

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
      <div className="h-3 w-72 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-40 bg-gray-200 rounded mb-4" />
      <div className="h-6 w-24 bg-gray-200 rounded ml-auto" />
    </div>
  );
}

/** ==== Página ==== */
export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderNode[]>([]);
  const [error, setError] = useState<OrdersResponseErr | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const total = useMemo(() => orders?.length ?? 0, [orders]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/orders?me=1", {
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
          setError(null);
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
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Meus pedidos</h1>
            {!loading && !error && (
              <p className="text-sm text-gray-600 mt-1">
                {total === 0
                  ? "Você ainda não possui pedidos."
                  : `${total} pedido${total > 1 ? "s" : ""} encontrado${total > 1 ? "s" : ""}`}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            title="Atualizar"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 3v7h-7" />
            </svg>
            Atualizar
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <p className="text-red-600 font-semibold mb-3">
              Não foi possível carregar seus pedidos.
            </p>
            <pre className="text-xs whitespace-pre-wrap text-gray-700 overflow-auto max-h-80">
              {JSON.stringify(error, null, 2)}
            </pre>

            <div className="mt-4 flex items-center gap-2">
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

              <button
                onClick={() => {
                  setLoading(true);
                  setRefreshKey((k) => k + 1);
                }}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="p-8 bg-white rounded-xl shadow-sm text-center">
            <div className="mb-3 text-2xl">🛍️</div>
            <p className="text-gray-600 mb-4">Você ainda não possui pedidos.</p>
            <Link
              to="/produtos"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700"
            >
              Ver produtos
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => {
              const items = o.items ?? []; // compat: pode não existir
              const first = items[0];
              const extra = Math.max(0, items.reduce((n, it) => n + (it.quantity || 0), 0) - (first?.quantity || 0));

              return (
                <div
                  key={o.id}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900">{o.name}</h3>
                    {/* 👉 Nome do produto (humaniza) */}
                    {first ? (
                      <p className="text-sm text-gray-800">
                        {first.title}
                        {extra > 0 && (
                          <span className="text-gray-500"> {`  •  +${extra} item${extra > 1 ? "s" : ""}`}</span>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Produtos do pedido</p>
                    )}
                    <p className="text-sm text-gray-600">{brDate(o.processedAt)}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Entrega:</span>
                        <FulfillmentChip status={o.fulfillmentStatus} />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Pagamento:</span>
                        <PaymentChip status={o.financialStatus} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-emerald-600">
                      {money(o.totalPrice)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
