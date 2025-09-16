// src/lib/shopifyAccounts.ts
export const SHOP_DOMAIN = "https://lacosdepelo.myshopify.com"; // ex: https://lacosdepelo.myshopify.com ou domínio primário

export function accountLoginUrl(returnTo: string) {
  const ret = encodeURIComponent(returnTo || "/");
  return `${SHOP_DOMAIN}/account/login?return_url=${ret}`;
}

export function accountUrl() {
  return `${SHOP_DOMAIN}/account`;
}

export function accountLogoutUrl(returnTo = "/") {
  const ret = encodeURIComponent(returnTo);
  return `${SHOP_DOMAIN}/account/logout?return_url=${ret}`;
}
