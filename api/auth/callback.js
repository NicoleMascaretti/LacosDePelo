import { CONFIG } from "../_lib/config.js";
import { parseCookies, setCookie } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const { code, state } = req.query || {};
  const cookies = parseCookies(req);

  if (!code || !state || state !== cookies.oidc_state || !cookies.oidc_verifier) {
    res.status(400).send("Invalid OAuth response.");
    return;
  }

  // 1) code -> OIDC tokens
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
    res
      .status(500)
      .send(`Token exchange (authorization_code) failed:\n\n${oidcText}`);
    return;
  }

  let oidcJson;
  try {
    oidcJson = JSON.parse(oidcText);
  } catch {
    res
      .status(500)
      .send(`Invalid JSON from token endpoint (authorization_code):\n\n${oidcText}`);
    return;
  }

  const idToken = oidcJson.id_token;
  if (!idToken) {
    res.status(500).send(`No id_token in response:\n\n${JSON.stringify(oidcJson, null, 2)}`);
    return;
  }

  // 2) id_token -> Customer API access token (shcat_...)
  // Tentativa A: no MESMO tokenUrl, com grant_type token-exchange e audience=customer_api
  const exchangeParams = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    client_id: CONFIG.clientId,
    subject_token: idToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    audience: "customer_api",
  });

  let exResp = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: exchangeParams,
  });

  let exText = await exResp.text();

  // Tentativa B (fallback): se falhar e houver customerTokenUrl configurado
  if (!exResp.ok && CONFIG.customerTokenUrl) {
    exResp = await fetch(CONFIG.customerTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: exchangeParams,
    });
    exText = await exResp.text();
  }

  if (!exResp.ok) {
    res
      .status(500)
      .send(`Customer token exchange failed:\n\n${exText}`);
    return;
  }

  let exJson;
  try {
    exJson = JSON.parse(exText);
  } catch {
    res
      .status(500)
      .send(`Invalid JSON from customer token exchange:\n\n${exText}`);
    return;
  }

  const customerAccessToken = exJson.access_token;
  if (!customerAccessToken || !customerAccessToken.startsWith("shcat_")) {
    res
      .status(500)
      .send(`Customer token missing/invalid:\n\n${JSON.stringify(exJson, null, 2)}`);
    return;
  }

  // 3) Guarda em cookies httpOnly
  setCookie(res, "session", idToken, { maxAge: 60 * 60 });         // opcional
  setCookie(res, "customer_token", customerAccessToken, { maxAge: 60 * 60 }); // ESSENCIAL

  // limpa temporários
  setCookie(res, "oidc_state", "", { maxAge: 0 });
  setCookie(res, "oidc_verifier", "", { maxAge: 0 });

  const returnTo = cookies.oidc_return || "/";
  setCookie(res, "oidc_return", "", { maxAge: 0 });

  res.status(302).setHeader("Location", returnTo);
  res.end();
}
