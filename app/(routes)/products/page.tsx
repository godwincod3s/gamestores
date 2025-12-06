import ProductCard from '@/components/ProductCard';
import { fetchWooProducts } from '@/lib/wooQueries';

export const revalidate = 60; // ISR


export default async function ProductsPage() {
  const [wooProducts] = await Promise.all([fetchWooProducts()]);

    if (wooProducts.length === 0) {
        return (
        <div className="p-5 text-center text-gray-600">
            <h2 className="text-xl font-semibold">No products available</h2>
            <p>We couldn’t load products at the moment. Please try again later.</p>
        </div>
        );
    }



    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wooProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}