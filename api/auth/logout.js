// /api/auth/logout.js
import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";
import { discoverOidc } from "../_lib/discovery.js";

function pushSetCookie(res, cookie) {
  const prev = res.getHeader("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", [cookie]);
  } else {
    res.setHeader("Set-Cookie", Array.isArray(prev) ? [...prev, cookie] : [prev, cookie]);
  }
}

function clear(res, name) {
  // Path raiz
  pushSetCookie(res, `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  // Path /api (se algum cookie foi setado lá)
  pushSetCookie(res, `${name}=; Path=/api; Max-Age=0; HttpOnly; SameSite=Lax`);
}

function isLikelyJwt(token) {
  // formato "x.y.z"
  return typeof token === "string" && token.split(".").length === 3;
}

export default async function handler(req, res) {
  const { returnTo = "/" } = req.query || {};
  const cookies = parseCookies(req);

  // 1) Limpa cookies locais (sessão, token de cliente etc.)
  // ajuste os nomes conforme você usa no projeto
  clear(res, "session");          // id_token armazenado
  clear(res, "customer_token");   // shcat_...
  clear(res, "oidc_state");
  clear(res, "oidc_verifier");
  clear(res, "oidc_nonce");
  clear(res, "oidc_return");

  // 2) Descobre o endpoint de logout do OIDC (quando existir)
  let endSessionEndpoint = null;
  try {
    const oidc = await discoverOidc(CONFIG.shopDomain);
    endSessionEndpoint = oidc.end_session_endpoint || CONFIG.logoutUrl || null;
  } catch {
    // se discovery falhar, apenas segue com redirect local
  }

  // 3) Monta URL de logout do provedor (se tiver)
  // OBS: id_token_hint é OPCIONAL. Só mande se parecer um JWT válido
  if (endSessionEndpoint) {
    const params = new URLSearchParams({
      post_logout_redirect_uri: `${CONFIG.appUrl}${returnTo.startsWith("/") ? returnTo : `/${returnTo}`}`,
    });

    const idToken = cookies.session;
    if (isLikelyJwt(idToken)) {
      params.set("id_token_hint", idToken);
    }
    const url = `${endSessionEndpoint}?${params.toString()}`;

    res.writeHead(302, { Location: url });
    res.end();
    return;
  }

  // 4) Sem endpoint de logout remoto → só volta para a home (ou returnTo) já deslogado localmente
  res.writeHead(302, {
    Location: `${returnTo.startsWith("/") ? returnTo : `/${returnTo}`}`,
  });
  res.end();
}
