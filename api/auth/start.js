import { CONFIG } from "../_lib/config.js";
import { setCookie } from "../_lib/cookies.js";
import { createPkce, randomString } from "../_lib/pkce.js";

export default async function handler(req, res) {
  const { returnTo = "/", debug } = req.query || {};
  const { codeVerifier, codeChallenge } = createPkce();
  const state = randomString(16);

  // guarda state e code_verifier em cookie de curta duração
  setCookie(res, "oidc_state", state, { maxAge: 300 });
  setCookie(res, "oidc_verifier", codeVerifier, { maxAge: 300 });
  setCookie(res, "oidc_return", returnTo, { maxAge: 300 });
  // se você chamar /api/auth/start?debug=1, o callback entra em modo debug
  if (debug === "1") setCookie(res, "oidc_debug", "1", { maxAge: 300 });

  const params = new URLSearchParams({
    client_id: CONFIG.clientId,
    response_type: "code",
    scope: CONFIG.scopes,
    redirect_uri: `${CONFIG.appUrl}/api/auth/callback`,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });

  res.status(302).setHeader("Location", `${CONFIG.authorizeUrl}?${params.toString()}`);
  res.end();
}
