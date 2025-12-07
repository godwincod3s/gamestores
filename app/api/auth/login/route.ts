// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import {
  wpLogin,
  wpGetUserByToken,
  wpCheck2FA,
  setTokenCookieResponse,
  create2FASession,
} from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ message: "Missing credentials" }), {
        status: 400,
      });
    }

    const tokenResp = await wpLogin(username, password);
    const token = tokenResp.token;
    const user = await wpGetUserByToken(token);

    // Check if 2FA is enabled
    const { twoFactorEnabled } = await wpCheck2FA(user.id, token);

    if (twoFactorEnabled) {
      // 2FA required: create pending session, send OTP, return session ID
      const sessionId = create2FASession(user.email, token);
      // OTP will be sent by calling /api/auth/send-2fa
      return new Response(
        JSON.stringify({
          requires2FA: true,
          sessionId,
          email: user.email,
        }),
        { status: 200 }
      );
    }

    // No 2FA: login successful, set cookie
    return setTokenCookieResponse({ user }, token);
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message || "Login failed" }), {
      status: 401,
    });
  }
}