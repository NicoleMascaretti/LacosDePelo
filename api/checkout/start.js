// /api/checkout/start.js
import { parseCookies } from "../_lib/cookies.js";

const STORE_DOMAIN = process.env.SHOP_DOMAIN; // ex: lacosdepelo.myshopify.com
const SF_VERSION   = "2025-10";
const SF_TOKEN     = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

function decodeJwtEmailFromSession(req) {
  try {
    const cookies = parseCookies(req);
    const idToken = cookies.session;
    if (!idToken) return null;
    const [, payload] = idToken.split(".");
    const json = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return json?.email || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!STORE_DOMAIN || !SF_TOKEN) {
      return res.status(500).json({
        error: "Missing config",
        details: "SHOP_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set",
      });
    }

    const { lines } = await (async () => {
      try { return await req.json?.() || await new Response(req).json(); }
      catch { return await new Promise((resolve) => {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          try { resolve(JSON.parse(body || "{}")); } catch { resolve({}); }
        });
      }); }
    })();

    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: "Lines required", details: "Body must include non-empty 'lines'[]" });
    }

    // valida campos mínimos
    for (const l of lines) {
      if (!l?.merchandiseId || typeof l.quantity !== "number") {
        return res.status(400).json({
          error: "Invalid line",
          details: "Each line must include { merchandiseId: GID, quantity: number }",
        });
      }
    }

    // tenta pegar email do login (opcional)
    const buyerEmail = decodeJwtEmailFromSession(req);

    const endpoint = `https://${STORE_DOMAIN}/api/${SF_VERSION}/graphql.json`;
    const mutation = /* GraphQL */ `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines, // [{ merchandiseId, quantity }]
        ...(buyerEmail ? { buyerIdentity: { email: buyerEmail } } : {}),
      },
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SF_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const text = await r.text();
    let json;
    try { json = JSON.parse(text); } catch {
      return res.status(502).json({ error: "Invalid Storefront response", details: text.slice(0, 800) });
    }

    if (!r.ok || json.errors) {
      return res.status(502).json({ error: "Storefront API error", details: json.errors || json });
    }

    const payload = json?.data?.cartCreate;
    const checkoutUrl = payload?.cart?.checkoutUrl;
    const userErrors = payload?.userErrors || [];

    if (userErrors.length) {
      return res.status(400).json({ error: "Storefront userErrors", details: userErrors });
    }
    if (!checkoutUrl) {
      return res.status(500).json({ error: "No checkoutUrl returned", details: payload });
    }

    return res.status(200).json({ checkoutUrl });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
