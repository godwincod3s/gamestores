
import { cn, stripHtml, removePTags } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
// app/blog/page.tsx 
import { GET_POSTS } from '@/lib/queries';
import { getClient } from '@/lib/wpClient';
import Image from "next/image";

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

  const blogs = [ ...posts, ...items]
  console.log(posts)

  return (
    <div className="container mx-auto px-4 py-6 mb-20">

      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      
     <BentoGrid className="max-w-4xl mx-auto">
        {blogs.map((item, i) => {
          const url = item.featuredImage?.node?.sourceUrl;

          return (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description || removePTags(stripHtml(item.excerpt)).substring(0, 80) + '...' }
            header={ url ? image(url)  : item.header}
            icon={item.icon || <IconSignature className="h-4 w-4 text-neutral-500" />}
            className={cn(i === 3 || i === 6 ? "md:col-span-2" : "", "overflow-hidden")}
        />
        )}
      )}
     </BentoGrid>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {blogs.length ? (
          blogs.map((post: any) => (
            <div key={post.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt || post.description }} />
            </div>
            
          ))
        ) : (
          <p>No blog posts found.</p>
        )}
      </div> */}

    </div>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const image = (url: string) => (
  <Image width={100} height={100} src={url} alt="post image" className="w-full h-full min-h-[6rem] rounded-xl" />
);

const items = [
  {
    id: 1,
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 2,
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 3,
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 4,
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 5,
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 6,
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    id: 7,
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries.",
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];