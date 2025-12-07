"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      setMessage(json.message || "Request sent");
    } catch (err: any) {
      setMessage(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {message ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">{message}</p>
          <a href="/account/login" className="text-blue-600 underline">
            Back to login
          </a>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            required
            className="w-full p-3 border rounded"
          />
          <button disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}