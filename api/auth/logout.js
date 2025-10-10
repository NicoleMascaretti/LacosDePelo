// /api/auth/logout.js
import { CONFIG } from "../_lib/config.js";
import { parseCookies } from "../_lib/cookies.js";
import { discoverOidc } from "../_lib/discovery.js";

function pushSetCookie(res, cookie) {
  const prev = res.getHeader("Set-Cookie");
  if (!prev) res.setHeader("Set-Cookie", [cookie]);
  else res.setHeader("Set-Cookie", Array.isArray(prev) ? [...prev, cookie] : [prev, cookie]);
}

function clear(res, name, req) {
  const host = (req?.headers?.host || "").split(":")[0]; // ex.: www.seusite.com.br
  const parts = host.split(".");
  const apex = parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : null; // ex.: .com.br OU .seusite.com.br (depende do TLD)
  const now = "Thu, 01 Jan 1970 00:00:00 GMT";
  const base = `; Expires=${now}; Max-Age=0; HttpOnly; SameSite=Lax`;
  const secure = host.startsWith("localhost") ? "" : "; Secure";

  // Sem Domain
  pushSetCookie(res, `${name}=; Path=/api${base}${secure}`);
  pushSetCookie(res, `${name}=; Path=/${base}${secure}`);

  // Com Domain = host atual
  if (host) {
    pushSetCookie(res, `${name}=; Domain=${host}; Path=/api${base}${secure}`);
    pushSetCookie(res, `${name}=; Domain=${host}; Path=/${base}${secure}`);
  }

  // Com Domain = raiz (apex), se der para inferir
  if (apex && apex.includes(".")) {
    pushSetCookie(res, `${name}=; Domain=${apex}; Path=/api${base}${secure}`);
    pushSetCookie(res, `${name}=; Domain=${apex}; Path=/${base}${secure}`);
  }
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
  clear(res, "session", req);
  clear(res, "customer_token", req);
  clear(res, "oidc_state", req);
  clear(res, "oidc_verifier", req);
  clear(res, "oidc_nonce", req);
  clear(res, "oidc_return", req);

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
