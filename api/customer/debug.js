// /api/customer/debug.js
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const shopDomain = process.env.SHOP_DOMAIN; // ex: lacosdepelo.myshopify.com
    const wellKnownUrl = `https://${shopDomain}/.well-known/customer-account-api`;

    // 1) Descobre o endpoint
    const d = await fetch(wellKnownUrl);
    const dText = await d.text();
    let discovered;
    try {
      discovered = JSON.parse(dText);
    } catch {
      return res.status(500).json({
        error: "Discovery not JSON",
        wellKnownUrl,
        body: dText.slice(0, 800),
      });
    }
    const endpoint = discovered?.graphql_api;

    // 2) Pega shcat_ dos cookies
    const { customer_token: cat } = parseCookies(req);
    if (!cat || !cat.startsWith("shcat_")) {
      return res.status(401).json({
        error: "No shcat_ token (login first)",
        discovered,
        endpoint,
      });
    }

    // 3) Faz um POST real
    const query = `query { customer { id } }`;
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
    try { json = JSON.parse(text); }
    catch {
      return res.status(500).json({
        error: "Non-JSON from Customer API",
        endpoint,
        status: resp.status,
        body: text.slice(0, 1200),
      });
    }

    return res.status(resp.ok ? 200 : 500).json({
      ok: resp.ok,
      status: resp.status,
      endpoint,
      json,
    });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected", details: String(e) });
  }
}
