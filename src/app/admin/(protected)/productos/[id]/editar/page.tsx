import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-muted hover:text-accent">
        &larr; Volver a productos
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold text-foreground">Editar producto</h1>

      <ProductForm
        action={updateAction}
        categories={categories}
        submitLabel="Guardar cambios"
        defaults={{
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          sizes: product.sizes,
          status: product.status,
          images: product.images,
        }}
      />
    </div>
  );
}
