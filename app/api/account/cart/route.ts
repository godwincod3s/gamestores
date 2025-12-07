// app/api/account/cart/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    // Optionally verify user:
    await wpGetUserByToken(token);

    // Placeholder: return empty cart. Replace with real WooCommerce/cart logic.
    const items: Array<{ id: string; name: string; qty: number; price?: string }> = [];

    return new Response(JSON.stringify({ items }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || "Failed to fetch cart" }), { status: 400 });
  }
}