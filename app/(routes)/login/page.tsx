"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [twoFAForm, setTwoFAForm] = useState({ code: "" });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || "Login failed");
        setLoading(false);
        return;
      }

      if (json.requires2FA) {
        // 2FA required: move to 2FA step
        setSessionId(json.sessionId);
        // Send OTP
        const otpRes = await fetch("/api/auth/send-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: json.sessionId }),
        });
        if (!otpRes.ok) {
          setError("Failed to send 2FA code");
          setLoading(false);
          return;
        }
        setStep("2fa");
        setError(null);
        setLoading(false);
        return;
      }

      // Success, cookie set by server
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function submit2FA(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code: twoFAForm.code }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json?.message || "Invalid code");
        setLoading(false);
        return;
      }
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "2FA verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "2fa") {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Enter 2FA Code</h1>
        <form onSubmit={submit2FA} className="space-y-4">
          <p className="text-sm text-gray-600">
            We sent a code to your email. Enter it below.
          </p>
          <input
            value={twoFAForm.code}
            onChange={(e) => setTwoFAForm({ ...twoFAForm, code: e.target.value })}
            placeholder="000000"
            maxLength={6}
            className="w-full p-3 border rounded text-center text-2xl tracking-widest"
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => setStep("login")}
            className="w-full text-sm text-gray-600 underline"
          >
            Back to login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={submitLogin} className="space-y-4">
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username or email"
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
        <button disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-4 text-sm space-y-2">
        <div>
          <a href="/signup" className="text-blue-600 underline">
            Create an account
          </a>
        </div>
        <div>
          <a href="/account/forgot-password" className="text-gray-600">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}