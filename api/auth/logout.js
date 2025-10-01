import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  // limpa sessão local
  setCookie(res, "session", "", { maxAge: 0 });

  const { returnTo = "/" } = req.query || {};

  // Se quiser forçar logout OIDC na Shopify:
  // const params = new URLSearchParams({ post_logout_redirect_uri: `${CONFIG.appUrl}${returnTo}` });
  // return res.redirect(`${CONFIG.logoutUrl}?${params}`);

  res.status(302).setHeader("Location", returnTo);
  res.end();
}
