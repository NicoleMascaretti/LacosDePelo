// api/customer/orders.js
export default async function handler(req, res) {
  try {
    // O cookie "session" foi definido no seu /api/auth/callback como o ID Token (JWT)
    const idToken = req.cookies?.session;
    if (!idToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // URL da Customer Account API (pegue o número do seu “store id” que aparece nos endpoints do app headless)
    // Exemplo do seu print: .../authentication/58148683873/...
    // Versão pode ser 2024-07 ou a mais recente disponível nas suas configs
    const customerApiUrl = process.env.CUSTOMER_API_GRAPHQL_URL;
    // ex.: https://shopify.com/58148683873/account/customer/api/2024-07/graphql.json

    const query = `
      query CustomerOrders($first: Int = 20) {
        customer {
          id
          email
          orders(first: $first, reverse: true) {
            nodes {
              id
              name
              number
              processedAt
              financialStatus
              fulfillmentStatus
              statusUrl
              totalPriceSet {
                shopMoney { amount currencyCode }
              }
              lineItems(first: 10) {
                nodes {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    `;

    const r = await fetch(customerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // AQUI é onde a Customer Account API autentica: bearer com o ID token (JWT)
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ query, variables: { first: 20 } }),
    });

    const json = await r.json();
    if (!r.ok || json.errors) {
      return res.status(500).json({
        error: "Customer API error",
        details: json.errors || json,
      });
    }

    const orders = json?.data?.customer?.orders?.nodes || [];
    return res.status(200).json({ orders });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unexpected error" });
  }
}
