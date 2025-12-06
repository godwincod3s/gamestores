import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 border-b">
      <nav className="max-w-6xl mx-auto flex justify-between">
        <Link href="/" className="font-bold">
          GameStores
        </Link>
        <div className="space-x-4">
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>
    </header>
  );
}
