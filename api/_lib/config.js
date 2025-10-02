export const CONFIG = {
  appUrl: process.env.APP_URL, 
  shopDomain: process.env.SHOP_DOMAIN, 
  clientId: process.env.SHOPIFY_CLIENT_ID,
  // não use client_secret se seu app headless for "public" (PKCE)
  scopes: process.env.SHOPIFY_SCOPES || "openid email",
  // Endpoints Headless (copie da tela do app headless)
  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL, // https://shopify.com/authentication/xxx/oauth/authorize
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,         // https://shopify.com/authentication/xxx/oauth/token
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,       // https://shopify.com/authentication/xxx/logout
};
