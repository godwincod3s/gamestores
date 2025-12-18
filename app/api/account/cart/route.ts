// app/api/account/cart/route.ts
import { NextRequest } from "next/server";
import { wpGetUserByToken } from "@/lib/wpAuth";

const WP_URL = process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_API_URL;
// const WP_URL = process.env.WP_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("wp_token")?.value;
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    // Optionally verify user:
    await wpGetUserByToken(token);
    // Placeholder: return empty cart. Replace with real WooCommerce/cart logic.
    const items: Array<{ id: string; name: string; qty: number; price?: string }> = [];

    // 
    const cookie = req.headers.get('cookie')
    console.log({cookie, token, url: `${WP_URL}/wp-json/wc/store/cart`})

    if (!cookie) {
      return Response.json({ items: items }, { status: 200 });
    }
 
    const res = await fetch(`${WP_URL}/wp-json/wc/store/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? {Cookie: cookie }: {})
      },
      credentials: 'include',
      cache: 'no-store'
    })
    console.log({res})

    if(!res.ok) {
      throw new Error("Failed to fetch cart");
    }

    const cart = await res.json();

    console.log({cart})

    return new Response(JSON.stringify({ cart }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || "Failed to fetch cart" }), { status: 400 });
  }
}

// {
//   cart: {
//     items: [],
//     coupons: [],
//     fees: [],
//     totals: {
//       total_items: '0',
//       total_items_tax: '0',
//       total_fees: '0',
//       total_fees_tax: '0',
//       total_discount: '0',
//       total_discount_tax: '0',
//       total_shipping: null,
//       total_shipping_tax: null,
//       total_price: '0',
//       total_tax: '0',
//       tax_lines: [],
//       currency_code: 'NGN',
//       currency_symbol: '₦',
//       currency_minor_unit: 2,
//       currency_decimal_separator: '.',
//       currency_thousand_separator: ',',
//       currency_prefix: '₦',
//       currency_suffix: ''
//     },
//     shipping_address: {
//       first_name: '',
//       last_name: '',
//       company: '',
//       address_1: '',
//       address_2: '',
//       city: '',
//       state: 'LA',
//       postcode: '',
//       country: 'NG',
//       phone: ''
//     },
//     billing_address: {
//       first_name: '',
//       last_name: '',
//       company: '',
//       address_1: '',
//       address_2: '',
//       city: '',
//       state: 'LA',
//       postcode: '',
//       country: 'NG',
//       email: '',
//       phone: ''
//     },
//     needs_payment: false,
//     needs_shipping: false,
//     payment_requirements: [ 'products' ],
//     has_calculated_shipping: false,
//     shipping_rates: [],
//     items_count: 0,
//     items_weight: 0,
//     cross_sells: [],
//     errors: [],
//     payment_methods: [ 'paystack', 'bacs' ],
//     extensions: {}
//   }
// }