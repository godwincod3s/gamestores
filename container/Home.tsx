import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">GameStores</h1>
      <p className="mt-2">Headless WordPress + Next.js starter</p>
      <div className="mt-6">
        <Link href="/products" className="underline">Browse products</Link>
      </div>
    </div>
  );
}