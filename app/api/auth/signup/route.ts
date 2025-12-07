// app/api/auth/signup/route.ts
import { NextRequest } from "next/server";
import { wpSignup, wpLogin, wpGetUserByToken, setTokenCookieResponse } from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, displayName } = await req.json();
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    // Register user via GraphQL (WP sends verification email automatically)
    const newUser = await wpSignup(username, email, password, displayName);

    // Auto-login (optional: you can require email verification first)
    try {
      const tokenResp = await wpLogin(username, password);
      const token = tokenResp.token;
      const user = await wpGetUserByToken(token);

      // Return with note that email verification is pending
      return setTokenCookieResponse(
        {
          user,
          message: "Account created. Please verify your email.",
        },
        token
      );
    } catch {
      // If auto-login fails, return success and ask user to check email + login manually
      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created. Check your email to verify and log in.",
        }),
        { status: 200 }
      );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message || "Signup failed" }), {
      status: 400,
    });
  }
}