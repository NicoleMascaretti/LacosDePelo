import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";
import { discoverOidc } from "../_lib/discovery.js";

export default async function handler(req, res) {
  const { code, state } = req.query || {};
  const cookies = parseCookies(req);

  if (!code || !state || state !== cookies.oidc_state || !cookies.oidc_verifier) {
    res.status(400).send("Invalid OAuth response.");
    return;
  }

  const oidc = await discoverOidc(CONFIG.shopDomain);
  const tokenEndpoint = oidc.token_endpoint || CONFIG.tokenUrl;

  // 1) Trocar code -> tokens (access_token + id_token)
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CONFIG.clientId,
    redirect_uri: `${CONFIG.appUrl}/api/auth/callback`,
    code,
    code_verifier: cookies.oidc_verifier,
  });

  const r = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await r.text();
  if (!r.ok) {
    res.status(500).send(`Token exchange failed:\n\nstatus=${r.status}\n${text}`);
    return;
  }

  let json;
  try { json = JSON.parse(text); } catch {
    res.status(500).send(`Invalid JSON from token endpoint:\n\n${text}`);
    return;
  }

  const accessToken = json.access_token;  // <- ESTE É O QUE VAMOS USAR NA CUSTOMER API
  const idToken = json.id_token;          // opcional (p/ logout / validação)

  if (!accessToken) {
    res.status(500).send(`No access_token in response:\n\n${JSON.stringify(json, null, 2)}`);
    return;
  }

  // guarda tokens em cookies httpOnly
  setCookie(res, "customer_token", accessToken, { maxAge: 60 * 60 });
  if (idToken) setCookie(res, "session", idToken, { maxAge: 60 * 60 });

  // limpa temporários
  setCookie(res, "oidc_state", "", { maxAge: 0 });
  setCookie(res, "oidc_verifier", "", { maxAge: 0 });
  setCookie(res, "oidc_nonce", "", { maxAge: 0 });

  const returnTo = cookies.oidc_return || "/";
  setCookie(res, "oidc_return", "", { maxAge: 0 });

  res.writeHead(302, { Location: returnTo });
  res.end();
}
