// app/api/auth/2fa-toggle/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

const WP_API_URL = process.env.WP_API_URL;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    const user = await wpGetUserByToken(token);
    const { enable } = await req.json();

    if (typeof enable !== "boolean") {
      return new Response(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
      });
    }

    // Update user meta (adjust meta key based on your 2FA plugin)
    const updateRes = await fetch(
      `${WP_API_URL}/wp-json/wp/v2/users/${user.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            _two_factor_enabled: enable ? "1" : "0",
          },
        }),
      }
    );

    if (!updateRes.ok) {
      throw new Error("Failed to update 2FA setting");
    }

    return new Response(
      JSON.stringify({
        success: true,
        twoFactorEnabled: enable,
        message: enable
          ? "2FA enabled. Check your email for setup instructions."
          : "2FA disabled.",
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
    });
  }
}