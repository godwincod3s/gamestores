// components/AccountSidebar.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountSidebar() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          if (mounted) setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-600">You are not signed in.</p>
        <Link href="/account/login" className="mt-2 inline-block text-sm text-blue-600 underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <aside className="w-64 border-r pr-4">
      <div className="py-4">
        <div className="text-sm font-semibold">{user.name || user.username || user.nickname}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>

      <nav className="mt-6 space-y-2 text-sm">
        <Link href="/account/orders" className="block hover:text-blue-600">Orders</Link>
        <Link href="/account/downloads" className="block hover:text-blue-600">Downloads</Link>
        <Link href="/account/addresses" className="block hover:text-blue-600">Addresses</Link>
        <Link href="/account/payment-methods" className="block hover:text-blue-600">Payment Methods</Link>
        <Link href="/account/account-details" className="block hover:text-blue-600">Account Details</Link>
        <Link href="/account/lost-password" className="block hover:text-blue-600">Lost Password</Link>
        <Link href="/account/cart" className="block hover:text-blue-600">Cart</Link>
        <Link href="/account/wishlist" className="block hover:text-blue-600">wishlist</Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="mt-3 w-full text-left text-sm text-red-500"
        >
          Sign out
        </button>
      </nav>
    </aside>
  );
}