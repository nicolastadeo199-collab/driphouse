"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

type ProductHit = { slug: string; name: string; price: number; image?: string };
type CategoryHit = { slug: string; name: string };

export default function SearchAutosuggest({
  products,
  categories,
  className = "",
}: {
  products: ProductHit[];
  categories: CategoryHit[];
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = debouncedQuery.trim().toLowerCase();
  const productHits = q
    ? products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const categoryHits = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const allHits = [
    ...productHits.map((p) => ({ type: "product" as const, href: `/producto/${p.slug}` })),
    ...categoryHits.map((c) => ({ type: "category" as const, href: `/catalogo?categoria=${c.slug}` })),
  ];

  function submitSearch() {
    router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allHits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && allHits[activeIndex]) {
        router.push(allHits[activeIndex].href);
        setOpen(false);
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open && allHits.length > 0}
        aria-controls="search-listbox"
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        aria-label="Buscar productos o categorías"
        className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {open && q && (
        <ul
          id="search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-background-elevated shadow-xl"
        >
          {allHits.length === 0 ? (
            <li className="px-3 py-4 text-sm text-muted">
              No encontramos nada con «{debouncedQuery}». Mirá el{" "}
              <Link href="/catalogo" className="text-accent" onClick={() => setOpen(false)}>
                catálogo completo
              </Link>
              .
            </li>
          ) : (
            <>
              {productHits.map((p, i) => (
                <li key={p.slug} role="option" aria-selected={activeIndex === i}>
                  <Link
                    href={`/producto/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm ${
                      activeIndex === i ? "bg-accent/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black">
                      {p.image && <Image src={p.image} alt="" fill className="object-cover" />}
                    </span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="shrink-0 text-accent">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
              {categoryHits.map((c, i) => {
                const idx = productHits.length + i;
                return (
                  <li key={c.slug} role="option" aria-selected={activeIndex === idx}>
                    <Link
                      href={`/catalogo?categoria=${c.slug}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm text-muted ${
                        activeIndex === idx ? "bg-accent/10" : "hover:bg-white/5"
                      }`}
                    >
                      Ver categoría <span className="font-medium text-foreground">{c.name}</span>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
