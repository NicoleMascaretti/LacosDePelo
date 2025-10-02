export const CONFIG = {
  appUrl: process.env.APP_URL,                 
  shopDomain: process.env.SHOP_DOMAIN,         
  clientId: process.env.SHOPIFY_CLIENT_ID,
  scopes: process.env.SHOPIFY_SCOPES || "openid email",
  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL,
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,

  // Customer Account API GraphQL
  customerApiUrl:
    `https://shopify.com/api/customer/${process.env.SHOPIFY_API_VERSION || "2025-07"}/graphql.json`,
};
