// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const WP_BASE = process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_API_URL;
const WC_BASE = process.env.WC_API_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ posts: [], products: [] });

    // WordPress posts
    const postsResp = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=6`);
    const posts = postsResp.ok ? await postsResp.json() : [];

    // WooCommerce products
    let products: any[] = [];
    if (WC_BASE && WC_KEY && WC_SECRET) {
      const wcUrl = `${WC_BASE}/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&per_page=8`;
      const wcResp = await fetch(wcUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`,
        },
      });
      products = wcResp.ok ? await wcResp.json() : [];
    }

    return NextResponse.json({ posts, products });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Search failed" }, { status: 500 });
  }
}