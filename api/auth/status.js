import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const isAuthenticated = Boolean(cookies.session);
  res.status(200).json({ isAuthenticated });
}
