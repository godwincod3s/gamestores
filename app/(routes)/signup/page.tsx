"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandDiscord,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import vars from "@/globalvars";
import { useRouter } from "next/navigation";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const { app_name } = vars;

export default function SignupFormDemo() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // loader steps are dynamic — we'll reuse for other flows (login, logout, place order, ...)
  const signupSteps = [
    { text: "Creating account…" },
    { text: "Finalizing profile…" },
    { text: "Almost done — preparing your account…" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side validation
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setLoaderStep(0);
    setFinished(false);

    try {
      // Step 0 -> creating account
      const payload = {
        username: email.split("@")[0],
        email,
        password,
        firstName,
        lastName,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || "Signup failed";
        setError(String(msg));
        // show loader error state
        setLoading(true);
        setFinished(false);
        setTimeout(() => {
          setLoading(false);
        }, 900);
        return;
      }

      // advance to "finalizing profile"
      setLoaderStep(1);

      // optional: perform additional server requests here that must complete before finalizing,
      // for demo we wait a bit to simulate follow-up calls (e.g., profile updates, welcome email)
      await new Promise((r) => setTimeout(r, 550));

      setLoaderStep(2);

      // small wait to let the user see final step then show success
      await new Promise((r) => setTimeout(r, 500));

      setFinished(true);
      setSuccess("Account created.");

      // after the loader's finish timeout, stop loading and redirect (onFinish handled in loader if you pass one)
      setTimeout(() => {
        setLoading(false);
        setFinished(false);
        router.push("/account");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setLoading(true);
      setFinished(false);
      // show error for a short while
      setTimeout(() => {
        setLoading(false);
      }, 900);
    }
  };

  return (
    <>
      {/* Controlled loader: `value` controls the current step, `finished` toggles success animation, `error` shows error */}
      <MultiStepLoader
        loadingStates={signupSteps}
        loading={loading}
        duration={900}
        loop={false}
        value={loaderStep}
        finished={finished}
        error={error}
      />

      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to {app_name}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Sign up to {app_name} — create an account to manage orders, downloads,
          and your profile.
        </p>
        <form className="my-8" onSubmit={handleSubmit} noValidate>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Godwin"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Ogbodo"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmpassword">Confirm password</Label>
            <Input
              id="confirmpassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </LabelInputContainer>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              aria-live="polite"
              className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <button
            className={cn(
              "group/btn relative block h-10 w-full mb-4 rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
              loading ? "opacity-70 pointer-events-none" : ""
            )}
            type="submit"
            aria-disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up →"}
            <BottomGradient />
          </button>
          <div>
            <a href="/login" className="text-blue-600 underline">
              already have an account
            </a>
          </div>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            {/* Social buttons kept in UI for future social signup integration. */}
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => {
                // placeholder: social signup flow (OAuth) should be implemented server-side.
              }}
              disabled={loading}
            >
              <IconBrandDiscord className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Sign up with Discord
              </span>
              <BottomGradient />
            </button>

            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => {
                // placeholder
              }}
              disabled={loading}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Sign up with Google
              </span>
              <BottomGradient />
            </button>

            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => {
                // placeholder
              }}
              disabled={loading}
            >
              <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Sign up with OnlyFans
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};