import cookie from "cookie";

export function setCookie(res, name, value, opts = {}) {
  const str = cookie.serialize(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    ...opts,
  });
  res.setHeader("Set-Cookie", str);
}

export function parseCookies(req) {
  return cookie.parse(req.headers.cookie || "");
}
