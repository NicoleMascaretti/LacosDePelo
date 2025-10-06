// /api/customer/debug.js
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    // 1) Descobre o endpoint a partir do domínio da loja
    const shopDomain = process.env.SHOP_DOMAIN; // ex: lacosdepelo.myshopify.com
    const wellKnownUrl = `https://${shopDomain}/.well-known/customer-account-api`;

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
    if (!endpoint) {
      return res.status(500).json({
        error: "No graphql_api in discovery",
        discovered,
      });
    }

    // 2) Faz um OPTIONS só para checar status sem precisar de token
    const ping = await fetch(endpoint, { method: "OPTIONS" });

    return res.status(200).json({
      wellKnownUrl,
      discovered,
      endpoint,
      optionsStatus: ping.status,
      optionsOk: ping.ok,
    });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected", details: String(e) });
  }
}
