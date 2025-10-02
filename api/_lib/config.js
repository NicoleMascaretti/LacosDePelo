export const CONFIG = {
  appUrl: process.env.APP_URL,
  shopDomain: process.env.SHOP_DOMAIN,
  clientId: process.env.SHOPIFY_CLIENT_ID,

  // Escopos OIDC + (opcional) escopos do Customer API que você selecionou no painel
  scopes: process.env.SHOPIFY_SCOPES || "openid email",

  // Endpoints Headless
  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL,
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,

  // NOVOS:
  customerTokenUrl: process.env.SHOPIFY_CUSTOMER_TOKEN_URL, // .../customer_access_token
  customerApiUrl: process.env.SHOPIFY_CUSTOMER_API_URL,     // .../api/customer/.../graphql.json
};
