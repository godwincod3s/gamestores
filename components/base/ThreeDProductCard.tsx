"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
} from "@tabler/icons-react";
import { cn, formatCurrency } from "@/lib/utils";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/stateful-button";
import { useRouter} from "next/navigation"

export default function ThreeDProductCard({ product }: { product: any }) {
  const id = product.id ?? product.slug ?? product.name;
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  
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
        rawDesc.length > 60 ? removePTags(rawDesc).slice(0, 57).trimEnd() + "..." : rawDesc;
    
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
    <CardContainer className="overflow-hidden">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-1 lg:p-6 border  ">
        <button
            onClick={toggleLike}
            aria-label={liked ? "Unlike" : "Like"}
            className="absolute cursor-pointer right-4 top-4 z-1000 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900 shadow-sm hover:scale-105 transition transform"
            >
            {liked ? (
                <IconHeartFilled className="h-5 w-5 text-pink-500" />
            ) : (
                <IconHeart className="h-5 w-5 text-gray-500" />
            )}
        </button>
        {/* <CardItem
          as="p"
          translateZ="60"
          className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
        >
            {shortDesc}
        </CardItem> */}
        <CardItem translateZ="100" className="w-full mt-8">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              width={400}
              height={300}
              className="object-cover w-full h-40 md:h-48 rounded-md"
            />
          ) : (
            <div className="h-48 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
          )}
        </CardItem>
        <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white overflow-hidden"
            >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {product.name}
            </h3>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-lg font-bold text-emerald-600 dark:text-white">
            {formatCurrency(+priceDisplay || 0, 'NGN')}
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <Button
            onClick={addToCart}
            disabled={adding}
            className={cn(
              "rounded-md bg-gradient-to-br from-black to-neutral-600 py-2 px-1 lg:px-3 lg:py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition disabled:opacity-60",
              "dark:bg-zinc-800 dark:text-white"
            )}
          >
            <div className="inline-flex items-center gap-2">
              {adding ? "Adding" : "Add"} 
              <IconShoppingCart className="w-4 h-4" />
            </div>
          </Button>

          <button onClick={() => router.push(`/product/${product.id ?? product.slug}`)} className="bg-slate-50 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-100 rounded-full p-px text-xs font-semibold leading-6  text-black inline-block">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-100 py-0.5 px-4 ring-1 ring-white/10 ">
              <span>{`View`}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                ></path>
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </button>
        </div>
      </CardBody>
    </CardContainer>
  );
}