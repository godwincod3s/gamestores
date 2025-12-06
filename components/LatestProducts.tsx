// components/LatestProducts.tsx
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import ProductScrollerCard from "@/components/base/ProductScrollerCard";
import { fetchRecentProducts } from "@/lib/wooQueries";

export default async function LatestProducts({
  perPage = 12,
}: {
  perPage?: number;
}) {
  // This runs on the server. Keeps your WC credentials hidden.
  const products = await fetchRecentProducts(perPage);

  // Map to items with `card` ReactNode — ProductScrollerCard is a client component.
  const items = products.map((p: any) => ({
    card: <ProductScrollerCard product={p} />,
    // fallback fields in case something consumes them:
    quote: p.short_description || p.excerpt || "",
    name: p.name,
    title: p.name,
  }));

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Most Recent Products</h2>
          <p className="text-sm text-neutral-500">Updated automatically</p>
        </div>

        <InfiniteMovingCards
          items={items}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          className="px-2"
        />
      </div>
    </section>
  );
}