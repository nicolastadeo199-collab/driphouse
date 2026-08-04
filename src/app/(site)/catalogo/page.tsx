import { prisma } from "@/lib/prisma";
import CatalogExplorer from "@/components/CatalogExplorer";
import Breadcrumb from "@/components/Breadcrumb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo",
  description: "Catálogo completo de DripHouse — stock, encargos y trends 100% originales.",
};

type SearchParams = Promise<{ categoria?: string; q?: string }>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria, q } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: { orderBy: { order: "asc" }, take: 2 },
        variants: { select: { size: true, stock: true } },
        category: { select: { slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
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

  const activeCategory = categoria ? categories.find((c) => c.slug === categoria) : undefined;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Catálogo", href: activeCategory ? "/catalogo" : undefined },
    ...(activeCategory ? [{ label: activeCategory.name }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6">
        <h1 className="font-graffiti text-2xl text-accent sm:text-3xl">Catálogo</h1>
        <p className="mt-1 text-sm text-muted">
          Stock, encargos y trends. Articulos 100% originales.
        </p>
      </div>

      <CatalogExplorer
        products={explorerProducts}
        categories={categories}
        initialCategorySlug={categoria}
        initialQuery={q}
      />
    </div>
  );
}
