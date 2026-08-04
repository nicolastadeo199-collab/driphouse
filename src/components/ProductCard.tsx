import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getProductBadge } from "@/lib/badges";
import Badge from "@/components/ui/Badge";

type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  status: string;
  availability: string;
  createdAt: Date | string;
  images: { url: string }[];
  variants: { stock: number }[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [primaryImage, secondaryImage] = product.images;
  const soldOut = product.status === "SOLD_OUT";
  const badge = getProductBadge(product);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-background-elevated transition-colors hover:border-accent"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {primaryImage ? (
          <>
            {/* Desktop: crossfade to second photo on hover */}
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover transition-opacity duration-200 ${
                  secondaryImage ? "group-hover:opacity-0" : ""
                } ${soldOut ? "opacity-40 grayscale" : ""}`}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${soldOut ? "opacity-40 grayscale" : ""}`}
                />
              )}
            </div>

            {/* Mobile: native swipe between photos, no JS */}
            <div className="flex h-full snap-x snap-mandatory overflow-x-auto md:hidden [&::-webkit-scrollbar]:hidden">
              {(secondaryImage ? [primaryImage, secondaryImage] : [primaryImage]).map((img, i) => (
                <div key={i} className="relative h-full w-full shrink-0 snap-center">
                  <Image
                    src={img.url}
                    alt={i === 0 ? product.name : ""}
                    fill
                    sizes="50vw"
                    className={`object-cover ${soldOut ? "opacity-40 grayscale" : ""}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Sin foto
          </div>
        )}

        {badge && <Badge variant={badge} className="absolute left-2 top-2" />}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-accent">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
