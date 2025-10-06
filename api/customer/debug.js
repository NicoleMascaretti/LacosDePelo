// /api/customer/debug.js
import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const cat = cookies.customer_token;

  if (!cat || !cat.startsWith("shcat_")) {
    res.status(200).json({ note: "Sem shcat_ nos cookies" });
    return;
  }

  const query = `
    query DebugCustomer {
      customer {
        id
        email
        firstName
        orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
          nodes { id name processedAt }
        }
      }
    }
  `;

  const r = await fetch(CONFIG.customerApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cat}`,
    },
    body: JSON.stringify({ query }),
  });

  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { nonJson: text.slice(0, 1000) }; }

  res.status(r.ok ? 200 : 500).json({
    endpoint: CONFIG.customerApiUrl,
    ok: r.ok,
    status: r.status,
    data: json
  });
}
