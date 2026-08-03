import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CatalogFilters from "@/components/CatalogFilters";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ categoria?: string; q?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria, q } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (categoria) {
    where.category = { slug: categoria };
  }
  if (q) {
    where.name = { contains: q };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-graffiti text-4xl text-accent text-glow">Catálogo</h1>
        <p className="mt-2 text-sm text-muted">
          Stock, encargos y trends. Articulos 100% originales.
        </p>
      </div>

      <div className="mb-6">
        <CatalogFilters categories={categories} activeCategory={categoria} query={q} />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No encontramos productos con esos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
