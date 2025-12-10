"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type CartItem = { productId: string | number; quantity: number; product?: any };

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [billing, setBilling] = useState<any>({ first_name: "", last_name: "", email: "", address_1: "", city: "", country: "NG", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    // check auth
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setUserChecked(true);
      }
    })();
  }, []);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/account/cart");
      if (res.ok) {
        const json = await res.json();
        setItems(json.items || []);
      } else {
        // try localStorage fallback
        const raw = localStorage.getItem("gs_cart");
        setItems(raw ? JSON.parse(raw) : []);
      }
    } catch {
      const raw = localStorage.getItem("gs_cart");
      setItems(raw ? JSON.parse(raw) : []);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(productId: any, qty: number) {
    if (qty < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/account/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (res.ok) {
        await fetchCart();
      } else {
        // fallback local
        const raw = localStorage.getItem("gs_cart");
        const local = raw ? JSON.parse(raw) : [];
        const item = local.find((i: any) => String(i.productId) === String(productId));
        if (item) item.quantity = qty;
        localStorage.setItem("gs_cart", JSON.stringify(local));
        setItems(local);
      }
    } catch {
      // local fallback
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: any) {
    setLoading(true);
    try {
      const res = await fetch("/api/account/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        await fetchCart();
      } else {
        const raw = localStorage.getItem("gs_cart");
        const local = raw ? JSON.parse(raw) : [];
        const filtered = local.filter((i: any) => String(i.productId) !== String(productId));
        localStorage.setItem("gs_cart", JSON.stringify(filtered));
        setItems(filtered);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  // compute approximate total by fetching product price fields if product details exist in item.product
  const subtotal = items.reduce((acc, it) => {
    const price = Number((it.product?.price ?? it.product?.regular_price ?? 0));
    return acc + (price || 0) * (it.quantity || 1);
  }, 0);

  async function placeOrder() {
    setError(null);
    setCheckoutLoading(true);

    // If guest and not authenticated, ensure billing fields are present
    if (!isAuthenticated) {
      if (!billing.email || !billing.first_name || !billing.address_1) {
        setError("Please provide name, email and shipping address for guest checkout.");
        setCheckoutLoading(false);
        return;
      }
    }

    try {
      // Build lines in the format expected by server checkout route
      const payload = {
        billing: {
          first_name: billing.first_name,
          last_name: billing.last_name,
          email: billing.email,
          address_1: billing.address_1,
          city: billing.city,
          country: billing.country,
          phone: billing.phone,
        },
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };

      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to initialize checkout");
        setCheckoutLoading(false);
        return;
      }

      // If Paystack init data returned, redirect to authorization_url
      if (data?.paystack?.authorization_url) {
        window.location.href = data.paystack.authorization_url;
        return;
      }

      // if paystack returned data.data.authorization_url (older / different key)
      if (data?.paystack?.authorization_url) {
        window.location.href = data.paystack.authorization_url;
        return;
      }

      // fallback: if server returned an order and no paystack, show success and redirect to account/orders
      if (data?.order) {
        router.push("/account/orders");
        return;
      }

      setError("Unexpected checkout response");
    } catch (err: any) {
      setError(err?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your cart</h1>

      {loading && <div>Loading...</div>}
      {!loading && items.length === 0 && <div>Your cart is empty.</div>}

      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={String(it.productId) + idx} className="flex items-start gap-4 border rounded-md p-4">
            <div className="w-24 h-24 bg-neutral-100 rounded-md overflow-hidden flex items-center justify-center">
              {it.product?.images?.[0]?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.product?.images?.[0]?.src} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-neutral-500">No image</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.product?.name ?? `Product ${it.productId}`}</div>
                  <div className="text-sm text-neutral-500">{it.product?.short_description ?? ""}</div>
                </div>

                <div className="text-lg font-bold">
                  {it.product?.price ?? it.product?.regular_price ?? "—"}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <label className="text-sm">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1"
                />
                <button onClick={() => removeItem(it.productId)} className="ml-4 text-sm text-red-600">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-lg">
          <div>Subtotal</div>
          <div className="text-2xl font-bold">₦{subtotal.toFixed(2)}</div>
        </div>

        <div className="w-full md:w-auto">
          {!isAuthenticated && userChecked && (
            <div className="mb-4 rounded-md border p-4">
              <div className="font-semibold mb-2">Guest information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>First name</Label>
                  <Input value={billing.first_name} onChange={(e) => setBilling({ ...billing, first_name: e.target.value })} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input value={billing.last_name} onChange={(e) => setBilling({ ...billing, last_name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input value={billing.address_1} onChange={(e) => setBilling({ ...billing, address_1: e.target.value })} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={billing.country} onChange={(e) => setBilling({ ...billing, country: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {error && <div className="mb-2 text-red-600">{error}</div>}

          <button
            onClick={placeOrder}
            disabled={checkoutLoading || items.length === 0}
            className={cn(
              "rounded-md px-6 py-3 bg-gradient-to-br from-black to-neutral-600 text-white font-semibold shadow-md",
              checkoutLoading ? "opacity-60 pointer-events-none" : ""
            )}
          >
            {checkoutLoading ? "Processing…" : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}