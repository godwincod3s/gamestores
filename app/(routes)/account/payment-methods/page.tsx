// app/(routes)/account/payment-methods/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PaymentMethod = {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
};

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMethods() {
      try {
        const res = await fetch("/api/account/payment-methods");
        if (!res.ok) {
          if (res.status === 401) router.push("/account/login");
          setError("Failed to load payment methods");
          return;
        }
        const data = await res.json();
        setMethods(data.methods || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMethods();
  }, [router]);

  if (loading) return <div>Loading payment methods...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      {methods.length === 0 ? (
        <p className="text-gray-600">You haven't saved any payment methods.</p>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="bg-white border rounded-lg p-4">
              <p className="font-bold capitalize">{method.brand || method.type}</p>
              {method.last4 && <p className="text-sm text-gray-600">•••• {method.last4}</p>}
              <a href="#" className="mt-3 text-blue-600 text-sm">Delete</a>
            </div>
          ))}
        </div>
      )}
      <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Add Payment Method
      </button>
    </div>
  );
}