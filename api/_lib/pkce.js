import crypto from "crypto";

export function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function base64UrlEncode(buffer) {
  return buffer.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function sha256(str) {
  return crypto.createHash("sha256").update(str).digest();
}

export function createPkce() {
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32));
  const codeChallenge = base64UrlEncode(sha256(codeVerifier));
  return { codeVerifier, codeChallenge };
}
