import { CONFIG } from "../_lib/config.js";
import { setCookie } from "../_lib/cookies.js";
import { createPkce, randomString } from "../_lib/pkce.js";
import { discoverOidc } from "../_lib/discovery.js";

export default async function handler(req, res) {
  const { returnTo = "/" } = req.query || {};
  const { codeVerifier, codeChallenge } = createPkce();
  const state = randomString(16);
  const nonce = randomString(16);

  // cookies temporários
  setCookie(res, "oidc_state", state, { maxAge: 300 });
  setCookie(res, "oidc_verifier", codeVerifier, { maxAge: 300 });
  setCookie(res, "oidc_nonce", nonce, { maxAge: 300 });
  setCookie(res, "oidc_return", returnTo, { maxAge: 300 });

  // discovery
  const oidc = await discoverOidc(CONFIG.shopDomain);
  const authorizeEndpoint = oidc.authorization_endpoint || CONFIG.authorizeUrl;

  const params = new URLSearchParams({
    client_id: CONFIG.clientId,
    response_type: "code",
    scope: CONFIG.scopes,
    redirect_uri: `${CONFIG.appUrl}/api/auth/callback`,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    nonce,
  });

  res.writeHead(302, { Location: `${authorizeEndpoint}?${params}` });
  res.end();
}
