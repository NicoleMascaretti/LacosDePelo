export async function fetchAuthStatus() {
  const r = await fetch("/api/auth/status", { credentials: "include" });
  return r.json();
}
