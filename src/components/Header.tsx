import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";

export default async function Header() {
  const categories = await prisma.category
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-accent transition-colors">
            Catálogo
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?categoria=${category.slug}`}
              className="hover:text-accent transition-colors"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/info" className="hover:text-accent transition-colors">
            Info
          </Link>
        </nav>

        <MobileNav categories={categories} />
      </div>
    </header>
  );
}
