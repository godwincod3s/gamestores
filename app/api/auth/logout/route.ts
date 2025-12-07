// app/api/auth/logout/route.ts
import { NextRequest } from "next/server";
import { clearTokenCookieResponse, wpGetUserByToken } from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    // Optionally verify existing token before clearing (not required)
    const token = req.cookies.get("wp_token")?.value;
    if (token) {
      try {
        await wpGetUserByToken(token); // ignore result, just check validity
      } catch {
        // token invalid/expired - still proceed to clear cookie
      }
    }

    return clearTokenCookieResponse();
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || "Logout failed" }), { status: 400 });
  }
}