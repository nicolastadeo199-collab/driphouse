import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import SearchAutosuggest from "@/components/SearchAutosuggest";
import MegaMenu from "@/components/MegaMenu";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function Header() {
  const [categoriesWithThumb, products] = await Promise.all([
    prisma.category
      .findMany({
        orderBy: { order: "asc" },
        include: {
          products: {
            take: 1,
            orderBy: { createdAt: "desc" },
            include: { images: { take: 1, orderBy: { order: "asc" } } },
          },
        },
      })
      .catch(() => []),
    prisma.product
      .findMany({
        select: {
          slug: true,
          name: true,
          price: true,
          images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
        },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
  ]);

  const categories = categoriesWithThumb.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  const categoryTiles = categoriesWithThumb.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.products[0]?.images[0]?.url,
  }));

  const productHits = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images[0]?.url,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Logo />

        <SearchAutosuggest products={productHits} categories={categories} className="hidden max-w-xs flex-1 md:block" />

        <nav className="ml-auto hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-accent transition-colors">
            Catálogo
          </Link>
          <MegaMenu categories={categoryTiles} />
          <Link href="/info" className="hover:text-accent transition-colors">
            Info
          </Link>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp"
            className="text-accent hover:opacity-80"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </nav>

        <div className="ml-auto md:hidden">
          <MobileNav categories={categories} products={productHits} />
        </div>
      </div>
    </header>
  );
}
