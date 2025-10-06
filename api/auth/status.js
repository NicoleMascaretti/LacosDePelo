import { parseCookies } from "../_lib/cookies.js";

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const id = cookies.session || "";
  const cat = cookies.customer_token || "";

  res.status(200).json({
    isAuthenticated: Boolean(id),
    hasCustomerToken: Boolean(cat && cat.startsWith("shcat_")),
    customerTokenPreview: cat ? `${cat.slice(0, 6)}…${cat.slice(-6)}` : null,
  });
}
