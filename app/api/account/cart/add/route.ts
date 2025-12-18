// app/api/cart/add/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return Response.json({ message: "Product ID required" }, { status: 400 });
    }

    const cookie = req.headers.get("cookie");

    
    const res = await fetch(
      `${process.env.WP_API_URL}/wp-json/wc/store/cart/add-item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookie ? { Cookie: cookie } : {}),
            Origin: process.env.WP_API_URL!,
            Referer: process.env.WP_API_URL!,
            "User-Agent": req.headers.get("user-agent") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          id: productId,
          quantity,
        }),
      }
    );
    console.log({body, cookie, env: process.env.WP_API_URL, res })

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const cart = await res.json();

    return Response.json(cart, { status: 200 });
  } catch (err: any) {
    return Response.json(
      { message: err.message || "Add to cart failed" },
      { status: 500 }
    );
  }
}
