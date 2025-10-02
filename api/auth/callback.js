import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const { code, state } = req.query || {};
  const cookies = parseCookies(req);

  if (!code || !state || state !== cookies.oidc_state || !cookies.oidc_verifier) {
    res.status(400).send("Invalid OAuth response.");
    return;
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CONFIG.clientId,
    redirect_uri: `${CONFIG.appUrl}/api/auth/callback`,
    code,
    code_verifier: cookies.oidc_verifier,
  });

  const r = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!r.ok) {
    const text = await r.text();
    res.status(500).send(`Token exchange failed: ${text}`);
    return;
  }

  const tokens = await r.json();
  // tokens: { id_token, access_token, expires_in, ... }

  // Guarde ID token (se quiser) e — importante — o ACCESS TOKEN
  setCookie(res, "session", tokens.id_token ?? "", { maxAge: 60 * 60 });
  setCookie(res, "session_access", tokens.access_token ?? "", { maxAge: 60 * 60 });

  // Limpa temporários
  setCookie(res, "oidc_state", "", { maxAge: 0 });
  setCookie(res, "oidc_verifier", "", { maxAge: 0 });

  const returnTo = cookies.oidc_return || "/";
  setCookie(res, "oidc_return", "", { maxAge: 0 });

  res.status(302).setHeader("Location", returnTo);
  res.end();
}
