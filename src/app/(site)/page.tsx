import { prisma } from "@/lib/prisma";
import CatalogExplorer from "@/components/CatalogExplorer";
import CategoryTiles from "@/components/CategoryTiles";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ categoria?: string; q?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria, q } = await searchParams;

  const [products, categoriesWithThumb] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: { orderBy: { order: "asc" }, take: 2 },
        variants: { select: { size: true, stock: true } },
        category: { select: { slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        products: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { images: { take: 1, orderBy: { order: "asc" } } },
        },
      },
    }),
  ]);

  const explorerProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    status: p.status,
    availability: p.availability,
    color: p.color,
    createdAt: p.createdAt.toISOString(),
    categorySlug: p.category.slug,
    images: p.images,
    variants: p.variants,
  }));

  const categories = categoriesWithThumb.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  const categoryTiles = categoriesWithThumb.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.products[0]?.images[0]?.url,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-graffiti text-4xl text-accent text-glow">Catálogo</h1>
        <p className="mt-2 text-sm text-muted">
          Stock, encargos y trends. Articulos 100% originales.
        </p>
      </div>

      <CategoryTiles categories={categoryTiles} />

      <CatalogExplorer
        products={explorerProducts}
        categories={categories}
        initialCategorySlug={categoria}
        initialQuery={q}
      />
    </div>
  );
}
