import { CONFIG } from "../_lib/config.js";

export default async function handler(req, res) {
  const { returnTo = "/" } = req.query;

  // 1) Limpa cookies locais (atenção a path, domain, SameSite / Secure)
  const cookieOpts = "Path=/; HttpOnly; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  res.setHeader("Set-Cookie", [
    `session=; ${cookieOpts}`,
    `customer_token=; ${cookieOpts}`,
    `customer_refresh_token=; ${cookieOpts}`,
  ]);

  // 2) Se pediram upstream=1, também encerre a sessão no IdP da Shopify
  if (req.query.upstream === "1") {
    const back = encodeURIComponent(`${CONFIG.appUrl}${returnTo}`);
    const url = `${CONFIG.logoutUrl}?return_to=${back}`;
    res.writeHead(302, { Location: url });
    res.end();
    return;
  }

  // fallback: só volta pro site
  res.writeHead(302, { Location: returnTo });
  res.end();
}
