"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  qty: number;
  price?: string;
};

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/account/cart");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/account/login");
            return;
          }
          setError(`Failed to load cart (${res.status})`);
          return;
        }
        const json = await res.json();
        if (mounted) setItems(json.items || []);
      } catch (err: any) {
        setError(err?.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      {items.length === 0 ? (
        <div>
          <p className="text-gray-600">Your cart is empty.</p>
          <a href="/products" className="text-blue-600 underline">Continue shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
              <div className="text-right">
                {item.price && <p className="font-medium">{item.price}</p>}
                <button className="mt-2 text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}