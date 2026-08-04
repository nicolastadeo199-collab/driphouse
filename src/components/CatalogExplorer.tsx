"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Chip from "@/components/ui/Chip";

type Category = { id: string; name: string; slug: string };

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: string;
  availability: string;
  createdAt: string;
  categorySlug: string;
  images: { url: string }[];
  variants: { size: string; stock: number }[];
};

type SortKey = "novedad" | "precio-asc" | "precio-desc";

export default function CatalogExplorer({
  products,
  categories,
  initialCategorySlug,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug ?? "");
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("novedad");

  const productsInCategory = useMemo(
    () => (categorySlug ? products.filter((p) => p.categorySlug === categorySlug) : products),
    [products, categorySlug]
  );

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    productsInCategory.forEach((p) => p.variants.forEach((v) => sizes.add(v.size)));
    return Array.from(sizes).sort();
  }, [productsInCategory]);

  function toggleSize(size: string) {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = priceMin ? Number(priceMin) : undefined;
    const max = priceMax ? Number(priceMax) : undefined;

    let list = productsInCategory.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (min !== undefined && p.price < min) return false;
      if (max !== undefined && p.price > max) return false;
      if (selectedSizes.size > 0 && !p.variants.some((v) => selectedSizes.has(v.size))) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price;
      if (sort === "precio-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [productsInCategory, query, priceMin, priceMax, selectedSizes, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Ordenar por"
            className="shrink-0 rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="novedad">Novedad</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={!categorySlug} onClick={() => setCategorySlug("")}>
            Todas
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              active={categorySlug === category.slug}
              onClick={() => setCategorySlug(category.slug)}
            >
              {category.name}
            </Chip>
          ))}
        </div>

        {availableSizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Talle</span>
            {availableSizes.map((size) => (
              <Chip key={size} active={selectedSizes.has(size)} onClick={() => toggleSize(size)}>
                {size}
              </Chip>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Precio</span>
          <input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Mín."
            aria-label="Precio mínimo"
            className="w-24 rounded border border-border bg-background-elevated px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Máx."
            aria-label="Precio máximo"
            className="w-24 rounded border border-border bg-background-elevated px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <p className="mb-4 mt-6 text-xs font-medium uppercase tracking-wide text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No encontramos productos con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
