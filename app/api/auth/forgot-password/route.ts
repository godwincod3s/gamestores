// app/api/auth/forgot-password/route.ts
import { NextRequest } from "next/server";
import { wpRequestPasswordReset } from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ message: "Missing email" }), {
        status: 400,
      });
    }

    await wpRequestPasswordReset(email);

    // Return success (don't reveal if email exists for security)
    return new Response(
      JSON.stringify({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      }),
      { status: 200 }
    );
  }
}