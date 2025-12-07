// app/(routes)/account/addresses/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Address = {
  id: string;
  type: "shipping" | "billing";
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  country: string;
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/account/addresses");
        if (!res.ok) {
          if (res.status === 401) router.push("/account/login");
          setError("Failed to load addresses");
          return;
        }
        const data = await res.json();
        setAddresses(data.addresses || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, [router]);

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <p className="text-gray-600">You haven't added any addresses yet.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="bg-white border rounded-lg p-4">
              <p className="font-bold mb-2 capitalize">{addr.type} Address</p>
              <p>{addr.first_name} {addr.last_name}</p>
              <p className="text-sm text-gray-600">{addr.address_1}</p>
              {addr.address_2 && <p className="text-sm text-gray-600">{addr.address_2}</p>}
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.postcode}, {addr.country}
              </p>
              <a href="#" className="mt-3 text-blue-600 text-sm">Edit</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}