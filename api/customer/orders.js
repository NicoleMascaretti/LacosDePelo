import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const cookies = parseCookies(req);
    const cat = cookies.customer_token;

    if (!cat || !cat.startsWith("shcat_")) {
      res.status(401).json({ error: "Not authenticated", details: "Missing shcat_ token" });
      return;
    }

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

    const resp = await fetch(CONFIG.customerApiUrl, {
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
      res.status(500).json({ error: "Customer API error", details: text.slice(0, 1200) });
      return;
    }

    if (!resp.ok || json.errors) {
      res.status(500).json({ error: "Customer API error", details: json.errors || json });
      return;
    }

    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: "Unexpected error", details: String(e) });
  }
}
