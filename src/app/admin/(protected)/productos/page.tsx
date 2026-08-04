import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SortKey = "name" | "price" | "status" | "categoria" | "createdAt";

type SearchParams = Promise<{ sort?: string; dir?: string; creado?: string; actualizado?: string }>;

const SORT_LABELS: Record<SortKey, string> = {
  name: "Nombre",
  price: "Precio",
  status: "Estado",
  categoria: "Categoría",
  createdAt: "Cargado",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sort, dir, creado, actualizado } = await searchParams;
  const sortKey: SortKey = (["name", "price", "status", "categoria", "createdAt"] as const).includes(
    sort as SortKey
  )
    ? (sort as SortKey)
    : "createdAt";
  const direction: "asc" | "desc" = dir === "asc" ? "asc" : "desc";

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortKey === "categoria"
      ? { category: { name: direction } }
      : { [sortKey]: direction };

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
    orderBy,
  });

  function sortHref(key: SortKey) {
    const nextDir = sortKey === key && direction === "asc" ? "desc" : "asc";
    return `/admin/productos?sort=${key}&dir=${nextDir}`;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          + Nuevo producto
        </Link>
      </div>

      {creado && (
        <p className="mb-4 rounded border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Producto creado correctamente.
        </p>
      )}
      {actualizado && (
        <p className="mb-4 rounded border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Producto actualizado correctamente.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-background-elevated text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3">Foto</th>
              {(["name", "categoria", "price", "status", "createdAt"] as const).map((key) => (
                <th key={key} className="px-3 py-3">
                  <Link href={sortHref(key)} className="hover:text-accent">
                    {SORT_LABELS[key]}
                    {sortKey === key ? (direction === "asc" ? " ↑" : " ↓") : ""}
                  </Link>
                </th>
              ))}
              <th className="px-3 py-3">Marca</th>
              <th className="px-3 py-3">Disponibilidad</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded bg-black">
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt="" fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 font-medium text-foreground">{product.name}</td>
                <td className="px-3 py-2 text-muted">{product.category.name}</td>
                <td className="px-3 py-2 text-accent">{formatPrice(product.price)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      product.status === "AVAILABLE"
                        ? "bg-accent/20 text-accent"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {product.status === "AVAILABLE" ? "Disponible" : "Agotado"}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted">{product.brand ?? "—"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      product.availability === "MADE_TO_ORDER"
                        ? "bg-warning/15 text-warning"
                        : "text-muted"
                    }`}
                  >
                    {product.availability === "MADE_TO_ORDER" ? "A pedido" : "Stock inmediato"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="text-muted hover:text-accent"
                    >
                      Editar
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-muted">
                  Todavia no cargaste productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
