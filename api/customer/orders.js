// /api/customer/orders.js
import { parseCookies } from "../_lib/cookies.js";

function getShopNumericFromTokenUrl() {
  try {
    const p = new URL(process.env.SHOPIFY_TOKEN_URL); // .../authentication/<num>/oauth/token
    const parts = p.pathname.split("/").filter(Boolean);
    // ["authentication", "<num>", "oauth", "token"]
    return parts?.[1];
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const shopDomain = process.env.SHOP_DOMAIN;
    if (!shopDomain) {
      return res.status(500).json({ error: "Missing SHOP_DOMAIN env" });
    }

    const { customer_token: cat } = parseCookies(req);
    if (!cat || !cat.startsWith("shcat_")) {
      return res.status(401).json({ error: "Not authenticated", details: "Missing shcat_ token" });
    }

    // 1) discovery
    const wellKnownUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    const discResp = await fetch(wellKnownUrl);
    const discText = await discResp.text();
    let discovery;
    try { discovery = JSON.parse(discText); }
    catch {
      return res.status(500).json({ error: "Discovery not JSON", wellKnownUrl, body: discText.slice(0, 800) });
    }

    const discoveredEndpoint = discovery?.graphql_api;
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

    async function postTo(endpoint) {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cat}`,
        },
        body: JSON.stringify({ query }),
      });
      const t = await r.text();
      let j; try { j = JSON.parse(t); } catch { return { ok: false, status: r.status, nonJson: t.slice(0, 1200) }; }
      return { ok: r.ok && !j.errors, status: r.status, json: j, raw: j };
    }

    // 2) tenta o endpoint do discovery
    let first = await postTo(discoveredEndpoint);

    // 3) fallback se 404
    if ((first.status === 404 || first.nonJson) && process.env.SHOPIFY_TOKEN_URL) {
      const shopNum = getShopNumericFromTokenUrl();
      if (shopNum) {
        const fallback = `https://shopify.com/${shopNum}/account/customer/api/graphql`;
        const second = await postTo(fallback);
        if (second.ok) {
          return res.status(200).json(second.json);
        }
        // se também falhar, retorna os dois resultados para debug
        return res.status(500).json({
          error: "Both endpoints failed",
          discoveredEndpoint,
          first,
          fallback,
          second,
        });
      }
    }

    if (first.ok) return res.status(200).json(first.json);

    return res.status(500).json({
      error: "Customer API error",
      discoveredEndpoint,
      first,
    });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
