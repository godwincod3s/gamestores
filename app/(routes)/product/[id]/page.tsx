import Image from "next/image";

export async function generateStaticParams() {
    // fetching slugs optionally to pre-render
    return [];
}

// WooCommerce REST API helper
async function fetchWooProduct(id: string) {
    const url = `${process.env.WC_API_URL}/wp-json/wc/v3/products/${id}`;
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

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const [wooProduct] = await Promise.all([fetchWooProduct(id)]);
    console.log({wooProduct})


    if (!wooProduct) return <p>Product not found</p>;

    const src_url: string = wooProduct.images?.[0]?.thumbnail || 
                  wooProduct.images?.[0]?.src || 
                  wooProduct.image?.sourceUrl || 
                  '/placeholder.png';


    return (
        <div>
            <h1 className="text-2xl font-bold">{wooProduct.name}</h1>
            <Image src={src_url} alt={wooProduct.name} width={100} height={100} className="w-full max-w-md" />
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: wooProduct.description }} />
            <p className="mt-2 font-semibold">Price: {wooProduct.price}</p>
        </div>
    );
}