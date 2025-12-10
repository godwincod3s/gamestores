"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import vars from "@/globalvars";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Image from "next/image"

const { name: siteName } = vars

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ posts: any[]; products: any[] }>({ posts: [], products: [] });

  const placeholders = [
      "xbox games",
      "play station",
      "steam deck",
      "ghost of tushima",
      "best games",
    ];

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults({ posts: [], products: [] });
    }
  }, [open]);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults({ posts: [], products: [] });
      return;
    }
    const t = setTimeout(() => doSearch(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  async function doSearch(term: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) {
        setResults({ posts: [], products: [] });
        return;
      }
      const json = await res.json();
      setResults({ posts: json.posts || [], products: json.products || [] });
    } catch {
      setResults({ posts: [], products: [] });
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("submitted");
    };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 p-6 h-screen flex flex-col justify-center  items-center px-4"
        >
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
            <div className="text-right cursor-pointer">
              <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border-b dark:border-neutral-800">

              {/* <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
                <IconSearch className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
              </div>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, posts, categories..."
                className="flex-1 bg-transparent outline-none px-3 py-2 text-lg"
              /> */}
              <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
                Find Anything on <span className="capitalize">{siteName}</span>
              </h2>
              <PlaceholdersAndVanishInput
                // value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholders={placeholders}
                onSubmit={onSubmit}
              />

              
            </div>

            <div className="p-4">
              {loading && <div className="text-sm text-neutral-500">Searching…</div>}

              {!loading && results.products.length === 0 && results.posts.length === 0 && q.length >= 2 && (
                <div className="text-sm text-neutral-500">No results</div>
              )}

              {!loading && results.products.length > 0 && (
                <>
                  <div className="text-sm font-semibold mb-2">Products</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.products.map((p: any) => (
                      <a key={p.id} href={`/product/${p.id}`} className="flex items-center gap-3 p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800">
                        <div className="w-14 h-14 bg-neutral-100 rounded overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {p.images?.[0]?.src ? <Image src={p.images[0].src} width={100} height={100} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-xs text-neutral-400">No image</div>}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-neutral-500">{p.price ?? "—"}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {!loading && results.posts.length > 0 && (
                <>
                  <div className="mt-4 text-sm font-semibold mb-2">Posts</div>
                  <div className="grid grid-cols-1 gap-2">
                    {results.posts.map((post: any) => {
                      // console.log({post})
                      return (
                      <a key={post.id} href={`/blog/${post.slug}`} className="block p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800">
                        <div className="font-medium">{post.title.rendered ?? post.title}</div>
                        <div className="text-xs text-neutral-500">{(post.excerpt && post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 100)) || ""}</div>
                      </a>
                    )} )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}