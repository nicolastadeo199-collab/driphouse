import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import TrendsCuration from "@/components/home/TrendsCuration";
import CommunityBanner from "@/components/home/CommunityBanner";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoriesWithThumb, products] = await Promise.all([
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
    prisma.product.findMany({
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        variants: { select: { size: true, stock: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  const categoryTiles = categoriesWithThumb.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.products[0]?.images[0]?.url,
  }));

  // "Recién llegado" y "A pedido" están respaldados por datos reales (más nuevo /
  // availability real). "Lo más pedido" y "Elegidos por vos" todavía no tienen una
  // señal real detrás (no hay tracking de pedidos ni votos del Club) — hasta que
  // exista esa data, muestran una selección curada manualmente en vez de inventar
  // una métrica falsa.
  const recienLlegado = products[0];
  const aPedido = products.find((p) => p.availability === "MADE_TO_ORDER");
  const masPedido = products[1];
  const elegidosPorVos = products.find(
    (p) => p.id !== recienLlegado?.id && p.id !== aPedido?.id && p.id !== masPedido?.id
  );

  type TrendBlockData = { title: string; href: string; image?: string };
  const trendBlocks: TrendBlockData[] = [
    recienLlegado && { title: "Recién llegado", href: "/catalogo", image: recienLlegado.images[0]?.url },
    masPedido && { title: "Lo más pedido", href: "/catalogo", image: masPedido.images[0]?.url },
    aPedido && { title: "A pedido", href: "/catalogo", image: aPedido.images[0]?.url },
    elegidosPorVos && { title: "Elegidos por vos", href: "/catalogo", image: elegidosPorVos.images[0]?.url },
  ].filter(Boolean) as TrendBlockData[];

  const destacados = products.slice(0, 8).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    status: p.status,
    availability: p.availability,
    createdAt: p.createdAt.toISOString(),
    images: p.images,
    variants: p.variants,
  }));

  return (
    <div>
      <Hero />

      <section className="border-b border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Explorá" title="Categorías" />
          <CategoryTiles categories={categoryTiles} />
        </div>
      </section>

      <TrendsCuration blocks={trendBlocks} />

      <CommunityBanner />

      {destacados.length > 0 && (
        <section className="border-b border-border bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading eyebrow="Lo nuevo" title="Destacados" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {destacados.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
