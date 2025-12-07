// app/api/auth/verify-2fa/route.ts
import { NextRequest } from "next/server";
import {
  wpVerify2FAOTP,
  get2FASession,
  clear2FASession,
  setTokenCookieResponse,
  wpGetUserByToken,
} from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, code } = await req.json();
    if (!sessionId || !code) {
      return new Response(JSON.stringify({ message: "Missing sessionId or code" }), {
        status: 400,
      });
    }

    const session = get2FASession(sessionId);
    if (!session) {
      return new Response(JSON.stringify({ message: "Invalid session" }), {
        status: 400,
      });
    }

    // Verify OTP with WP
    await wpVerify2FAOTP(session.email, code);

    // OTP valid: get user and set auth cookie
    const user = await wpGetUserByToken(session.token);
    clear2FASession(sessionId);

    return setTokenCookieResponse({ user }, session.token);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message || "Invalid OTP" }),
      { status: 401 }
    );
  }
}