import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";
import { discoverCustomerApi } from "../_lib/discovery.js";

export default async function handler(req, res) {
  try {
    const { customer_token } = parseCookies(req);
    if (!customer_token) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { graphql_api } = await discoverCustomerApi(CONFIG.shopDomain);
    const r = await fetch(graphql_api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // A Shopify aceita **Bearer** para Customer API:
        "Authorization": `Bearer ${customer_token}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", detail: String(e) });
  }
}
