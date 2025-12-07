// app/api/account/payment-methods/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    const user = await wpGetUserByToken(token);

    // Placeholder: fetch saved payment methods from WooCommerce Stripe/Payments plugin
    // This depends on your payment gateway plugin (Stripe, PayPal, etc.)
    // For now, return empty array
    interface PaymentMethod {
        id: string;
        type: string;
        last4?: string;
        expiryMonth?: number;
        expiryYear?: number;
    }

    interface PaymentMethodsResponse {
        methods: PaymentMethod[];
    }

    const methods: PaymentMethod[] = [];

    return new Response(JSON.stringify({ methods }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}