// /api/_lib/config.js
export const CONFIG = {
  appUrl: process.env.APP_URL,                      
  shopDomain: process.env.SHOP_DOMAIN,              
  clientId: process.env.SHOPIFY_CLIENT_ID,          
  scopes: process.env.SHOPIFY_SCOPES || "openid email customer-account-api:full",

  // Endpoints OIDC (copiados do .well-known/openid-configuration)
  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL,  
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,          
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,        

  // Customer Account API GraphQL do SEU shop:
  // se a env não existir, cai no fallback correto do seu domínio.
  customerApiUrl:
    process.env.SHOPIFY_CUSTOMER_API_URL ||
    `https://${process.env.SHOP_DOMAIN}/customer/api/graphql`,

  // Opcional (normalmente vazio):
  customerTokenUrl: process.env.SHOPIFY_CUSTOMER_TOKEN_URL || "",
};
