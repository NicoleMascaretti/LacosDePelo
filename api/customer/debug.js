import { CONFIG } from "../_lib/config.js";

export default async function handler(req, res) {
  const envRaw = process.env.SHOPIFY_CUSTOMER_API_URL || "(vazio)";
  const endpoint = CONFIG.customerApiUrl || "(CONFIG.customerApiUrl vazio)";

  // testa OPTIONS e POST vazio no endpoint que o código está usando
  const results = {};
  try {
    const r1 = await fetch(endpoint, { method: "OPTIONS" });
    results.options = { status: r1.status, ok: r1.ok };
  } catch (e) {
    results.options = { error: String(e) };
  }
  try {
    const r2 = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{__typename}" }),
    });
    const text = await r2.text();
    results.post = { status: r2.status, ok: r2.ok, snippet: text.slice(0, 200) };
  } catch (e) {
    results.post = { error: String(e) };
  }

  // Também testa explicitamente a URL versionada e a não versionada
  const versioned = "https://lacosdepelo.myshopify.com/customer/api/2025-07/graphql.json";
  const unversioned = "https://lacosdepelo.myshopify.com/customer/api/graphql";

  async function probe(url) {
    try {
      const r = await fetch(url, { method: "OPTIONS" });
      return { url, status: r.status, ok: r.ok };
    } catch (e) {
      return { url, error: String(e) };
    }
  }

  const probeVersioned = await probe(versioned);
  const probeUnversioned = await probe(unversioned);

  res.status(200).json({
    envRaw,
    endpointFromCONFIG: endpoint,
    probeVersioned,
    probeUnversioned,
    results,
  });
}
