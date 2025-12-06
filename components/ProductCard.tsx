import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded p-4">
      <img
        src={product.image?.sourceUrl}
        alt={product.name}
        className="w-full h-48 object-contain"
      />
      <h3 className="mt-2 font-medium">{product.name}</h3>
      <p className="mt-1">{product.price}</p>
      <Link
        href={`/product/${product.id}`}
        className="text-sm underline mt-2 block"
      >
        View
      </Link>
    </div>
  );
}
