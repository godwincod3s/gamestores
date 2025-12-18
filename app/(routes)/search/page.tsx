import React from "react";
import fetch from "node-fetch";
import { notFound } from "next/navigation";

const WP_BASE = process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_API_URL;
const WC_BASE = process.env.WC_API_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const { q } = await searchParams || { q: '' };
  // const q = (searchParams?.q || "").trim();

  if (!q) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-sm text-neutral-500 mt-2">Enter a search query to find posts and products.</p>
      </div>
    );
  }

  // server-side fetch posts
  const postsResp = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=8`);
  const posts = postsResp.ok ? await postsResp.json() as any[] : [];

  let products: any[] = [];
  if (WC_BASE && WC_KEY && WC_SECRET) {
    const wcUrl = `${WC_BASE}/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&per_page=12`;
    const wcResp = await fetch(wcUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`,
      },
    });
    products = wcResp.ok ? await wcResp.json() as any[] : [];
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search results for “{q}”</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        {products.length === 0 ? <div className="text-sm text-neutral-500">No products found.</div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <a key={p.id} href={`/product/${p.id}`} className="border rounded-md p-3 hover:shadow">
                <div className="h-36 mb-3 overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.images?.[0]?.src ? <img src={p.images[0].src} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-sm text-neutral-400">No image</div>}
                </div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-neutral-500">{p.price ?? "—"}</div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Posts</h2>
        {posts.length === 0 ? <div className="text-sm text-neutral-500">No posts found.</div> : (
          <div className="grid grid-cols-1 gap-3">
            {posts.map((post: any) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="block border rounded-md p-3 hover:shadow">
                <div className="font-semibold">{post.title.rendered ?? post.title}</div>
                <div className="text-sm text-neutral-500 mt-1">{(post.excerpt && post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 200)) || ""}</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}