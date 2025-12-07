// app/api/account/wishlist/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    // Optionally verify user:
    await wpGetUserByToken(token);

    // Placeholder: return empty wishlist. Replace with real storage logic later.
    const items: Array<{ id: string; name: string; price?: string }> = [];

    return new Response(JSON.stringify({ items }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || "Failed to fetch wishlist" }), { status: 400 });
  }
}