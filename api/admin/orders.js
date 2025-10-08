// /api/admin/orders.js
import { parseCookies } from "../_lib/cookies.js";
import { CONFIG } from "../_lib/config.js";

// Recomendado: use variáveis de ambiente, nada hardcoded
const STORE = process.env.SHOP_DOMAIN
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN; // token do app Admin (Admin API access token)
const API_VERSION = "2025-10"
const ADMIN_GRAPHQL = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`;

/** Decodifica um JWT (id_token) sem verificar assinatura – só para ler o payload */
function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    const json = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Tenta descobrir o e-mail do cliente logado sem depender da Customer API */
function getEmailFromIdToken(req) {
  const cookies = parseCookies(req);
  const idToken = cookies.session; // você já define esse cookie em /api/auth/callback
  if (!idToken) return null;

  const payload = decodeJwtPayload(idToken);
  // Shopify coloca o e-mail no claim "email"
  return payload?.email || null;
}

export default async function handler(req, res) {
  try {
    const { email, customerId, me, first = "20" } = req.query;

    // Monta o filtro da Admin API
    let queryFilter = "";
    if (me === "1" && !email && !customerId) {
      const emailFromIdToken = getEmailFromIdToken(req);
      if (!emailFromIdToken) {
        return res
          .status(401)
          .json({ error: "Not authenticated", details: "Missing email in id_token (session cookie)" });
      }
      // filtro por e-mail na Admin API
      queryFilter = `email:${JSON.stringify(emailFromIdToken)}`;
    } else if (email) {
      queryFilter = `email:${JSON.stringify(email)}`;
    } else if (customerId) {
      queryFilter = `customer_id:${JSON.stringify(customerId)}`;
    } else {
      // Sem filtro -> últimos pedidos da loja
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
              displayFulfillmentStatus
              totalPriceSet { shopMoney { amount currencyCode } }
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

    // Normaliza para o shape que seu Orders.tsx já espera
    const edges = json?.data?.orders?.edges || [];
    const nodes = edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      processedAt: node.createdAt,
      financialStatus: node.displayFinancialStatus,
      fulfillmentStatus: node.displayFulfillmentStatus,
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
