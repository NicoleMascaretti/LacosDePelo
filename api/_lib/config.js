export const CONFIG = {
  appUrl: process.env.APP_URL,
  shopDomain: process.env.SHOP_DOMAIN,
  clientId: process.env.SHOPIFY_CLIENT_ID,
  scopes: process.env.SHOPIFY_SCOPES || "openid email customer-account-api:full",

  authorizeUrl: process.env.SHOPIFY_AUTHORIZE_URL,
  tokenUrl: process.env.SHOPIFY_TOKEN_URL,
  logoutUrl: process.env.SHOPIFY_LOGOUT_URL,

  // use SEMPRE o do seu domínio .myshopify.com
  customerApiUrl:
    process.env.SHOPIFY_CUSTOMER_API_URL ||
    `https://${process.env.SHOP_DOMAIN}/customer/api/graphql`,

  customerTokenUrl: process.env.SHOPIFY_CUSTOMER_TOKEN_URL || "",
};
