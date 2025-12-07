"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Auto-redirect to account after 2 seconds or let user click link
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Account Created!</h1>
        <p className="text-gray-600 mb-4">
          Check your email to verify your account, then log in.
        </p>
        <a href="/login" className="text-blue-600 underline">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          placeholder="Full name"
          className="w-full p-3 border rounded"
        />
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="w-full p-3 border rounded"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
          className="w-full p-3 border rounded"
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          type="password"
          className="w-full p-3 border rounded"
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button disabled={loading} className="w-full p-3 bg-green-600 text-white rounded">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}