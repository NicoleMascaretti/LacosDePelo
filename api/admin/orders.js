import { parseCookies } from "../_lib/cookies.js";
import { CONFIG } from "../_lib/config.js";

const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;  // token do app Admin
const ADMIN_GRAPHQL = "https://lacosdepelo.myshopify.com/admin/api/2025-10/graphql.json"

// Tentamos obter o e-mail do cliente logado via Customer Account API (shcat_…)
// Só para sabermos "quem é" e filtrar pedidos desse cliente na Admin API.
async function getLoggedCustomerEmail(req) {
  try {
    const cookies = parseCookies(req);
    const cat = cookies.customer_token;
    if (!cat || !cat.startsWith("shcat_")) return null;

    // IMPORTANTE: aqui use exatamente o endpoint VERSIONADO que já funcionou no seu debug
    const url = CONFIG.customerApiUrl; // ex: https://<store>/customer/api/2025-07/graphql.json
    const q = `query { customer { email } }`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cat}`,
      },
      body: JSON.stringify({ query: q }),
    });

    const t = await r.text();
    const j = JSON.parse(t);
    return j?.data?.customer?.email || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    // Você pode filtrar pedidos de 3 formas:
    // 1) /api/admin/orders?me=1      -> usa o e-mail do cliente logado (via shcat_)
    // 2) /api/admin/orders?email=... -> filtra por e-mail
    // 3) /api/admin/orders?customerId=gid://shopify/Customer/123456
    const { email, customerId, me, first = "20" } = req.query;

    let queryFilter = "";
    if (me === "1" && !email && !customerId) {
      const em = await getLoggedCustomerEmail(req);
      if (!em) {
        return res
          .status(401)
          .json({ error: "Not authenticated", details: "No customer email (shcat_)" });
      }
      queryFilter = `email:${JSON.stringify(em)}`;
    } else if (email) {
      queryFilter = `email:${JSON.stringify(email)}`;
    } else if (customerId) {
      queryFilter = `customer_id:${JSON.stringify(customerId)}`;
    } else {
      // sem filtro: retorna os últimos pedidos da loja
      queryFilter = ``;
    }

    const adminQuery = `
      query OrdersByFilter($first: Int!, $query: String) {
        orders(first: $first, query: $query, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              fulfillmentStatus
              totalPriceSet { shopMoney { amount currencyCode } }
              customer { id email }
            }
          }
        }
      }
    `;

    const r = await fetch(ADMIN_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: adminQuery,
        variables: { first: parseInt(first, 10) || 20, query: queryFilter || null },
      }),
    });

    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { nonJson: text.slice(0, 1000) }; }

    if (!r.ok || json.errors) {
      return res.status(500).json({ error: "Admin API error", details: json.errors || json });
    }

    // Normaliza para o mesmo shape esperado no seu front (Orders.tsx)
    const edges = json?.data?.orders?.edges || [];
    const nodes = edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      processedAt: node.createdAt,
      financialStatus: node.displayFinancialStatus,
      fulfillmentStatus: node.fulfillmentStatus,
      totalPrice: node.totalPriceSet?.shopMoney
        ? {
            amount: node.totalPriceSet.shopMoney.amount,
            currencyCode: node.totalPriceSet.shopMoney.currencyCode,
          }
        : null,
    }));

    return res.status(200).json({ data: { customer: { orders: { nodes } } } });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
