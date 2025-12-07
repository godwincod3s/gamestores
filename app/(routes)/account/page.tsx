// app/(routes)/account/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar_urls?: { [key: string]: string };
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setUser(json.user);
        // Check 2FA status from user meta
        setTwoFactorEnabled(json.user.meta?._two_factor_enabled === "1" || false);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function toggleTwoFactor() {
    setToggleLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/2fa-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: !twoFactorEnabled }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${json.message}`);
        return;
      }
      setTwoFactorEnabled(json.twoFactorEnabled);
      setMessage(json.message);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setToggleLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Account Dashboard</h1>

      {/* User Info Card */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <p className="text-lg font-medium">{user.display_name || user.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <p className="text-lg font-medium">{user.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/account/account-details"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Details
          </a>
        </div>
      </div>

      {/* 2FA Card */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-4">
          Enhance your account security with 2FA. You'll be asked for a code via email when you log in.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-medium">
              Status: <span className={twoFactorEnabled ? "text-green-600" : "text-gray-500"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </p>
          </div>
          <button
            onClick={toggleTwoFactor}
            disabled={toggleLoading}
            className={`px-4 py-2 rounded text-white font-medium ${
              twoFactorEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {toggleLoading ? "Loading..." : twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
        {message && (
          <p className="mt-3 text-sm text-blue-600">{message}</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/account/orders"
          className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Orders</h3>
          <p className="text-gray-600">View and manage your orders</p>
        </a>
        <a
          href="/account/downloads"
          className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Downloads</h3>
          <p className="text-gray-600">Download purchased digital products</p>
        </a>
        <a
          href="/account/addresses"
          className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Addresses</h3>
          <p className="text-gray-600">Manage shipping and billing addresses</p>
        </a>
        <a
          href="/account/payment-methods"
          className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Payment Methods</h3>
          <p className="text-gray-600">Save and manage payment methods</p>
        </a>
      </div>
    </div>
  );
}