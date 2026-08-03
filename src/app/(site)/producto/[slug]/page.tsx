import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseSizes } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import ContactButtons from "@/components/ContactButtons";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | DripHouse`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const sizes = parseSizes(product.sizes);
  const soldOut = product.status === "SOLD_OUT";

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-accent">{formatPrice(product.price)}</p>

          {soldOut && (
            <span className="mt-3 inline-block rounded bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Agotado
            </span>
          )}

          {sizes.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-muted">Talles disponibles</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded border border-border px-3 py-1 text-sm text-foreground"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-muted">Descripción</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-8">
            <ContactButtons productName={product.name} />
          </div>
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
