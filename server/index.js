/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import crypto from 'node:crypto';
import cookieSession from 'cookie-session';

const {
  PORT = 3001,
  APP_ORIGINS = 'http://localhost:5173',
  SHOPIFY_CLIENT_ID,
  SHOPIFY_OAUTH_BASE_URL,
  SHOPIFY_SCOPES = 'openid email profile',
  SHOPIFY_REDIRECT_URI,
  SESSION_SECRET = 'dev-secret',
} = process.env;

if (!SHOPIFY_CLIENT_ID || !SHOPIFY_OAUTH_BASE_URL || !SHOPIFY_REDIRECT_URI) {
  console.error('❌ Verifique seu .env (CLIENT_ID, OAUTH_BASE_URL, REDIRECT_URI).');
  process.exit(1);
}

const BASE = SHOPIFY_OAUTH_BASE_URL.replace(/\/+$/, '');
const AUTHORIZE_URL = `${BASE}/oauth/authorize`;
const TOKEN_URL = `${BASE}/oauth/token`;
const LOGOUT_URL = `${BASE}/logout`;

// Helpers PKCE
const b64url = (buf) =>
  buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest();
const randomString = (len = 64) => b64url(crypto.randomBytes(len));

// App
const app = express();

const allowedOrigins = APP_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin não permitido: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: 'sid',
    secret: SESSION_SECRET,
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true em prod (HTTPS)
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Inicia OAuth (PKCE)
app.get('/api/auth/start', (req, res) => {
  const codeVerifier = randomString(32);
  const codeChallenge = b64url(sha256(Buffer.from(codeVerifier)));
  const state = randomString(16);
  const returnTo = req.query.returnTo || '/';

  req.session.codeVerifier = codeVerifier;
  req.session.oauthState = state;
  req.session.returnTo = returnTo;

  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set('client_id', SHOPIFY_CLIENT_ID);
  url.searchParams.set('scope', SHOPIFY_SCOPES);
  url.searchParams.set('redirect_uri', SHOPIFY_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);

  res.redirect(url.toString());
});

// Callback: troca code por tokens (sem client_secret — PKCE)
app.get('/api/auth/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  if (error) return res.status(400).send(`OAuth error: ${error_description || error}`);
  if (!code || !state) return res.status(400).send("Faltam 'code' ou 'state'.");

  if (!req.session.oauthState || state !== req.session.oauthState) {
    return res.status(400).send('State inválido (possível CSRF).');
  }
  const codeVerifier = req.session.codeVerifier;
  if (!codeVerifier) return res.status(400).send('code_verifier ausente na sessão.');

  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SHOPIFY_CLIENT_ID,
      redirect_uri: SHOPIFY_REDIRECT_URI,
      code: String(code),
      code_verifier: codeVerifier,
    });

    const tokenResp = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      console.error('Token exchange error:', tokenResp.status, text);
      return res.status(400).send('Falha ao obter tokens.');
    }

    const tokens = await tokenResp.json();
    req.session.tokens = {
      access_token: tokens.access_token,
      id_token: tokens.id_token || null,
      token_type: tokens.token_type,
      scope: tokens.scope,
      expires_in: tokens.expires_in,
      obtained_at: Date.now(),
    };

    const redirect = req.session.returnTo || '/';
    req.session.codeVerifier = undefined;
    req.session.oauthState = undefined;
    req.session.returnTo = undefined;

    res.redirect(redirect);
  } catch (e) {
    console.error('Callback error:', e);
    res.status(500).send('Erro ao finalizar login.');
  }
});

// Status para o front
app.get('/api/auth/status', (req, res) => {
  const hasToken = Boolean(req.session?.tokens?.access_token);
  const profile = req.session?.profile || null;
  res.json({ isAuthenticated: hasToken, profile });
});

// Logout local + remoto do Shopify (opcional)
app.get('/api/auth/logout', (req, res) => {
  const returnTo = req.query.returnTo || '/';
  const remote = `${LOGOUT_URL}?client_id=${encodeURIComponent(
    SHOPIFY_CLIENT_ID
  )}&return_to=${encodeURIComponent(returnTo)}`;

  req.session = null;
  // redireciona para o logout remoto (encerra sessão Shopify) e volta para returnTo
  res.redirect(remote);
});

app.listen(PORT, () => {
  console.log(`✅ Auth server (PKCE/ESM) em http://localhost:${PORT}`);
  console.log(`   AUTHORIZE_URL: ${AUTHORIZE_URL}`);
  console.log(`   TOKEN_URL:     ${TOKEN_URL}`);
});
