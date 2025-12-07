// app/api/account/downloads/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

const WC_API_URL = process.env.WC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    const user = await wpGetUserByToken(token);

    const wcAuth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");

    // Fetch customer downloads from WooCommerce
    const url = `${WC_API_URL}/wp-json/wc/v3/customers/${user.id}/downloads`;
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${wcAuth}` },
    });

    if (!res.ok) throw new Error("Failed to fetch downloads");
    const downloads = await res.json();

    return new Response(JSON.stringify({ downloads }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}