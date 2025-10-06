// /api/_lib/discovery.js
export async function discoverOidc(shopDomain) {
  const url = `https://${shopDomain}/.well-known/openid-configuration`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`OIDC discovery failed: ${r.status}`);
  return r.json();
}

export async function discoverCustomerApi(shopDomain) {
  const url = `https://${shopDomain}/.well-known/customer-account-api`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Customer API discovery failed: ${r.status}`);
  return r.json(); // { graphql_api, mcp_api }
}
