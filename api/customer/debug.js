// /api/customer/debug.js
import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  try {
    const cookies = parseCookies(req);
    const cat = cookies.customer_token;

    if (!cat || !cat.startsWith("shcat_")) {
      res.status(401).json({ ok: false, error: "Missing shcat_ token", hint: "Faça login novamente" });
      return;
    }

    // Query mínima só pra validar o endpoint e o token
    const query = `query { customer { id email } }`;

    const resp = await fetch(CONFIG.customerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cat}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      // Se ainda vier HTML (não deve, usando POST), retornamos um recorte
      return res.status(resp.ok ? 200 : resp.status).json({
        endpoint: CONFIG.customerApiUrl,
        ok: resp.ok,
        status: resp.status,
        nonJson: text.slice(0, 1200),
      });
    }

    return res.status(resp.ok ? 200 : resp.status).json({
      endpoint: CONFIG.customerApiUrl,
      ok: resp.ok,
      status: resp.status,
      data: json,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
