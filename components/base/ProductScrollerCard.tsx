"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
} from "@tabler/icons-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function ProductScrollerCard({ product }: { product: any }) {
  const id = product.id ?? product.slug ?? product.name;
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`liked_product_${id}`);
      setLiked(saved === "1");
    } catch {
      // ignore
    }
  }, [id]);

  async function toggleLike() {
    try {
      const next = !liked;
      setLiked(next);
      localStorage.setItem(`liked_product_${id}`, next ? "1" : "0");

      // Attempt to sync with server wishlist for logged-in users
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          // user is authenticated -> call wishlist API
          const method = next ? "POST" : "DELETE";
          await fetch("/api/account/wishlist", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          });
        }
      } catch {
        // ignore server errors; keep local fallback
      }
    } catch {
      setLiked((v) => !v);
    }
  }

  async function addToCart() {
    try {
      setAdding(true);
      // Try server cart first (server stores cart in secure cookie)
      const res = await fetch("/api/account/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (res.ok) {
        // optionally show a toast / visual cue; we'll briefly animate the button
        setTimeout(() => setAdding(false), 700);
        return;
      }

      // If server returned 401 (not authenticated) or other, fallback to localStorage cart
      const localCartRaw = localStorage.getItem("gs_cart");
      let localCart = localCartRaw ? JSON.parse(localCartRaw) : [];
      const existing = localCart.find((i: any) => i.productId === product.id);
      if (existing) existing.quantity = (existing.quantity || 1) + 1;
      else localCart.push({ productId: product.id, quantity: 1, product });

      localStorage.setItem("gs_cart", JSON.stringify(localCart));
      setTimeout(() => setAdding(false), 700);
    } catch {
      setAdding(false);
    }
  }

  // price display (same logic as before)
  const price =
    product.price ??
    (product.prices ? product.prices.price : undefined) ??
    product.price_html ??
    product.regular_price ??
    product.sale_price ??
    "";

  let priceDisplay = "";
  if (product.price && product.price.toString().includes("-")) {
    priceDisplay = product.price;
  } else if (product.price) {
    priceDisplay = `${product.price}`;
  } else if (product.price_html) {
    priceDisplay = product.price_html;
  } else if (product.regular_price || product.sale_price) {
    priceDisplay = product.sale_price ? product.sale_price : product.regular_price;
  } else if (product.prices?.min && product.prices?.max) {
    priceDisplay = product.prices.min === product.prices.max
      ? product.prices.min
      : `${product.prices.min} - ${product.prices.max}`;
  } else {
    priceDisplay = "—";
  }

  const rawDesc =
    product.short_description ||
    product.excerpt ||
    (product.description ? stripHtml(product.description) : "");

  const shortDesc =
    rawDesc.length > 90 ? removePTags(rawDesc).slice(0, 87).trimEnd() + "..." : rawDesc;

  function stripHtml(html: string) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
  function removePTags(html: string) {
    return html.replace(/<\/?p[^>]*>/gi, "").trim();
  }

  const imgSrc =
    product.images?.[0]?.src ||
    product.images?.[0]?.thumbnail ||
    product.image?.sourceUrl ||
    product.thumbnail ||
    "";

  return (
    <div className="relative z-20 flex w-full flex-col gap-3">
      <button
        onClick={toggleLike}
        aria-label={liked ? "Unlike" : "Like"}
        className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900 shadow-sm hover:scale-105 transition transform"
      >
        {liked ? (
          <IconHeartFilled className="h-5 w-5 text-pink-500" />
        ) : (
          <IconHeart className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <div className="mb-4 flex items-center justify-center overflow-hidden rounded-lg">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            width={400}
            height={300}
            className="object-cover w-full h-40 md:h-48 rounded-md"
          />
        ) : (
          <div className="h-40 md:h-48 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      <div className="mb-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {shortDesc}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-lg font-bold text-emerald-600 dark:text-white">
          {formatCurrency(+priceDisplay || 0, 'NGN')}
        </div>

        <div className="flex gap-2">
          <button
            onClick={addToCart}
            disabled={adding}
            className={cn(
              "inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-black to-neutral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition disabled:opacity-60",
              "dark:bg-zinc-800 dark:text-white"
            )}
          >
            <IconShoppingCart className="w-4 h-4" />
            {adding ? "Adding..." : "Add"}
          </button>

          <a
            href={`/product/${product.id ?? product.slug}`}
            className={cn(
              "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition",
              "dark:bg-neutral-800 dark:text-white"
            )}
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}