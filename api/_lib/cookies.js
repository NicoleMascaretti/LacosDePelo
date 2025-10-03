import cookie from "cookie";

/**
 * Adiciona cookies sem sobrescrever os anteriores.
 * Usa SameSite=Lax (adequado para OAuth com redirecionamento GET).
 */
export function setCookie(res, name, value, opts = {}) {
  const str = cookie.serialize(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    ...opts,
  });

  const prev = res.getHeader("Set-Cookie");
  let header = [];

  if (!prev) {
    header = [str];
  } else if (Array.isArray(prev)) {
    header = [...prev, str];
  } else {
    header = [prev.toString(), str];
  }

  res.setHeader("Set-Cookie", header);
}

export function parseCookies(req) {
  return cookie.parse(req.headers.cookie || "");
}
