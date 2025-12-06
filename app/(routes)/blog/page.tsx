// app/blog/page.tsx
import { GET_POSTS } from '@/lib/queries';
import { getClient } from '@/lib/wpClient';

export const revalidate = 60; // ISR

// WPGraphQL helper for posts
async function fetchPosts() {
  const client = getClient();
  try {
    const data = await client.request(GET_POSTS, { first: 10 });
    return data.posts.nodes || [];
  } catch (error) {
    console.error('Failed to fetch posts via GraphQL:', error);
    return [];
  }
}

export default async function BlogPage() {
  const [posts] = await Promise.all([fetchPosts()]);

  return (
    <div className="container mx-auto px-4 py-6">

      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.length ? (
          posts.map((post: any) => (
            <div key={post.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </div>
          ))
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>

    </div>
  );
}
