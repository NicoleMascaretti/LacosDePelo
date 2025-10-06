// /api/auth/callback.js
import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";

function htmlDebug(title, obj) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:24px;max-width:900px;margin:0 auto;}pre{background:#f6f8fa;padding:16px;border-radius:8px;overflow:auto}</style>
</head><body>
<h1>${title}</h1>
<pre>${obj}</pre>
<p style="margin-top:24px">Verifique as variáveis:
<strong>APP_URL:</strong> ${CONFIG.appUrl}<br/>
<strong>TOKEN URL:</strong> ${CONFIG.tokenUrl}<br/>
<strong>AUTHORIZE URL:</strong> ${CONFIG.authorizeUrl}<br/>
<strong>CLIENT_ID:</strong> ${CONFIG.clientId}
</p>
</body></html>`;
}

export default async function handler(req, res) {
  const { code, state, debug } = req.query || {};
  const cookies = parseCookies(req);

  if (!code || !state || state !== cookies.oidc_state || !cookies.oidc_verifier) {
    const msg = `Invalid OAuth response. code=${!!code}, state_ok=${state === cookies.oidc_state}, has_verifier=${!!cookies.oidc_verifier}`;
    return debug ? res.status(400).send(htmlDebug("OAuth callback inválido", msg))
      : res.status(400).send(msg);
  }

  // (1) authorization_code -> id_token
  const oidcBody = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CONFIG.clientId,
    redirect_uri: `${CONFIG.appUrl}/api/auth/callback`,
    code,
    code_verifier: cookies.oidc_verifier,
  });

  const oidcResp = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: oidcBody,
  });
  const oidcText = await oidcResp.text();

  if (!oidcResp.ok) {
    const dump = `status=${oidcResp.status}\ncontent-type=${oidcResp.headers.get("content-type")}\n\n${oidcText}`;
    return debug ? res.status(500).send(htmlDebug("Falha ao trocar authorization_code por id_token", dump))
      : res.status(500).send(`Token exchange (authorization_code) failed:\n\n${dump}`);
  }

  let oidcJson;
  try { oidcJson = JSON.parse(oidcText); } catch {
    const dump = `Esperava JSON do token endpoint (authorization_code)\n\n${oidcText}`;
    return debug ? res.status(500).send(htmlDebug("JSON inválido no token endpoint", dump))
      : res.status(500).send(dump);
  }

  const idToken = oidcJson.id_token;
  if (!idToken) {
    const dump = JSON.stringify(oidcJson, null, 2);
    return debug ? res.status(500).send(htmlDebug("Resposta sem id_token", dump))
      : res.status(500).send(`No id_token in response:\n\n${dump}`);
  }

  // (2) id_token -> shcat_* (Customer Accounts)
  const baseExchange = {
    client_id: CONFIG.clientId,
    subject_token: idToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    audience: "customer_accounts", // <- importante
    requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
  };

  // Tentativa A: URN completo (padrão)
  let exParams = new URLSearchParams({
    ...baseExchange,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
  });

  let exResp = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: exParams,
  });

  let exText = await exResp.text();

  // Opcional: se o servidor reclamar do grant_type (unsupported_grant_type), tenta forma curta
  if (!exResp.ok && /unsupported_grant_type/i.test(exText || "")) {
    exParams = new URLSearchParams({
      ...baseExchange,
      grant_type: "token-exchange",
    });
    exResp = await fetch(CONFIG.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: exParams,
    });
    exText = await exResp.text();
  }

  // (Opcional) endpoint alternativo, se você configurou no Vercel
  if (!exResp.ok && CONFIG.customerTokenUrl) {
    exResp = await fetch(CONFIG.customerTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: exParams,
    });
    exText = await exResp.text();
  }

  if (!exResp.ok) {
    const dump = `url_usada=${CONFIG.tokenUrl}
status=${exResp.status}
content-type=${exResp.headers.get("content-type")}
body_inicio=${(exText || "").slice(0, 800)}`;
    return debug ? res.status(500).send(htmlDebug("Customer token exchange failed", dump))
      : res.status(500).send(`Customer token exchange failed:\n\n${dump}`);
  }

  let exJson;
  try { exJson = JSON.parse(exText); } catch {
    const dump = `Esperava JSON no customer token exchange\n\n${(exText || "").slice(0, 1200)}`;
    return debug ? res.status(500).send(htmlDebug("JSON inválido no customer token exchange", dump))
      : res.status(500).send(dump);
  }

  const customerAccessToken = exJson.access_token;
  if (!customerAccessToken || !customerAccessToken.startsWith("shcat_")) {
    const dump = JSON.stringify(exJson, null, 2);
    return debug ? res.status(500).send(htmlDebug("Customer token ausente/inválido", dump))
      : res.status(500).send(`Customer token missing/invalid:\n\n${dump}`);
  }

  // (3) cookies
  setCookie(res, "session", idToken, { maxAge: 60 * 60 });         // opcional
  setCookie(res, "customer_token", customerAccessToken, { maxAge: 60 * 60 }); // ESSENCIAL

  setCookie(res, "oidc_state", "", { maxAge: 0 });
  setCookie(res, "oidc_verifier", "", { maxAge: 0 });

  const returnTo = cookies.oidc_return || "/";
  setCookie(res, "oidc_return", "", { maxAge: 0 });

  res.status(302).setHeader("Location", returnTo);
  res.end();
}
