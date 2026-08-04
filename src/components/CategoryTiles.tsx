import Link from "next/link";
import Image from "next/image";

type CategoryTile = { id: string; name: string; slug: string; image?: string };

export default function CategoryTiles({ categories }: { categories: CategoryTile[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalogo?categoria=${category.slug}`}
          className="group relative block h-40 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-black sm:h-48 sm:w-40 md:h-56 md:w-full"
        >
          {category.image ? (
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(max-width: 768px) 160px, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted">
              Sin foto
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-3 pt-8 text-center text-xs font-bold uppercase tracking-wide text-white group-hover:text-accent">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
