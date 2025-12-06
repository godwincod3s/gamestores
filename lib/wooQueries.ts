// WooCommerce REST API helper
export async function fetchWooProducts() {
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

/**
 * Fetch the most recent products from WooCommerce
 * @param perPage - Number of products to fetch (default: 10)
 * @returns Array of recent products sorted by date (newest first)
 */
export async function fetchRecentProducts(perPage: number = 10) {
    const url = `${process.env.WC_API_URL}/wp-json/wc/v3/products?per_page=${perPage}&orderby=date&order=desc`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${btoa(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`)}`,
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch recent WooCommerce products', await response.text());
        return [];
    }

    return response.json();
}

/**
 * Fetch trending/best-selling products from WooCommerce
 * @param perPage - Number of products to fetch (default: 10)
 * @returns Array of best-selling products
 */
export async function fetchTrendingProducts(perPage: number = 10) {
    const url = `${process.env.WC_API_URL}/wp-json/wc/v3/products?per_page=${perPage}&orderby=popularity&order=desc`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${btoa(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`)}`,
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch trending WooCommerce products', await response.text());
        return [];
    }

    return response.json();
}

/**
 * Fetch top-rated products from WooCommerce
 * @param perPage - Number of products to fetch (default: 10)
 * @returns Array of top-rated products
 */
export async function fetchTopRatedProducts(perPage: number = 10) {
    const url = `${process.env.WC_API_URL}/wp-json/wc/v3/products?per_page=${perPage}&orderby=rating&order=desc`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${btoa(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`)}`,
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch top-rated WooCommerce products', await response.text());
        return [];
    }

    return response.json();
}