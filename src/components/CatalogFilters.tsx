import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CatalogFilters({
  categories,
  activeCategory,
  query,
}: {
  categories: Category[];
  activeCategory?: string;
  query?: string;
}) {
  function buildHref(categorySlug?: string) {
    const params = new URLSearchParams();
    if (categorySlug) params.set("categoria", categorySlug);
    if (query) params.set("q", query);
    const search = params.toString();
    return search ? `/?${search}` : "/";
  }

  return (
    <div className="flex flex-col gap-4">
      <form action="/" method="get" className="flex gap-2">
        {activeCategory && (
          <input type="hidden" name="categoria" value={activeCategory} />
        )}
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar productos..."
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-black transition-colors"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2 scrollbar-thin">
        <Link
          href={buildHref(undefined)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !activeCategory
              ? "border-accent bg-accent text-black"
              : "border-border text-muted hover:border-accent hover:text-accent"
          }`}
        >
          Todas
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildHref(category.slug)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === category.slug
                ? "border-accent bg-accent text-black"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
