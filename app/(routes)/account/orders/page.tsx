// app/(routes)/account/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  currency: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/account/orders");
        if (!res.ok) {
          if (res.status === 401) router.push("/account/login");
          setError("Failed to load orders");
          return;
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Order #{order.number}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date_created).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {order.currency.toUpperCase()} {order.total}
                  </p>
                  <p className={`text-sm font-medium ${
                    order.status === "completed"
                      ? "text-green-600"
                      : order.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}