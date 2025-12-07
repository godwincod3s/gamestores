// lib/wpAuth.ts
import { NextResponse } from "next/server";

const WP_API_URL = (process.env.WP_API_URL ?? "").replace(/\/$/, "");
const WP_GRAPHQL = process.env.WP_GRAPHQL_ENDPOINT ?? `${WP_API_URL}/graphql`;
const JWT_PATH = process.env.WP_JWT_PATH ?? "/wp-json/jwt-auth/v1/token";

export type WPUser = {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar_urls?: { [key: string]: string };
  // add custom fields if available (e.g., verified_email, two_factor_enabled)
};

// ===== LOGIN (REST JWT) =====
// export async function wpLogin(username: string, password: string) {
//   const url = `${WP_API_URL}${JWT_PATH}`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });
//   console.log({res, username, password})
//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.message || "Login failed");
//   return data; // { token, user_email, ... }
// }
// lib/wpAuth.ts - improved wpLogin
export async function wpLogin(username: string, password: string) {
  const url = `${WP_API_URL}${JWT_PATH}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  // Read raw response text so we capture non-JSON responses too
  const raw = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || data?.error || raw || `WP login failed (${res.status})`;
    const err: any = new Error(message);
    err.status = res.status;
    err.body = data ?? raw;
    // log here for server-side visibility
    console.error("wpLogin error:", { url, status: res.status, body: err.body });
    throw err;
  }

  return data; // expected { token, user_email, ... }
}

// ===== GET USER BY TOKEN =====
export async function wpGetUserByToken(token: string) {
  const url = `${WP_API_URL}/wp-json/wp/v2/users/me`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Invalid token");
  }
  return res.json() as Promise<WPUser>;
}

// ===== SIGNUP (GraphQL) =====
// export async function wpSignup(
//   username: string,
//   email: string,
//   password: string,
//   displayName?: string
// ) {
//   const mutation = `
//     mutation RegisterUser($input: RegisterInput!) {
//       registerUser(input: $input) {
//         user {
//           id
//           username
//           email
//           displayName
//         }
//       }
//     }
//   `;

//   const res = await fetch(WP_GRAPHQL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       query: mutation,
//       variables: {
//         input: {
//           username,
//           email,
//           password,
//           displayName: displayName || username,
//         },
//       },
//     }),
//   });

//   const json = await res.json();
//   if (json.errors) {
//     throw new Error(json.errors[0]?.message || "Registration failed");
//   }
//   if (!json.data?.registerUser?.user) {
//     throw new Error("Registration failed");
//   }
//   return json.data.registerUser.user;
// }
// ===== SIGNUP (GraphQL) =====
export async function wpSignup(
  username: string,
  email: string,
  password: string,
  displayName?: string
) {
  const mutation = `
    mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) {
        user {
          id
          username
          email
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          username,
          email,
          password,
          displayName: displayName || username,
        },
      },
    }),
  });

  const json = await res.json();
  
  // Log errors for debugging
  if (json.errors) {
    console.error("wpSignup GraphQL error:", json.errors);
    throw new Error(json.errors[0]?.message || "Registration failed");
  }
  
  if (!json.data?.registerUser?.user) {
    console.error("wpSignup: no user in response", json.data);
    throw new Error("Registration failed – user not created");
  }
  
  return json.data.registerUser.user;
}

// ===== CHECK 2FA STATUS =====
// Call this after login to see if user has 2FA enabled.
// Adjust based on your 2FA plugin's meta keys (common: _two_factor_enabled, _2fa_enabled, etc.)
export async function wpCheck2FA(userId: string, token: string) {
  const url = `${WP_API_URL}/wp-json/wp/v2/users/${userId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Cannot fetch user");
  const user = await res.json();
  // Example: check if 2FA is enabled (adjust key based on your plugin)
  const twoFactorEnabled =
    user.acf?.two_factor_enabled ||
    user.meta?._two_factor_enabled ||
    false;
  return { user, twoFactorEnabled };
}

// ===== SEND 2FA OTP =====
// Call your 2FA plugin endpoint or custom WP action.
// Example: assumes a custom endpoint or WP 2FA plugin REST endpoint.
export async function wpSend2FAOTP(email: string) {
  // Option A: Call a custom WP REST endpoint you create with wp_mail()
  const url = `${WP_API_URL}/wp-json/gamestores/v1/send-2fa-otp`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to send 2FA code");
  return res.json(); // { success: true, message: "OTP sent" }
}

// ===== VERIFY 2FA OTP =====
export async function wpVerify2FAOTP(email: string, code: string) {
  const url = `${WP_API_URL}/wp-json/gamestores/v1/verify-2fa-otp`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) throw new Error("Invalid OTP");
  return res.json(); // { success: true }
}

// ===== FORGOT PASSWORD =====
export async function wpRequestPasswordReset(email: string) {
  // WordPress built-in or plugin endpoint
  const url = `${WP_API_URL}/wp-json/wp/v2/users/retrieve-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_login: email }),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json(); // should return { success: true } or similar
}

// ===== VERIFY EMAIL (if not auto on signup) =====
// Some WP setups require explicit verification; others auto-verify.
export async function wpVerifyEmail(userId: string, verificationToken: string) {
  // Custom endpoint on your WP server
  const url = `${WP_API_URL}/wp-json/gamestores/v1/verify-email`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, verificationToken }),
  });
  if (!res.ok) throw new Error("Email verification failed");
  return res.json();
}

// ===== COOKIE HELPERS =====
export function setTokenCookieResponse(
  payload: any,
  token: string,
  maxAge = 60 * 60 * 24 * 7
) {
  const res = NextResponse.json(payload);
  res.cookies.set({
    name: "wp_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}

export function clearTokenCookieResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "wp_token",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

// Optional: store pending 2FA session temporarily (in memory or Redis)
// For demo, we'll use a simple in-memory store. In production, use Redis or DB.
const pending2FASessions = new Map<
  string,
  { email: string; token: string; createdAt: number }
>();

export function create2FASession(email: string, token: string) {
  const sessionId = Math.random().toString(36).slice(2);
  pending2FASessions.set(sessionId, {
    email,
    token,
    createdAt: Date.now(),
  });
  // Auto-expire in 10 minutes
  setTimeout(() => pending2FASessions.delete(sessionId), 10 * 60 * 1000);
  return sessionId;
}

export function get2FASession(sessionId: string) {
  return pending2FASessions.get(sessionId);
}

export function clear2FASession(sessionId: string) {
  pending2FASessions.delete(sessionId);
}