// app/api/auth/me/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const user = await wpGetUserByToken(token);

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || "Invalid token" }), { status: 401 });
  }
}