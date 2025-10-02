import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const cookies = parseCookies(req);
    const accessToken = cookies.session_access;

    if (!accessToken) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // GraphQL para Customer Account API (contas novas)
    const query = `
      query Orders {
        customer {
          id
          email
          orders(first: 20, reverse: true) {
            nodes {
              id
              name
              number
              processedAt
              financialStatus
              fulfillmentStatus
              statusUrl
              totalPriceSet {
                shopMoney { amount currencyCode }
              }
              lineItems(first: 10) {
                nodes {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    `;

    const resp = await fetch(CONFIG.customerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // O access_token do fluxo OIDC
        "Authorization": `Bearer ${accessToken}`,
        // dom da loja para Customer Account API
        "Shopify-Shop-Domain": CONFIG.shopDomain, // ex: lacosdepelo.myshopify.com
      },
      body: JSON.stringify({ query }),
    });

    const data = await resp.json();

    if (!resp.ok || data.errors) {
      res.status(500).json({ error: "Customer API error", detail: data.errors ?? data });
      return;
    }

    const orders = data?.data?.customer?.orders?.nodes ?? [];
    res.status(200).json({ orders });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
