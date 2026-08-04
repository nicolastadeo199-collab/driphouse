"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { deleteUploadedImage, saveUploadedImage } from "@/lib/upload";
import { uniqueCategorySlug, uniqueProductSlug } from "@/lib/slug";

function parseVariants(formData: FormData) {
  const sizes = formData.getAll("variantSize").map(String);
  const stocks = formData.getAll("variantStock").map(String);

  return sizes
    .map((size, i) => ({ size: size.trim(), stock: Number(stocks[i] ?? 0) }))
    .filter((v) => v.size.length > 0);
}

function parseAvailabilityFields(formData: FormData) {
  const availability = formData.get("availability") === "MADE_TO_ORDER" ? "MADE_TO_ORDER" : "IN_STOCK";
  const leadTimeMinDaysRaw = formData.get("leadTimeMinDays");
  const leadTimeMaxDaysRaw = formData.get("leadTimeMaxDays");

  return {
    availability,
    leadTimeMinDays:
      availability === "MADE_TO_ORDER" && leadTimeMinDaysRaw ? Number(leadTimeMinDaysRaw) : null,
    leadTimeMaxDays:
      availability === "MADE_TO_ORDER" && leadTimeMaxDaysRaw ? Number(leadTimeMaxDaysRaw) : null,
  };
}

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let valid: boolean;
  try {
    valid = await verifyAdminCredentials(email, password);
  } catch {
    return { error: "El servidor no tiene configuradas las credenciales de admin." };
  }

  if (!valid) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const categoryId = String(formData.get("categoryId") ?? "");
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const sizeGuideNote = String(formData.get("sizeGuideNote") ?? "").trim() || null;
  const status = formData.get("status") === "SOLD_OUT" ? "SOLD_OUT" : "AVAILABLE";
  const { availability, leadTimeMinDays, leadTimeMaxDays } = parseAvailabilityFields(formData);
  const variants = parseVariants(formData);
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  if (!name || !categoryId) {
    throw new Error("Faltan datos obligatorios del producto.");
  }

  const slug = await uniqueProductSlug(name);
  const imageUrls = await Promise.all(imageFiles.map((file) => saveUploadedImage(file)));

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      categoryId,
      brand,
      color,
      sizeGuideNote,
      status,
      availability,
      leadTimeMinDays,
      leadTimeMaxDays,
      images: {
        create: imageUrls.map((url, index) => ({ url, order: index })),
      },
      variants: {
        create: variants,
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/productos");
  redirect(`/admin/productos?creado=${product.slug}`);
}

export async function updateProductAction(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const categoryId = String(formData.get("categoryId") ?? "");
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const sizeGuideNote = String(formData.get("sizeGuideNote") ?? "").trim() || null;
  const status = formData.get("status") === "SOLD_OUT" ? "SOLD_OUT" : "AVAILABLE";
  const { availability, leadTimeMinDays, leadTimeMaxDays } = parseAvailabilityFields(formData);
  const variants = parseVariants(formData);
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const removeImageIds = formData.getAll("removeImageIds").map(String);

  if (!name || !categoryId) {
    throw new Error("Faltan datos obligatorios del producto.");
  }

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!existing) {
    throw new Error("El producto no existe.");
  }

  const slug = existing.name === name ? existing.slug : await uniqueProductSlug(name, productId);

  const imagesToRemove = existing.images.filter((img) => removeImageIds.includes(img.id));
  const newImageUrls = await Promise.all(imageFiles.map((file) => saveUploadedImage(file)));
  const currentMaxOrder = existing.images.length;

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        brand,
        color,
        sizeGuideNote,
        status,
        availability,
        leadTimeMinDays,
        leadTimeMaxDays,
      },
    }),
    prisma.productVariant.deleteMany({ where: { productId } }),
    prisma.product.update({
      where: { id: productId },
      data: {
        variants: {
          create: variants,
        },
      },
    }),
    ...(imagesToRemove.length
      ? [prisma.productImage.deleteMany({ where: { id: { in: imagesToRemove.map((i) => i.id) } } })]
      : []),
    ...(newImageUrls.length
      ? [
          prisma.product.update({
            where: { id: productId },
            data: {
              images: {
                create: newImageUrls.map((url, index) => ({
                  url,
                  order: currentMaxOrder + index,
                })),
              },
            },
          }),
        ]
      : []),
  ]);

  await Promise.all(imagesToRemove.map((img) => deleteUploadedImage(img.url)));

  revalidatePath("/");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/admin/productos");
  redirect(`/admin/productos?actualizado=${slug}`);
}

export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product) return;

  await prisma.product.delete({ where: { id: productId } });
  await Promise.all(product.images.map((img) => deleteUploadedImage(img.url)));

  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const slug = await uniqueCategorySlug(name);
  const count = await prisma.category.count();

  await prisma.category.create({ data: { name, slug, order: count } });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
}

export async function deleteCategoryAction(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!categoryId) return;

  const productsInCategory = await prisma.product.count({ where: { categoryId } });
  if (productsInCategory > 0) {
    redirect("/admin/categorias?error=tiene-productos");
  }

  await prisma.category.delete({ where: { id: categoryId } });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?eliminada=1");
}
