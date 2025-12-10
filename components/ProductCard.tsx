import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }: { product: any }) {
    // console.log(product.images[0].thumbnail, product.image)
    const src_url: string = product.images?.[0]?.thumbnail || 
                  product.images?.[0]?.src || 
                  product.image?.sourceUrl || 
                  '/placeholder.png';
  return (
    <div className="border rounded p-4">
      <Image
        src={src_url}
        alt={product.name}
        width={100}
        height={100}
        className="w-full h-48 object-contain"
      />
      <h3 className="mt-2 font-medium">{product.name}</h3>
      <p className="mt-1">{product.price}</p>
      <Link
        href={`/product/${product.id}`}
        className="text-sm underline mt-2 block"
      >
        Vie
      </Link>
    </div>
  );
}

//images: [
//     {
//         "id": 1189,
//         "date_created": "2025-11-27T03:45:24",
//         "date_created_gmt": "2025-11-27T03:45:24",
//         "date_modified": "2025-11-27T03:45:24",
//         "date_modified_gmt": "2025-11-27T03:45:24",
//         "src": "https://huulostores.com/wp-content/uploads/2025/11/xbox1111.webp",
//         "name": "xbox1111",
//         "alt": "",
//         "srcset": "https://huulostores.com/wp-content/uploads/2025/11/xbox1111.webp 1024w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-300x300.webp 300w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-150x150.webp 150w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-768x768.webp 768w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-500x500.webp 500w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-600x600.webp 600w, https://huulostores.com/wp-content/uploads/2025/11/xbox1111-100x100.webp 100w",
//         "sizes": "(max-width: 1024px) 100vw, 1024px",
//         "thumbnail": "https://huulostores.com/wp-content/uploads/2025/11/xbox1111-300x300.webp"
//     }
// ]