import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-muted hover:text-accent">
        &larr; Volver a productos
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold text-foreground">Nuevo producto</h1>

      {categories.length === 0 ? (
        <p className="text-sm text-muted">
          Primero tenes que crear al menos una{" "}
          <Link href="/admin/categorias" className="text-accent">
            categoría
          </Link>
          .
        </p>
      ) : (
        <ProductForm action={createProductAction} categories={categories} submitLabel="Crear producto" />
      )}
    </div>
  );
}
