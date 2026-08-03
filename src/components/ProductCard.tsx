import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  status: string;
  images: { url: string }[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0]?.url;
  const soldOut = product.status === "SOLD_OUT";

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-background-elevated transition-colors hover:border-accent"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${soldOut ? "opacity-40 grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Sin foto
          </div>
        )}

        {soldOut && (
          <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-accent">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
