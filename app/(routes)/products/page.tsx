import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // ISR

// WooCommerce REST API helper
async function fetchWooProducts() {
    const url = `${process.env.WC_API_URL}/wp-json/wc/v3/products?per_page=10`;
    const response = await fetch(url, {
    headers: {
        Authorization: `Basic ${btoa(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`)}`,
    },
    });

    if (!response.ok) {
    console.error('Failed to fetch WooCommerce products', await response.text());
    return [];
    }

    return response.json();
}


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