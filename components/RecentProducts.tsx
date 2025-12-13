import ThreeDProductCard from "@/components/base/ThreeDProductCard";
import { fetchRecentProducts } from "@/lib/wooQueries";

export default async function LatestProducts({
  perPage = 12,
}: {
  perPage?: number;
}) {
  // This runs on the server. Keeps your WC credentials hidden.
  const products = await fetchRecentProducts(perPage) as any;

  // // Map to items with `card` ReactNode — ProductScrollerCard is a client component.
  // const items = products.map((p: any) => ({
  //   card: <ProductScrollerCard product={p} />,
  //   // fallback fields in case something consumes them:
  //   quote: p.short_description || p.excerpt || "",
  //   name: p.name,
  //   title: p.name,
  // }));

  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
    <div className="py-16 mx-auto px-2 md:px-6 lg:px-20">
      <h2 className="mb-8 text-2xl font-bold">Most Recent Products</h2>

      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 justify-center gap-2 lg:gap-4">
        {products.slice(0, 8).map((product: any, idx: number) => {
          return <ThreeDProductCard product={product} key={idx} />
        })}
      </div>
    </div>
  );
}


          //   <div className="flex gap-2">

          //     {/* <a
          //       // href={`/product/${product.id ?? product.slug}`}
          //       href="/"
          //       className={cn(
          //         "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition",
          //         "dark:bg-neutral-800 dark:text-white"
          //       )}
          //     >
          //       View
          //     </a> */}
          // </div>