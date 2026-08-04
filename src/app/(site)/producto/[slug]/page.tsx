import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailInteractive from "@/components/ProductDetailInteractive";
import AvailabilityIndicator from "@/components/AvailabilityIndicator";
import ShippingInfo from "@/components/ShippingInfo";
import ProductCard from "@/components/ProductCard";
import Badge from "@/components/ui/Badge";
import { getProductBadge } from "@/lib/badges";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
      category: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const image = product.images[0]?.url;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const soldOut = product.status === "SOLD_OUT";
  const badge = getProductBadge(product);

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 2 },
      variants: { select: { size: true, stock: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    url: siteUrl ? `${siteUrl}/producto/${product.slug}` : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.price,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : product.availability === "MADE_TO_ORDER"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
            <span>{product.category.name}</span>
            {product.brand && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.brand}</span>
              </>
            )}
            {product.color && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.color}</span>
              </>
            )}
          </div>

          <h1 className="mt-1 text-2xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-accent">{formatPrice(product.price)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {badge && <Badge variant={badge} />}
            <AvailabilityIndicator
              availability={product.availability}
              leadTimeMinDays={product.leadTimeMinDays}
              leadTimeMaxDays={product.leadTimeMaxDays}
            />
          </div>

          {product.availability === "MADE_TO_ORDER" && <ShippingInfo variant="compact" />}

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-muted">Descripción</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {product.description}
            </p>
          </div>

          <ProductDetailInteractive
            productName={product.name}
            variants={product.variants.map((v) => ({ size: v.size, stock: soldOut ? 0 : v.stock }))}
            sizeGuideNote={product.sizeGuideNote}
          />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Tambien te puede interesar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
