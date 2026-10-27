import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fetchJson } from "./http.mjs";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

function base64Url(value) {
  const input = typeof value === "string" ? Buffer.from(value) : value;
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseServiceAccount(raw) {
  const value = JSON.parse(raw);
  if (!value.client_email || !value.private_key) {
    throw new Error("Google service-account JSON must include client_email and private_key.");
  }
  return value;
}

export async function loadServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
    return parseServiceAccount(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"),
    );
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return parseServiceAccount(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
    return parseServiceAccount(await readFile(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"));
  }

  throw new Error(
    "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_B64, GOOGLE_SERVICE_ACCOUNT_JSON, or GOOGLE_SERVICE_ACCOUNT_FILE.",
  );
}

function buildJwt(serviceAccount, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: scopes.join(" "),
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64Url(signer.sign(serviceAccount.private_key));
  return `${unsigned}.${signature}`;
}

export async function getGoogleAccessToken(scopes) {
  const serviceAccount = await loadServiceAccount();
  const assertion = buildJwt(serviceAccount, scopes);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const result = await fetchJson(
    TOKEN_URL,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    },
    "Google OAuth token request",
  );

  if (!result.access_token) {
    throw new Error("Google OAuth response did not include an access token.");
  }

  return result.access_token;
}
