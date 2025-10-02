import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const { code, state } = req.query || {};
  const cookies = parseCookies(req);

  if (!code || !state || state !== cookies.oidc_state || !cookies.oidc_verifier) {
    res.status(400).send("Invalid OAuth response.");
    return;
  }

  // 1) Troca código -> OIDC tokens
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
  const idToken = tokens.id_token;
  if (!idToken) {
    res.status(500).send("Missing id_token from token response.");
    return;
  }

  // 2) Troca OIDC id_token -> Customer API access token (prefixo shcat_)
  const exBody = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: idToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    // opcional: "scope": "customer_read_orders"  (se precisar restringir)
  });

  const ex = await fetch(CONFIG.customerTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: exBody,
  });

  if (!ex.ok) {
    const text = await ex.text();
    res.status(500).send(`Customer token exchange failed: ${text}`);
    return;
  }

  const customerTokenJson = await ex.json();
  const customerAccessToken = customerTokenJson.access_token;
  if (!customerAccessToken || !customerAccessToken.startsWith("shcat_")) {
    res.status(500).send("Invalid customer access token returned.");
    return;
  }

  // 3) Guarda tokens em cookies httpOnly
  setCookie(res, "session", idToken, { maxAge: 60 * 60 }); // OIDC (se quiser manter)
  setCookie(res, "customer_token", customerAccessToken, { maxAge: 60 * 60 }); // **ESSENCIAL**

  // limpa cookies temporários
  setCookie(res, "oidc_state", "", { maxAge: 0 });
  setCookie(res, "oidc_verifier", "", { maxAge: 0 });

  const returnTo = cookies.oidc_return || "/";
  setCookie(res, "oidc_return", "", { maxAge: 0 });

  res.status(302).setHeader("Location", returnTo);
  res.end();
}
