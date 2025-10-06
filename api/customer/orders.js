// /api/customer/orders.js
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const shopDomain = process.env.SHOP_DOMAIN; // ex: lacosdepelo.myshopify.com
    if (!shopDomain) {
      return res.status(500).json({ error: "Missing SHOP_DOMAIN env" });
    }

    // 0) pega o shcat_ do cookie
    const cookies = parseCookies(req);
    const cat = cookies.customer_token;
    if (!cat || !cat.startsWith("shcat_")) {
      return res.status(401).json({
        error: "Not authenticated",
        details: "Missing shcat_ token",
      });
    }

    // 1) Descobre endpoint do Customer API
    const wellKnownUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    const discResp = await fetch(wellKnownUrl);
    const discText = await discResp.text();

    let discovery;
    try {
      discovery = JSON.parse(discText);
    } catch {
      return res.status(500).json({
        error: "Discovery not JSON",
        wellKnownUrl,
        body: discText.slice(0, 800),
      });
    }

    const endpoint = discovery?.graphql_api;
    if (!endpoint) {
      return res.status(500).json({
        error: "No graphql_api in discovery",
        discovered: discovery,
      });
    }

    // 2) Query de pedidos
    const query = `
      query Orders {
        customer {
          id
          orders(first: 20, reverse: true) {
            nodes {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
            }
          }
        }
      }
    `;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cat}`,
      },
      body: JSON.stringify({ query }),
    });

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      // Quando a Shopify retorna HTML (por ex., rota não provisionada),
      // devolvemos o conteúdo para facilitar debug.
      return res.status(500).json({
        error: "Customer API non-JSON",
        endpoint,
        status: resp.status,
        body: text.slice(0, 1200),
      });
    }

    if (!resp.ok || json.errors) {
      return res.status(500).json({
        error: "Customer API error",
        endpoint,
        status: resp.status,
        details: json.errors || json,
      });
    }

    return res.status(200).json(json);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
// /api/customer/orders.js
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const shopDomain = process.env.SHOP_DOMAIN; // ex: lacosdepelo.myshopify.com
    if (!shopDomain) {
      return res.status(500).json({ error: "Missing SHOP_DOMAIN env" });
    }

    // 0) pega o shcat_ do cookie
    const cookies = parseCookies(req);
    const cat = cookies.customer_token;
    if (!cat || !cat.startsWith("shcat_")) {
      return res.status(401).json({
        error: "Not authenticated",
        details: "Missing shcat_ token",
      });
    }

    // 1) Descobre endpoint do Customer API
    const wellKnownUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    const discResp = await fetch(wellKnownUrl);
    const discText = await discResp.text();

    let discovery;
    try {
      discovery = JSON.parse(discText);
    } catch {
      return res.status(500).json({
        error: "Discovery not JSON",
        wellKnownUrl,
        body: discText.slice(0, 800),
      });
    }

    const endpoint = discovery?.graphql_api;
    if (!endpoint) {
      return res.status(500).json({
        error: "No graphql_api in discovery",
        discovered: discovery,
      });
    }

    // 2) Query de pedidos
    const query = `
      query Orders {
        customer {
          id
          orders(first: 20, reverse: true) {
            nodes {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
            }
          }
        }
      }
    `;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cat}`,
      },
      body: JSON.stringify({ query }),
    });

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      // Quando a Shopify retorna HTML (por ex., rota não provisionada),
      // devolvemos o conteúdo para facilitar debug.
      return res.status(500).json({
        error: "Customer API non-JSON",
        endpoint,
        status: resp.status,
        body: text.slice(0, 1200),
      });
    }

    if (!resp.ok || json.errors) {
      return res.status(500).json({
        error: "Customer API error",
        endpoint,
        status: resp.status,
        details: json.errors || json,
      });
    }

    return res.status(200).json(json);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
