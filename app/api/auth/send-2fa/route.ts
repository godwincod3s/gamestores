// app/api/auth/send-2fa/route.ts
import { NextRequest } from "next/server";
import { wpSend2FAOTP, get2FASession } from "@/lib/wpAuth";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ message: "Missing sessionId" }), {
        status: 400,
      });
    }

    const session = get2FASession(sessionId);
    if (!session) {
      return new Response(JSON.stringify({ message: "Invalid session" }), {
        status: 400,
      });
    }

    // Send OTP email
    await wpSend2FAOTP(session.email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: err.message || "Failed to send OTP" }),
      { status: 400 }
    );
  }
}