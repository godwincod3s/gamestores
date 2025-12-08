"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function AccountAvatar({
  name,
  email,
  avatar,
}: {
  name?: string;
  email?: string;
  avatar: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Image
          src={avatar}
          alt={name || "Account"}
          width={100}
          height={100}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-xs text-gray-500 truncate">{email}</span>
        </div>
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-48 rounded-md bg-white dark:bg-neutral-900 border shadow-lg z-50">
          <div className="p-3">
            <div className="text-sm font-semibold truncate">{name}</div>
            <div className="text-xs text-gray-500 truncate">{email}</div>
          </div>
          <div className="border-t" />
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}