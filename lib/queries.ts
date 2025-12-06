export const GET_PRODUCTS = `
    query GetProducts($first: Int) {
        products(first: $first) {
            nodes {
                id
                name
                slug
                ... on SimpleProduct {
                        price
                    }
                image {
                    sourceUrl
                }
            }
        }
    }
`;

export const GET_PRODUCT_BY_SLUG = `
    query GetProductBySlug($slug: ID!) {
        product(id: $slug, idType: SLUG) {
            id
            name
            slug
            description
            image {
                sourceUrl
            }
            ... on SimpleProduct {
                price
            }
        }
    }
`;

export const GET_POSTS = `
    query GetPosts($first: Int) {
        posts(first: $first) {
            nodes { id title slug excerpt date featuredImage { node { sourceUrl } } }
        }
    }
`;
