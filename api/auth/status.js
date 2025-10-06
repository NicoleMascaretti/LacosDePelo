import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const { customer_token } = parseCookies(req);
  res.json({ isAuthenticated: Boolean(customer_token) });
}
