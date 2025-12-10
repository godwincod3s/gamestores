// app/api/cart/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side checkout:
 * - Expects body: { billing: {...}, items?: [{productId, quantity}] }
 * - If items not provided, read from cookie 'gs_cart'
 * - Creates a WooCommerce order via REST and returns paystack payment URL after initializing a transaction
 *
 * Required env:
 * - WC_API_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET
 * - PAYSTACK_SECRET, PAYSTACK_CALLBACK_URL
 */

const WC_BASE = process.env.WC_API_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL;

function readCartFromCookie(req: NextRequest) {
  const raw = req.cookies.get("gs_cart")?.value;
  if (!raw) return [];
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return [];
  }
}

async function wcCreateOrder(orderBody: any) {
  const url = `${WC_BASE}/wp-json/wc/v3/orders`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify(orderBody),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`WooCommerce order failed: ${txt}`);
  }
  return resp.json();
}

async function wcGetProduct(productId: number | string) {
  const url = `${WC_BASE}/wp-json/wc/v3/products/${productId}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`,
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch product " + productId);
  }
  return resp.json();
}

async function initPaystack(email: string, amountNaira: number) {
  // Paystack expects amount in kobo (NGN * 100)
  const amountKobo = Math.round(amountNaira * 100);

  const resp = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      callback_url: PAYSTACK_CALLBACK_URL,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("Paystack init failed: " + txt);
  }
  return resp.json();
}

export async function POST(req: NextRequest) {
  try {
    if (!WC_BASE || !WC_KEY || !WC_SECRET) {
      return NextResponse.json({ message: "WooCommerce credentials missing" }, { status: 500 });
    }
    if (!PAYSTACK_SECRET || !PAYSTACK_CALLBACK_URL) {
      return NextResponse.json({ message: "Paystack credentials missing" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const billing = body.billing;
    let items = body.items ?? readCartFromCookie(req);

    if (!billing || !billing.email) {
      return NextResponse.json({ message: "Billing email required" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Build line_items for WC order. We fetch up-to-date product prices.
    const line_items: any[] = [];
    let total = 0;

    for (const it of items) {
      const productId = it.productId;
      const quantity = Number(it.quantity || 1);

      // fetch product to get price
      const p = await wcGetProduct(productId);
      // attempt to parse price
      const price = parseFloat(p.price ?? p.regular_price ?? 0) || 0;
      total += price * quantity;

      line_items.push({
        product_id: Number(productId),
        quantity,
      });
    }

    const orderPayload = {
      payment_method: "paystack",
      payment_method_title: "Paystack",
      set_paid: false,
      billing,
      shipping: billing,
      line_items,
    };

    const order = await wcCreateOrder(orderPayload);

    // Initialize Paystack transaction for `total`
    const paystack = await initPaystack(billing.email, total);

    // Return paystack auth url + order id
    return NextResponse.json({
      order,
      paystack: paystack.data,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Checkout failed" }, { status: 500 });
  }
}