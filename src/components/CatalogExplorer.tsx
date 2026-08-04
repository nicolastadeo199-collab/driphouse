"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Chip from "@/components/ui/Chip";
import { swatchColor } from "@/lib/colors";

type Category = { id: string; name: string; slug: string };

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: string;
  availability: string;
  color: string | null;
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
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("novedad");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const productsInCategory = useMemo(
    () => (categorySlug ? products.filter((p) => p.categorySlug === categorySlug) : products),
    [products, categorySlug]
  );

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    productsInCategory.forEach((p) => p.variants.forEach((v) => sizes.add(v.size)));
    return Array.from(sizes).sort();
  }, [productsInCategory]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    productsInCategory.forEach((p) => {
      if (p.color) colors.add(p.color);
    });
    return Array.from(colors).sort();
  }, [productsInCategory]);

  function toggleFromSet(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
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
      if (selectedColors.size > 0 && !(p.color && selectedColors.has(p.color))) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price;
      if (sort === "precio-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [productsInCategory, query, priceMin, priceMax, selectedSizes, selectedColors, sort]);

  const activeFilterCount =
    (categorySlug ? 1 : 0) + selectedSizes.size + selectedColors.size + (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  const filtersPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Categoría</h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setCategorySlug("")}
            className={`rounded px-2 py-1.5 text-left text-sm transition-colors ${
              !categorySlug ? "bg-accent/15 text-accent" : "text-foreground hover:bg-white/5"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategorySlug(category.slug)}
              className={`rounded px-2 py-1.5 text-left text-sm transition-colors ${
                categorySlug === category.slug ? "bg-accent/15 text-accent" : "text-foreground hover:bg-white/5"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {availableColors.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Color</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const active = selectedColors.has(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleFromSet(selectedColors, setSelectedColors, color)}
                  title={color}
                  aria-pressed={active}
                  aria-label={color}
                  className={`h-8 w-8 shrink-0 rounded-full border-2 transition-transform ${
                    active ? "border-accent scale-110" : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: swatchColor(color) }}
                />
              );
            })}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Talle</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Chip
                key={size}
                active={selectedSizes.has(size)}
                onClick={() => toggleFromSet(selectedSizes, setSelectedSizes, size)}
              >
                {size}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Precio</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Mín."
            aria-label="Precio mínimo"
            className="w-full min-w-0 rounded border border-border bg-background-elevated px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
          <span className="shrink-0 text-muted">—</span>
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Máx."
            aria-label="Precio máximo"
            className="w-full min-w-0 rounded border border-border bg-background-elevated px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none md:max-w-sm"
        />
      </div>

      <div className="md:grid md:grid-cols-[220px_1fr] md:items-start md:gap-8">
        <aside className="mb-6 md:sticky md:top-20 md:mb-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="mb-3 flex w-full items-center justify-between rounded border border-border px-3 py-2 text-sm font-medium md:hidden"
          >
            <span>
              Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </span>
            <span aria-hidden="true">{filtersOpen ? "▲" : "▼"}</span>
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} md:block`}>{filtersPanel}</div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </p>
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

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted">No encontramos productos con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
