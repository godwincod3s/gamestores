import { GraphQLClient } from 'graphql-request';


const endpoint = process.env.WP_GRAPHQL_ENDPOINT!;


export function getClient(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return new GraphQLClient(endpoint, { headers });
}