import { prisma } from "@/lib/prisma";
import { createCategoryAction } from "@/app/admin/actions";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; eliminada?: string }>;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, eliminada } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-foreground">Categorías</h1>

      {error === "tiene-productos" && (
        <p className="mb-4 max-w-md rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          No se puede eliminar una categoría que tiene productos. Movelos o borralos primero.
        </p>
      )}
      {eliminada && (
        <p className="mb-4 max-w-md rounded border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Categoría eliminada.
        </p>
      )}

      <form action={createCategoryAction} className="mb-8 flex max-w-md gap-2">
        <input
          name="name"
          required
          placeholder="Nombre de la categoría (ej: Remeras)"
          className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Agregar
        </button>
      </form>

      <div className="max-w-md divide-y divide-border rounded-lg border border-border">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <p className="text-xs text-muted">{category._count.products} productos</p>
            </div>
            <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
          </div>
        ))}

        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted">
            Todavía no creaste categorías.
          </p>
        )}
      </div>
    </div>
  );
}
