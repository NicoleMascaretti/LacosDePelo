export const CONFIG = {
  appUrl: process.env.APP_URL,
  shopDomain: process.env.SHOP_DOMAIN,
  clientId: process.env.SHOPIFY_CLIENT_ID,
  scopes: process.env.SHOPIFY_SCOPES || "openid email",

  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL,
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,

  // Opcional (fallback). Se não tiver, deixa em branco no Vercel.
  customerTokenUrl: process.env.SHOPIFY_CUSTOMER_TOKEN_URL || "",
  customerApiUrl: process.env.SHOPIFY_CUSTOMER_API_URL,
};
